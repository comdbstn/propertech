'use client';

import { Box } from '@chakra-ui/react';
import { useEffect, useRef, useState, useCallback, useMemo } from 'react';
import { AuctionProperty } from '@/app/_types/auction';
import MapControls, { MapMode } from './MapControls';
import TerritoryInfo from './TerritoryInfo';

// Kakao Maps 타입 정의
interface KakaoLatLng {
  getLat(): number;
  getLng(): number;
}

interface KakaoPoint {
  x: number;
  y: number;
}

interface KakaoSize {
  width: number;
  height: number;
}

interface KakaoMarkerImage {
  src: string;
  size: KakaoSize;
  options?: {
    offset: KakaoPoint;
  };
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

interface KakaoMarkerOptions {
  position: KakaoLatLng;
  map?: KakaoMap | null;
  image?: KakaoMarkerImage;
}

interface KakaoOverlayOptions {
  position: KakaoLatLng;
  content: string;
  yAnchor: number;
  map?: KakaoMap | null;
  zIndex?: number;
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
  Marker: new (options: KakaoMarkerOptions) => KakaoMarker;
  CustomOverlay: new (options: KakaoOverlayOptions) => KakaoOverlay;
  Polygon: new (options: KakaoPolygonOptions) => KakaoPolygon;
  MarkerImage: new (src: string, size: KakaoSize, options?: { offset: KakaoPoint }) => KakaoMarkerImage;
  Size: new (width: number, height: number) => KakaoSize;
  Point: new (x: number, y: number) => KakaoPoint;
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
  const [isMapLoaded, setIsMapLoaded] = useState(false);

  // 경쟁 강도 계산 함수 메모이제이션
  const calculateCompetitionScore = useMemo(() => (properties: AuctionProperty[]): number => {
    if (properties.length === 0) return 0;

    const avgPrice = properties.reduce((sum, prop) => sum + prop.minimumBidPrice, 0) / properties.length;
    const avgPriceRatio = properties.reduce((sum, prop) => 
      sum + (prop.minimumBidPrice / prop.appraisedValue), 0) / properties.length;
    const avgPricePerArea = properties.reduce((sum, prop) => 
      sum + (prop.minimumBidPrice / (prop.totalArea || 1)), 0) / properties.length;
    const densityScore = Math.min(properties.length / 5, 1);

    return (
      (avgPriceRatio * 0.3) + 
      (densityScore * 0.3) + 
      (Math.min(avgPrice / 1000000000, 1) * 0.2) + 
      (Math.min(avgPricePerArea / 20000000, 1) * 0.2)
    );
  }, []);

  // 영역 색상 계산 함수 메모이제이션
  const getColorByCompetitionScore = useMemo(() => (score: number): string => {
    // 빨간색(높은 경쟁) -> 초록색(낮은 경쟁)
    const red = Math.round(score * 255).toString(16).padStart(2, '0');
    const green = Math.round((1 - score) * 255).toString(16).padStart(2, '0');
    return `#${red}${green}00`;
  }, []);

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

  // 영역 클릭 핸들러 메모이제이션
  const handleTerritoryClick = useCallback((territory: Territory) => {
    if (mode !== 'territory') return;
    setSelectedTerritory(territory);
  }, [mode]);

  // 마커와 오버레이 생성 함수
  const createMarkerAndOverlay = useCallback((property: AuctionProperty, map: KakaoMap) => {
    if (!window.kakao?.maps) return { marker: null, overlay: null };

    const position = new window.kakao.maps.LatLng(property.latitude, property.longitude);
    
    // 마커 생성 - 메모리 최적화를 위해 이미지 마커 사용
    const marker = new window.kakao.maps.Marker({
      position,
      map: mode === 'property' ? map : null,
      image: new window.kakao.maps.MarkerImage(
        'https://t1.daumcdn.net/localimg/localimages/07/mapapidoc/marker_red.png',
        new window.kakao.maps.Size(32, 32),
        { offset: new window.kakao.maps.Point(16, 32) }
      )
    });

    // 오버레이 컨텐츠 - 스타일 최적화
    const content = `
      <div style="
        background: white;
        padding: 6px 10px;
        border-radius: 4px;
        box-shadow: 0 2px 4px rgba(0,0,0,0.1);
        border: 1px solid #e6e6e6;
        font-size: 13px;
        font-weight: 500;
        white-space: nowrap;
        transform: translateZ(0);
        will-change: transform;
      ">
        ${property.minimumBidPrice.toLocaleString()}만원
      </div>
    `;

    // 오버레이 생성 - 성능 최적화를 위한 옵션 추가
    const overlay = new window.kakao.maps.CustomOverlay({
      content,
      position,
      map: mode === 'property' ? map : null,
      yAnchor: 2.2,
      zIndex: 1
    });

    // 이벤트 리스너 최적화
    if (marker && onMarkerClick) {
      const clickHandler = () => onMarkerClick(property);
      window.kakao.maps.event.addListener(marker, 'click', clickHandler);
      
      // 메모리 누수 방지를 위한 이벤트 제거 함수 반환
      return {
        marker,
        overlay,
        cleanup: () => {
          window.kakao.maps.event.removeListener(marker, 'click', clickHandler);
        }
      };
    }

    return { marker, overlay };
  }, [mode, onMarkerClick]);

