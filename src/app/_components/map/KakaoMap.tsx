'use client';

import { Box } from '@chakra-ui/react';
import { useEffect, useRef } from 'react';

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
}

declare global {
  interface Window {
    kakao: {
      maps: KakaoMaps;
    };
  }
}

export default function KakaoMap() {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<KakaoMap | null>(null);
  const markerRef = useRef<KakaoMarker | null>(null);
  const overlayRef = useRef<KakaoOverlay | null>(null);

  useEffect(() => {
    const initializeMap = () => {
      if (!mapRef.current) {
        console.error('맵 컨테이너를 찾을 수 없습니다.');
        return;
      }

      try {
        window.kakao.maps.load(() => {
          console.log('카카오맵 API 초기화 시작');
          const maps = window.kakao.maps;
          const center = new maps.LatLng(37.566826, 126.978656);
          const options = {
            center,
            level: 3
          };

          const map = new maps.Map(mapRef.current, options);
          mapInstanceRef.current = map;

          const zoomControl = new maps.ZoomControl();
          map.addControl(zoomControl, maps.ControlPosition.RIGHT);

          const mapTypeControl = new maps.MapTypeControl();
          map.addControl(mapTypeControl, maps.ControlPosition.TOPRIGHT);

          markerRef.current = new maps.Marker({
            position: center,
            map
          });

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
            ">
              4억 4,000만
            </div>
          `;

          overlayRef.current = new maps.CustomOverlay({
            position: center,
            content: overlayContent,
            yAnchor: 1.0,
            map
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
      if (markerRef.current) {
        markerRef.current.setMap(null);
      }
      if (overlayRef.current) {
        overlayRef.current.setMap(null);
      }
      if (mapInstanceRef.current) {
        mapInstanceRef.current = null;
      }
    };
  }, []);

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