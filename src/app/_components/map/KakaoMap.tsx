'use client';

import { Box } from '@chakra-ui/react';
import { useEffect, useRef, useState, useCallback } from 'react';
import { AuctionProperty } from '@/app/_types/auction';
import { generateDummyProperties } from '@/app/_utils/dummyData';
import MapControls, { MapMode } from './MapControls';
import TerritoryInfo from './TerritoryInfo';

// Kakao Maps 타입 정의
interface KakaoLatLng {
  getLat(): number;
  getLng(): number;
}

interface KakaoMapBounds {
  getSouthWest(): KakaoLatLng;
  getNorthEast(): KakaoLatLng;
}

interface KakaoMapOptions {
  center: KakaoLatLng;
  level: number;
}

interface KakaoPolygonOptions {
  path: KakaoLatLng[];
  strokeWeight: number;
  strokeColor: string;
  strokeOpacity: number;
  fillColor: string;
  fillOpacity: number;
}

interface KakaoPolygon {
  setMap(map: KakaoMap | null): void;
  setOptions(options: Partial<KakaoPolygonOptions>): void;
}

type KakaoControl = object;

interface KakaoControlPosition {
  RIGHT: number;
  TOPRIGHT: number;
}

interface KakaoMap {
  addControl(control: KakaoControl, position: number): void;
  getCenter(): KakaoLatLng;
  getLevel(): number;
  setLevel(level: number): void;
  getBounds(): KakaoMapBounds;
  setCenter(position: KakaoLatLng): void;
}

interface KakaoMarker {
  setMap(map: KakaoMap | null): void;
  getPosition(): KakaoLatLng;
}

interface KakaoOverlay {
  setMap(map: KakaoMap | null): void;
}

interface KakaoMapEvent {
  addListener(target: KakaoMarker | KakaoMap | KakaoPolygon, type: string, handler: () => void): void;
  removeListener(target: KakaoMarker | KakaoMap | KakaoPolygon, type: string, handler: () => void): void;
}

interface KakaoMaps {
  LatLng: new (lat: number, lng: number) => KakaoLatLng;
  Map: new (container: HTMLElement, options: KakaoMapOptions) => KakaoMap;
  ZoomControl: new () => KakaoControl;
  MapTypeControl: new () => KakaoControl;
  ControlPosition: KakaoControlPosition;
  Marker: new (options: { position: KakaoLatLng; map?: KakaoMap }) => KakaoMarker;
  CustomOverlay: new (options: {
    position: KakaoLatLng;
    content: string;
    yAnchor: number;
    map?: KakaoMap;
  }) => KakaoOverlay;
  Polygon: new (path: KakaoLatLng[], options?: Partial<KakaoPolygonOptions>) => KakaoPolygon;
  load(callback: () => void): void;
  event: KakaoMapEvent;
}

declare global {
  interface Window {
    kakao: {
      maps: KakaoMaps;
    };
  }
}

interface KakaoMapProps {
  onMarkerClick?: (property: AuctionProperty) => void;
  properties?: AuctionProperty[];
}

export interface Territory {
  center: KakaoLatLng;
  properties: AuctionProperty[];
  polygon: KakaoPolygon | null;
  competitionScore: number;
}

