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

interface KakaoMapsInstance {
  maps: {
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
  };
}

declare global {
  interface Window {
    kakao: KakaoMapsInstance;
  }
}

export default function KakaoMap() {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<KakaoMap | null>(null);
  const markerRef = useRef<KakaoMarker | null>(null);
  const overlayRef = useRef<KakaoOverlay | null>(null);

  useEffect(() => {
    const initializeMap = () => {
      if (!mapRef.current || !window.kakao?.maps) {
        console.error('맵 초기화 실패: DOM 요소 또는 카카오 맵 API 없음');
        return;
      }

      try {
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
      } catch (error) {
        console.error('카카오맵 초기화 중 에러:', error);
      }
    };

    const loadKakaoMapScript = () => {
      const apiKey = process.env.NEXT_PUBLIC_KAKAO_MAP_API_KEY;
      if (!apiKey) {
        console.error('카카오맵 API 키가 설정되지 않았습니다.');
        return;
      }

      const script = document.createElement('script');
      script.src = `https://dapi.kakao.com/v2/maps/sdk.js?appkey=${apiKey}`;
      script.async = true;

      script.onload = () => {
        console.log('카카오맵 스크립트 로드 성공');
        if (window.kakao && window.kakao.maps) {
          window.kakao.maps.load(() => {
            console.log('카카오맵 API 초기화 성공');
            initializeMap();
          });
        }
      };

      script.onerror = (error) => {
        console.error('카카오맵 스크립트 로딩 실패:', error);
      };

      document.head.appendChild(script);
    };

    // 스크립트가 이미 로드되어 있는지 확인
    if (window.kakao?.maps) {
      console.log('카카오맵 이미 로드됨');
      initializeMap();
    } else {
      loadKakaoMapScript();
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
      id="map"
    />
  );
} 