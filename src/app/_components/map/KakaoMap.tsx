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
    if (!mapRef.current) return;

    const initializeMap = () => {
      const center = new window.kakao.maps.LatLng(37.566826, 126.978656);
      const options: KakaoMapOptions = {
        center,
        level: 3,
      };

      const map = new window.kakao.maps.Map(mapRef.current!, options);
      mapInstanceRef.current = map;

      const zoomControl = new window.kakao.maps.ZoomControl();
      map.addControl(zoomControl, window.kakao.maps.ControlPosition.RIGHT);

      // 마커 생성 및 저장
      markerRef.current = new window.kakao.maps.Marker({
        position: center,
        map: map,
      });

      // 오버레이 생성 및 저장
      overlayRef.current = new window.kakao.maps.CustomOverlay({
        position: center,
        content: '<div style="padding:5px;background:white;border:1px solid #000;">서울시청</div>',
        yAnchor: 1.5,
        map: map,
      });
    };

    // 카카오맵 로드 확인 및 초기화
    if (window.kakao && window.kakao.maps) {
      window.kakao.maps.load(initializeMap);
    }

    // 컴포넌트 언마운트 시 정리
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