export default function KakaoMap({ onMarkerClick, properties = [] }: KakaoMapProps) {
  const mapRef = useRef<HTMLDivElement>(null);
  const [map, setMap] = useState<KakaoMap | null>(null);
  const [markers, setMarkers] = useState<KakaoMarker[]>([]);
  const [overlays, setOverlays] = useState<KakaoOverlay[]>([]);
  const [territories, setTerritories] = useState<Territory[]>([]);
  const [mode, setMode] = useState<MapMode>('property');
  const [competitionFilter, setCompetitionFilter] = useState(0);
  const [selectedTerritory, setSelectedTerritory] = useState<Territory | null>(null);

  // 경쟁 강도 계산 함수
  const calculateCompetitionScore = (properties: AuctionProperty[]): number => {
    if (properties.length === 0) return 0;

    // 평균 가격 계산
    const avgPrice = properties.reduce((sum, prop) => sum + prop.minimumBidPrice, 0) / properties.length;
    
    // 감정가 대비 입찰가 비율 계산
    const avgPriceRatio = properties.reduce((sum, prop) => 
      sum + (prop.minimumBidPrice / prop.appraisedValue), 0) / properties.length;

    // 단위면적당 가격 계산
    const avgPricePerArea = properties.reduce((sum, prop) => 
      sum + (prop.minimumBidPrice / (prop.totalArea || 1)), 0) / properties.length;

    // 매물 밀집도 (개수 기반)
    const densityScore = Math.min(properties.length / 5, 1); // 5개 이상이면 최대 점수

    // 종합 점수 계산 (0~1 사이 값)
    return (
      (avgPriceRatio * 0.3) + 
      (densityScore * 0.3) + 
      (Math.min(avgPrice / 1000000000, 1) * 0.2) + 
      (Math.min(avgPricePerArea / 20000000, 1) * 0.2)
    );
  };

  // 영역 색상 계산 함수
  const getColorByCompetitionScore = (score: number): string => {
    // 빨간색(#FF0000)과 초록색(#00FF00) 사이의 색상 계산
    const red = Math.round(score * 255);
    const green = Math.round((1 - score) * 255);
    return `#${red.toString(16).padStart(2, '0')}${green.toString(16).padStart(2, '0')}00`;
  };

  // 마커와 오버레이 표시/숨김 처리
  useEffect(() => {
    if (!map) return;

    markers.forEach(marker => {
      marker.setMap(mode === 'property' ? map : null);
    });

    overlays.forEach(overlay => {
      overlay.setMap(mode === 'property' ? map : null);
    });
  }, [mode, markers, overlays, map]);

  // 영역 표시/숨김 및 투명도 처리
  useEffect(() => {
    territories.forEach(territory => {
      if (!territory.polygon) return;

      const isVisible = territory.competitionScore >= competitionFilter;
      const opacity = mode === 'territory' ? 0.5 : 0.2;

      if (isVisible) {
        territory.polygon.setMap(map);
        territory.polygon.setOptions({
          fillOpacity: opacity,
          strokeOpacity: opacity,
        });
      } else {
        territory.polygon.setMap(null);
      }
    });
  }, [mode, territories, map, competitionFilter]);

  // 영역 클릭 이벤트 처리
  const handleTerritoryClick = (territory: Territory) => {
    if (mode !== 'territory') return;
    setSelectedTerritory(territory);
  };

  // 마커와 오버레이 생성 함수
  const createMarkerAndOverlay = (property: AuctionProperty, map: KakaoMap) => {
    const position = new window.kakao.maps.LatLng(property.latitude, property.longitude);
    
    // 마커 생성
    const marker = new window.kakao.maps.Marker({
      position,
      map: mode === 'property' ? map : undefined,
    });

    // 오버레이 컨텐츠
    const content = `
      <div class="custom-overlay" style="
        background: white;
        padding: 8px 12px;
        border-radius: 4px;
        box-shadow: 0 2px 6px rgba(0,0,0,0.1);
        border: 1px solid #e6e6e6;
        font-size: 14px;
        font-weight: bold;
      ">
        ${property.minimumBidPrice.toLocaleString()}만원
      </div>
    `;

    // 오버레이 생성
    const overlay = new window.kakao.maps.CustomOverlay({
      content,
      position,
      map: mode === 'property' ? map : undefined,
      yAnchor: 2.2,
    });

    // 마커 클릭 이벤트
    window.kakao.maps.event.addListener(marker, 'click', () => {
      onMarkerClick?.(property);
    });

    return { marker, overlay };
  };

  // 매물 클러스터링 및 영역 분석
  const analyzeTerritories = (map: KakaoMap) => {
    if (!map || !window.kakao) return;

    // 기존 영역 제거
    territories.forEach(territory => {
      if (territory.polygon) {
        territory.polygon.setMap(null);
      }
    });

    const bounds = map.getBounds();
    const sw = bounds.getSouthWest();
    const ne = bounds.getNorthEast();

    // 지도 레벨에 따른 그리드 크기 조정
    const level = map.getLevel();
    const gridSize = Math.max(2, Math.floor(10 - level)); // 줌 레벨에 따라 그리드 크기 조정

    // 위도/경도 간격 계산
    const latInterval = (ne.getLat() - sw.getLat()) / gridSize;
    const lngInterval = (ne.getLng() - sw.getLng()) / gridSize;

    // 그리드별 매물 그룹화
    const grids: { [key: string]: AuctionProperty[] } = {};
    properties.forEach(property => {
      const latIndex = Math.floor((property.latitude - sw.getLat()) / latInterval);
      const lngIndex = Math.floor((property.longitude - sw.getLng()) / lngInterval);
      const key = `${latIndex},${lngIndex}`;
      
      if (!grids[key]) {
        grids[key] = [];
      }
      grids[key].push(property);
    });

    // 새로운 영역 생성
    const newTerritories: Territory[] = [];

    Object.entries(grids).forEach(([key, props]) => {
      if (props.length < 2) return; // 최소 2개 이상의 매물이 있는 경우만 영역 생성

      const [latIndex, lngIndex] = key.split(',').map(Number);
      const centerLat = sw.getLat() + (latIndex + 0.5) * latInterval;
      const centerLng = sw.getLng() + (lngIndex + 0.5) * lngInterval;

      // 영역의 꼭지점 계산
      const path = [
        new window.kakao.maps.LatLng(sw.getLat() + latIndex * latInterval, sw.getLng() + lngIndex * lngInterval),
        new window.kakao.maps.LatLng(sw.getLat() + (latIndex + 1) * latInterval, sw.getLng() + lngIndex * lngInterval),
        new window.kakao.maps.LatLng(sw.getLat() + (latIndex + 1) * latInterval, sw.getLng() + (lngIndex + 1) * lngInterval),
        new window.kakao.maps.LatLng(sw.getLat() + latIndex * latInterval, sw.getLng() + (lngIndex + 1) * lngInterval),
      ];

      const competitionScore = calculateCompetitionScore(props);
      const color = getColorByCompetitionScore(competitionScore);

      const polygon = new window.kakao.maps.Polygon(path, {
        strokeWeight: 2,
        strokeColor: color,
        strokeOpacity: mode === 'territory' ? 0.5 : 0.2,
        fillColor: color,
        fillOpacity: mode === 'territory' ? 0.5 : 0.2,
      });

      polygon.setMap(competitionScore >= competitionFilter ? map : null);

      // 영역 클릭 이벤트
      window.kakao.maps.event.addListener(polygon, 'click', () => {
        handleTerritoryClick({
          center: new window.kakao.maps.LatLng(centerLat, centerLng),
          properties: props,
          polygon,
          competitionScore,
        });
      });

      newTerritories.push({
        center: new window.kakao.maps.LatLng(centerLat, centerLng),
        properties: props,
        polygon,
        competitionScore,
      });
    });

    setTerritories(newTerritories);
  };

  // initializeMap을 useCallback으로 감싸서 의존성 문제 해결
  const initializeMap = useCallback(() => {
    if (!mapRef.current) return;

    const options = {
      center: new window.kakao.maps.LatLng(37.5040, 127.0440),
      level: 5,
    };

    const map = new window.kakao.maps.Map(mapRef.current, options);
    setMap(map);

    // 줌 이벤트 리스너 등록
    window.kakao.maps.event.addListener(map, 'zoom_changed', () => {
      analyzeTerritories(map);
    });

    // 드래그 이벤트 리스너 등록
    window.kakao.maps.event.addListener(map, 'dragend', () => {
      analyzeTerritories(map);
    });

    // 기존 마커와 오버레이 제거
    markers.forEach(marker => marker.setMap(null));
    overlays.forEach(overlay => overlay.setMap(null));

    // 새로운 마커와 오버레이 생성
    const newMarkers: KakaoMarker[] = [];
    const newOverlays: KakaoOverlay[] = [];

    properties.forEach(property => {
      const { marker, overlay } = createMarkerAndOverlay(property, map);
      newMarkers.push(marker);
      newOverlays.push(overlay);
    });

    setMarkers(newMarkers);
    setOverlays(newOverlays);

    // 초기 영역 분석 실행
    analyzeTerritories(map);
  }, [properties]);

  useEffect(() => {
    if (!mapRef.current) return;

    const apiKey = process.env.NEXT_PUBLIC_KAKAO_MAP_API_KEY;
    if (!apiKey) {
      console.error('카카오맵 API 키가 설정되지 않았습니다.');
      return;
    }

    const script = document.querySelector(`script[src*="kakao.maps.js"]`);
    if (script) {
      console.log('카카오맵 스크립트가 이미 로드되어 있습니다.');
      initializeMap();
      return;
    }

    const mapScript = document.createElement('script');
    mapScript.async = true;
    mapScript.src = `//dapi.kakao.com/v2/maps/sdk.js?appkey=${apiKey}&autoload=false`;

    mapScript.addEventListener('load', () => {
      window.kakao.maps.load(() => {
        console.log('카카오맵 API가 로드되었습니다.');
        initializeMap();
      });
    });

    document.head.appendChild(mapScript);
  }, [initializeMap]);

  // 컴포넌트 언마운트 시 마커와 오버레이 제거
  useEffect(() => {
    return () => {
      markers.forEach(marker => marker.setMap(null));
      overlays.forEach(overlay => overlay.setMap(null));
      territories.forEach(territory => {
        if (territory.polygon) {
          territory.polygon.setMap(null);
        }
      });
    };
  }, [markers, overlays, territories]);

  return (
    <Box position="relative" w="100%" h="100%">
      <Box
        ref={mapRef}
        w="100%"
        h="100%"
        position="relative"
        overflow="hidden"
        id="map"
      />
      <MapControls
        mode={mode}
        onModeChange={setMode}
        competitionFilter={competitionFilter}
        onCompetitionFilterChange={setCompetitionFilter}
      />
      {selectedTerritory && mode === 'territory' && (
        <TerritoryInfo territory={selectedTerritory} />
      )}
    </Box>
  );
} 