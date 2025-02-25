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
    console.log('KakaoMap 컴포넌트 마운트');
    console.log('API Key:', process.env.NEXT_PUBLIC_KAKAO_MAP_API_KEY);
    
    const loadMap = () => {
      if (!mapRef.current || !window.kakao?.maps) {
        console.error('맵 로딩 실패: DOM 요소 또는 카카오 맵 API 없음');
        return;
      }

      console.log('카카오맵 초기화 시작');
      try {
        const maps = window.kakao.maps;
        const center = new maps.LatLng(37.566826, 126.978656);
        const options: KakaoMapOptions = {
          center,
          level: 3
        };

        const map = new maps.Map(mapRef.current, options);
        mapInstanceRef.current = map;
        console.log('카카오맵 인스턴스 생성 성공');

        // 줌 컨트롤 추가
        const zoomControl = new maps.ZoomControl();
        map.addControl(zoomControl, maps.ControlPosition.RIGHT);

        // 지도 타입 컨트롤 추가
        const mapTypeControl = new maps.MapTypeControl();
        map.addControl(mapTypeControl, maps.ControlPosition.TOPRIGHT);
        console.log('맵 컨트롤 추가 완료');

        // 마커 추가
        markerRef.current = new maps.Marker({
          position: center,
          map
        });

        // 오버레이 추가
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
      } catch (error) {
        console.error('카카오맵 초기화 중 에러:', error);
      }
    };

    // 카카오맵 스크립트 로딩
    const script = document.createElement('script');
    script.src = `https://dapi.kakao.com/v2/maps/sdk.js?appkey=${process.env.NEXT_PUBLIC_KAKAO_MAP_API_KEY}&autoload=false`;
    script.async = true;
    
    script.onload = () => {
      console.log('카카오맵 스크립트 로드 성공');
      window.kakao?.maps?.load(() => {
        console.log('카카오맵 API 초기화 성공');
        try {
          loadMap();
        } catch (error) {
          console.error('카카오맵 로딩 중 오류 발생:', error);
        }
      });
    };

    script.onerror = (error) => {
      console.error('카카오맵 스크립트 로딩 실패:', error);
    };
    
    // 스크립트가 이미 로드되어 있는지 확인
    const existingScript = document.querySelector('script[src*="dapi.kakao.com/v2/maps/sdk.js"]');
    if (!existingScript) {
      console.log('카카오맵 스크립트 추가');
      document.head.appendChild(script);
    } else if (window.kakao?.maps) {
      console.log('카카오맵 스크립트 이미 로드됨');
      loadMap();
    }

    // 컴포넌트 언마운트 시 정리
    return () => {
      console.log('KakaoMap 컴포넌트 언마운트');
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