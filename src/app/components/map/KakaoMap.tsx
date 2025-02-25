'use client';

import { useEffect, useState } from 'react';
import { Map, MapMarker } from 'react-kakao-maps-sdk';

export default function KakaoMap() {
  // 서울 시청 좌표를 기본값으로 설정
  const [center] = useState({
    lat: 37.5666805,
    lng: 126.9784147,
  });

  return (
    <Map
      center={center}
      style={{
        width: '100%',
        height: '100%',
      }}
      level={3}
    >
      <MapMarker position={center}>
        <div style={{ padding: '5px', color: '#000' }}>현재 위치</div>
      </MapMarker>
    </Map>
  );
} 