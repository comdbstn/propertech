'use client';

import { Box } from '@chakra-ui/react';
import { useEffect, useRef, useState } from 'react';
import { AuctionProperty } from '@/app/_types/auction';
import { auctionService } from '@/app/_services/auctionService';

// Kakao Maps 타입 정의
interface KakaoLatLng {
  getLat(): number;
  getLng(): number;
}

interface KakaoMapOptions {
  center: KakaoLatLng;
  level: number;
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
}

interface KakaoMarker {
  setMap(map: KakaoMap | null): void;
}

interface KakaoOverlay {
  setMap(map: KakaoMap | null): void;
}

interface KakaoMapEvent {
  addListener(target: KakaoMarker | KakaoMap, type: string, handler: () => void): void;
  removeListener(target: KakaoMarker | KakaoMap, type: string, handler: () => void): void;
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
}

export default function KakaoMap({ onMarkerClick }: KakaoMapProps) {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<KakaoMap | null>(null);
  const markersRef = useRef<Map<string, KakaoMarker>>(new Map());
  const overlaysRef = useRef<Map<string, KakaoOverlay>>(new Map());
  const [properties, setProperties] = useState<AuctionProperty[]>([]);

  // 마커와 오버레이 생성
  const createMarkerAndOverlay = (maps: KakaoMaps, property: AuctionProperty, map: KakaoMap) => {
    const position = new maps.LatLng(property.latitude, property.longitude);
    
    // 마커 생성
    const marker = new maps.Marker({
      position,
      map
    });
    markersRef.current.set(property.id, marker);

    // 오버레이 콘텐츠
    const overlayContent = `
      <div style="
        padding: 5px 10px;
        background: rgba(0, 0, 0, 0.8);
        color: white;
        border-radius: 4px;
        font-size: 12px;
        font-weight: bold;
        white-space: nowrap;
        transform: translateY(-100%);
        margin-top: -10px;
        cursor: pointer;
      ">
        ${(property.minimumBidPrice / 10000).toFixed(0)}만원
      </div>
    `;

    // 오버레이 생성
    const overlay = new maps.CustomOverlay({
      position,
      content: overlayContent,
      yAnchor: 1.0,
      map
    });
    overlaysRef.current.set(property.id, overlay);

    // 클릭 이벤트
    if (onMarkerClick) {
      maps.event.addListener(marker, 'click', () => {
        onMarkerClick(property);
      });
    }
  };

  // 마커와 오버레이 제거
  const clearMarkersAndOverlays = () => {
    markersRef.current.forEach(marker => marker.setMap(null));
    markersRef.current.clear();
    overlaysRef.current.forEach(overlay => overlay.setMap(null));
    overlaysRef.current.clear();
  };

  // 지도 초기화
  useEffect(() => {
    const initializeMap = () => {
      const mapContainer = mapRef.current;
      if (!mapContainer) {
        console.error('맵 컨테이너를 찾을 수 없습니다.');
        return;
      }

      try {
        window.kakao.maps.load(async () => {
          console.log('카카오맵 API 초기화 시작');
          const maps = window.kakao.maps;
          
          // 초기 중심좌표 (서울시청)
          const center = new maps.LatLng(37.566826, 126.978656);
          const options = {
            center,
            level: 7
          };

          const map = new maps.Map(mapContainer, options);
          mapInstanceRef.current = map;

          // 컨트롤 추가
          const zoomControl = new maps.ZoomControl();
          map.addControl(zoomControl, maps.ControlPosition.RIGHT);

          const mapTypeControl = new maps.MapTypeControl();
          map.addControl(mapTypeControl, maps.ControlPosition.TOPRIGHT);

          // 경매 물건 데이터 로드
          const result = await auctionService.searchProperties({});
          setProperties(result.items);

          // 마커와 오버레이 생성
          result.items.forEach(property => {
            createMarkerAndOverlay(maps, property, map);
          });

          console.log('카카오맵 초기화 성공');
        });
      } catch (error) {
        console.error('카카오맵 초기화 중 에러:', error);
      }
    };

    const loadKakaoMapScript = () => {
      const apiKey = "08bf2e5da0fce7640c90d3725130a327";
      
      if (!apiKey) {
        console.error('카카오맵 API 키가 설정되지 않았습니다.');
        return;
      }

      // 스크립트가 이미 로드되어 있는지 확인
      const script = document.querySelector('script[src*="dapi.kakao.com/v2/maps/sdk.js"]');
      
      if (script) {
        console.log('카카오맵 스크립트가 이미 로드됨');
        initializeMap();
        return;
      }

      console.log('카카오맵 스크립트 로드 시작');
      const mapScript = document.createElement('script');
      mapScript.async = true;
      mapScript.src = `//dapi.kakao.com/v2/maps/sdk.js?appkey=${apiKey}&autoload=false`;

      mapScript.addEventListener('load', () => {
        console.log('카카오맵 스크립트 로드 완료');
        initializeMap();
      });

      document.head.appendChild(mapScript);
    };

    loadKakaoMapScript();

    return () => {
      clearMarkersAndOverlays();
      if (mapInstanceRef.current) {
        mapInstanceRef.current = null;
      }
    };
  }, [onMarkerClick]);

  // properties가 변경되면 마커와 오버레이 업데이트
  useEffect(() => {
    if (!mapInstanceRef.current || !window.kakao?.maps || properties.length === 0) return;

    clearMarkersAndOverlays();
    properties.forEach(property => {
      createMarkerAndOverlay(window.kakao.maps, property, mapInstanceRef.current!);
    });
  }, [properties, onMarkerClick]);

  return (
    <Box
      ref={mapRef}
      w="100%"
      h="100%"
      position="relative"
      overflow="hidden"
      id="map"
    />
  );
} 