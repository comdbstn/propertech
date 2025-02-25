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
    LatLng: new (lat: number, lng: number) => any;
    Map: new (container: HTMLElement, options: any) => any;
    Marker: new (options: MarkerOptions) => {
      setMap(map: KakaoMap | null): void;
    };
    CustomOverlay: new (options: CustomOverlayOptions) => {
      setMap(map: KakaoMap | null): void;
    };
    ZoomControl: new () => any;
    MapTypeControl: new () => any;
    ControlPosition: {
      RIGHT: any;
      TOPRIGHT: any;
    };
    load: (callback: () => void) => void;
  };
}

declare global {
  interface Window {
    kakao: {
      maps: {
        LatLng: new (lat: number, lng: number) => any;
        Map: new (container: HTMLElement, options: any) => any;
        ZoomControl: new () => any;
        MapTypeControl: new () => any;
        ControlPosition: {
          RIGHT: any;
          TOPRIGHT: any;
        };
        load: (callback: () => void) => void;
      };
    };
  }
}

export default function KakaoMap() {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<KakaoMap | null>(null);
  const markerRef = useRef<{ setMap(map: KakaoMap | null): void } | null>(null);
  const overlayRef = useRef<{ setMap(map: KakaoMap | null): void } | null>(null);

  useEffect(() => {
    const loadMap = () => {
      if (!mapRef.current) return;

      const options = {
        center: new window.kakao.maps.LatLng(37.566826, 126.978656),
        level: 3
      };

      const map = new window.kakao.maps.Map(mapRef.current, options);
      mapInstanceRef.current = map;

      // 줌 컨트롤 추가
      const zoomControl = new window.kakao.maps.ZoomControl();
      map.addControl(zoomControl, window.kakao.maps.ControlPosition.RIGHT);

      // 지도 타입 컨트롤 추가
      const mapTypeControl = new window.kakao.maps.MapTypeControl();
      map.addControl(mapTypeControl, window.kakao.maps.ControlPosition.TOPRIGHT);

      markerRef.current = new window.kakao.maps.Marker({
        position: options.center,
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
        position: options.center,
        content: overlayContent,
        yAnchor: 1.0,
        map: map,
      });
    };

    // 카카오맵 스크립트 로딩 확인
    if (window.kakao && window.kakao.maps) {
      loadMap();
    } else {
      const script = document.createElement('script');
      script.src = `//dapi.kakao.com/v2/maps/sdk.js?appkey=${process.env.NEXT_PUBLIC_KAKAO_MAP_API_KEY}&autoload=false`;
      script.async = true;
      
      script.onload = () => {
        window.kakao.maps.load(loadMap);
      };
      
      document.head.appendChild(script);
    }

    // 컴포넌트 언마운트 시 스크립트 제거
    return () => {
      const script = document.querySelector('script[src*="dapi.kakao.com/v2/maps/sdk.js"]');
      if (script) {
        document.head.removeChild(script);
      }
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
      id="map"
    />
  );
} 