  // 매물 클러스터링 및 영역 분석
  const analyzeTerritories = useCallback((map: KakaoMap) => {
    if (!map || !window.kakao?.maps) return;

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
    const gridSize = Math.max(2, Math.floor(10 - level));

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
      if (props.length < 2) return;

      const [latIndex, lngIndex] = key.split(',').map(Number);
      const centerLat = sw.getLat() + (latIndex + 0.5) * latInterval;
      const centerLng = sw.getLng() + (lngIndex + 0.5) * lngInterval;

      const path = [
        new window.kakao.maps.LatLng(sw.getLat() + latIndex * latInterval, sw.getLng() + lngIndex * lngInterval),
        new window.kakao.maps.LatLng(sw.getLat() + (latIndex + 1) * latInterval, sw.getLng() + lngIndex * lngInterval),
        new window.kakao.maps.LatLng(sw.getLat() + (latIndex + 1) * latInterval, sw.getLng() + (lngIndex + 1) * lngInterval),
        new window.kakao.maps.LatLng(sw.getLat() + latIndex * latInterval, sw.getLng() + (lngIndex + 1) * lngInterval),
      ];

      const competitionScore = calculateCompetitionScore(props);
      const color = getColorByCompetitionScore(competitionScore);

      const polygon = new window.kakao.maps.Polygon({
        path,
        strokeWeight: 2,
        strokeColor: color,
        strokeOpacity: mode === 'territory' ? 0.8 : 0.4,
        fillColor: color,
        fillOpacity: mode === 'territory' ? 0.5 : 0.3,
      });

      if (competitionScore >= competitionFilter) {
        polygon.setMap(map);
      }

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
  }, [mode, properties, competitionFilter, calculateCompetitionScore, getColorByCompetitionScore, handleTerritoryClick, territories]);

  // 지도 초기화
  const initializeMap = useCallback(() => {
    if (!mapRef.current || !window.kakao?.maps) return;

    try {
      const options = {
        center: new window.kakao.maps.LatLng(37.5040, 127.0440),
        level: 5,
      };

      const mapInstance = new window.kakao.maps.Map(mapRef.current, options);
      
      // 지도 컨트롤 추가 - 성능 최적화
      const zoomControl = new window.kakao.maps.ZoomControl();
      const mapTypeControl = new window.kakao.maps.MapTypeControl();
      mapInstance.addControl(zoomControl, window.kakao.maps.ControlPosition.RIGHT);
      mapInstance.addControl(mapTypeControl, window.kakao.maps.ControlPosition.TOPRIGHT);

      setMap(mapInstance);
      setIsMapLoaded(true);

      // 디바운스된 이벤트 핸들러
      let timeoutId: NodeJS.Timeout;
      const handleMapChange = () => {
        clearTimeout(timeoutId);
        timeoutId = setTimeout(() => {
          analyzeTerritories(mapInstance);
        }, 300);
      };

      // 이벤트 리스너 등록
      window.kakao.maps.event.addListener(mapInstance, 'zoom_changed', handleMapChange);
      window.kakao.maps.event.addListener(mapInstance, 'dragend', handleMapChange);

      // 기존 마커와 오버레이 제거
      markers.forEach(marker => marker?.setMap(null));
      overlays.forEach(overlay => overlay?.setMap(null));

      // 새로운 마커와 오버레이 생성 - 배치 처리
      const newMarkers: KakaoMarker[] = [];
      const newOverlays: KakaoOverlay[] = [];
      const cleanupFunctions: Array<() => void> = [];

      properties.forEach(property => {
        const result = createMarkerAndOverlay(property, mapInstance);
        if (result.marker && result.overlay) {
          newMarkers.push(result.marker);
          newOverlays.push(result.overlay);
          if (result.cleanup) {
            cleanupFunctions.push(result.cleanup);
          }
        }
      });

      setMarkers(newMarkers);
      setOverlays(newOverlays);
      analyzeTerritories(mapInstance);

      // 클린업 함수 반환
      return () => {
        clearTimeout(timeoutId);
        cleanupFunctions.forEach(cleanup => cleanup());
      };
    } catch (error) {
      console.error('지도 초기화 중 오류 발생:', error);
    }
  }, [properties, analyzeTerritories, createMarkerAndOverlay, markers, overlays]);

  // 카카오맵 로드
  useEffect(() => {
    if (!window.kakao?.maps) {
      console.error('카카오맵 API를 찾을 수 없습니다.');
      return;
    }

    if (window.kakao.maps.load) {
      window.kakao.maps.load(() => {
        console.log('카카오맵 API 로드 완료');
        initializeMap();
      });
    } else {
      initializeMap();
    }
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
      {isMapLoaded && (
        <>
          <MapControls
            mode={mode}
            onModeChange={setMode}
            competitionFilter={competitionFilter}
            onCompetitionFilterChange={setCompetitionFilter}
          />
          {selectedTerritory && mode === 'territory' && (
            <TerritoryInfo territory={selectedTerritory} />
          )}
        </>
      )}
    </Box>
  );
} 