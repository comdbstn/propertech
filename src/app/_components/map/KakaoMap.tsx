'use client';

import { Box } from '@chakra-ui/react';
import { useEffect, useRef } from 'react';

declare global {
  interface Window {
    kakao: any;
  }
}

export default function KakaoMap() {
  const mapRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!mapRef.current) return;

    const loadMap = () => {
      // 지도를 표시할 div
      const container = mapRef.current;
      
      // 지도의 중심좌표 (서울시청)
      const options = {
        center: new window.kakao.maps.LatLng(37.5666805, 126.9784147),
        level: 3, // 지도의 확대 레벨
      };

      // 지도 객체 생성
      const map = new window.kakao.maps.Map(container, options);

      // 마커 생성
      const markerPosition = new window.kakao.maps.LatLng(37.5666805, 126.9784147);
      const marker = new window.kakao.maps.Marker({
        position: markerPosition,
      });

      // 마커를 지도에 표시
      marker.setMap(map);

      // 커스텀 오버레이 내용
      const content = '<div style="padding:5px;background:white;border-radius:4px;box-shadow:0 2px 4px rgba(0,0,0,0.1);">서울시청</div>';

      // 커스텀 오버레이 생성
      const customOverlay = new window.kakao.maps.CustomOverlay({
        position: markerPosition,
        content: content,
        yAnchor: 2.5
      });

      // 커스텀 오버레이를 지도에 표시
      customOverlay.setMap(map);

      // 지도 컨트롤 추가
      const zoomControl = new window.kakao.maps.ZoomControl();
      map.addControl(zoomControl, window.kakao.maps.ControlPosition.RIGHT);
    };

    // 카카오맵 로드 확인
    if (window.kakao && window.kakao.maps) {
      loadMap();
    } else {
      const script = document.createElement('script');
      script.src = `//dapi.kakao.com/v2/maps/sdk.js?appkey=${process.env.NEXT_PUBLIC_KAKAO_MAP_API_KEY}&libraries=services,clusterer&autoload=false`;
      script.async = true;
      script.onload = () => {
        window.kakao.maps.load(loadMap);
      };
      document.head.appendChild(script);
    }
  }, []);

  return (
    <Box
      ref={mapRef}
      w="100%"
      h="100%"
      position="absolute"
      top="0"
      left="0"
    />
  );
} 