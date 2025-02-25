'use client';

import { Box } from '@chakra-ui/react';
import { useEffect, useRef } from 'react';

interface KakaoMapOptions {
  center: {
    getLat(): number;
    getLng(): number;
  };
  level: number;
}

interface MarkerOptions {
  position: {
    getLat(): number;
    getLng(): number;
  };
  map?: KakaoMap;
}

interface CustomOverlayOptions {
  position: {
    getLat(): number;
    getLng(): number;
  };
  content: string;
  yAnchor: number;
  map?: KakaoMap;
}

interface KakaoMap {
  addControl(control: unknown, position: unknown): void;
  getCenter(): { getLat(): number; getLng(): number };
  getLevel(): number;
  setLevel(level: number): void;
}

interface KakaoMapType {
  maps: {
    LatLng: new (lat: number, lng: number) => { 
      getLat(): number;
      getLng(): number;
    };
    Map: new (container: HTMLElement, options: KakaoMapOptions) => KakaoMap;
    Marker: new (options: MarkerOptions) => {
      setMap(map: KakaoMap | null): void;
    };
    CustomOverlay: new (options: CustomOverlayOptions) => {
      setMap(map: KakaoMap | null): void;
    };
    ZoomControl: new () => unknown;
    ControlPosition: {
      RIGHT: unknown;
    };
    load: (callback: () => void) => void;
  };
}

declare global {
  interface Window {
    kakao: KakaoMapType;
  }
}

export default function KakaoMap() {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<KakaoMap | null>(null);
  const markerRef = useRef<{ setMap(map: KakaoMap | null): void } | null>(null);
  const overlayRef = useRef<{ setMap(map: KakaoMap | null): void } | null>(null);

  useEffect(() => {
    const initMap = () => {
      if (!mapRef.current || !window.kakao?.maps) return;

      try {
        const center = new window.kakao.maps.LatLng(37.566826, 126.978656);
        const options: KakaoMapOptions = {
          center,
          level: 3,
        };

        const map = new window.kakao.maps.Map(mapRef.current, options);
        mapInstanceRef.current = map;

        const zoomControl = new window.kakao.maps.ZoomControl();
        map.addControl(zoomControl, window.kakao.maps.ControlPosition.RIGHT);

        markerRef.current = new window.kakao.maps.Marker({
          position: center,
          map: map,
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

        overlayRef.current = new window.kakao.maps.CustomOverlay({
          position: center,
          content: overlayContent,
          yAnchor: 1.0,
          map: map,
        });
      } catch (error) {
        console.error('카카오맵 초기화 중 오류 발생:', error);
      }
    };

    // 카카오맵 API가 로드된 후 초기화
    if (window.kakao?.maps) {
      initMap();
    } else {
      const checkKakaoMap = setInterval(() => {
        if (window.kakao?.maps) {
          initMap();
          clearInterval(checkKakaoMap);
        }
      }, 100);

      // 10초 후에도 로드되지 않으면 인터벌 제거
      setTimeout(() => clearInterval(checkKakaoMap), 10000);
    }

    return () => {
      if (markerRef.current) {
        markerRef.current.setMap(null);
      }
      if (overlayRef.current) {
        overlayRef.current.setMap(null);
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
    />
  );
} 