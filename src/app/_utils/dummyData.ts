import { AuctionProperty } from '@/app/_types/auction';

// 강남 지역의 좌표 범위
const GANGNAM_BOUNDS = {
  minLat: 37.4850,
  maxLat: 37.5150,
  minLng: 127.0200,
  maxLng: 127.0500,
};

// 테헤란로 주변 좌표 범위 (높은 경쟁강도)
const TEHERAN_BOUNDS = {
  minLat: 37.5000,
  maxLat: 37.5080,
  minLng: 127.0280,
  maxLng: 127.0400,
};

// 랜덤 좌표 생성
const getRandomLocation = (bounds: typeof GANGNAM_BOUNDS) => {
  const lat = bounds.minLat + Math.random() * (bounds.maxLat - bounds.minLat);
  const lng = bounds.minLng + Math.random() * (bounds.maxLng - bounds.minLng);
  return { lat, lng };
};

// 랜덤 가격 생성 (단위: 만원)
const getRandomPrice = (isTeheran: boolean) => {
  const base = isTeheran ? 1000000 : 500000; // 테헤란로 주변은 기본가가 더 높음
  const variation = isTeheran ? 500000 : 300000;
  return Math.round(base + Math.random() * variation);
};

// 더미 매물 데이터 생성
export const generateDummyProperties = (count: number = 50): AuctionProperty[] => {
  const properties: AuctionProperty[] = [];
  const propertyTypes = ['아파트', '오피스텔', '상가', '빌딩'];
  const courts = ['서울중앙지방법원', '서울남부지방법원'];
  const statuses = ['진행중', '예정'];

  for (let i = 0; i < count; i++) {
    const isTeheran = Math.random() < 0.4; // 40% 확률로 테헤란로 주변 매물
    const location = getRandomLocation(isTeheran ? TEHERAN_BOUNDS : GANGNAM_BOUNDS);
    const minimumBidPrice = getRandomPrice(isTeheran);
    const appraisedValue = Math.round(minimumBidPrice * (1 + Math.random() * 0.3)); // 10-30% 높은 감정가
    const propertyType = propertyTypes[Math.floor(Math.random() * propertyTypes.length)];
    
    // 물건 종류별 기본 면적 범위
    let baseArea = 0;
    switch (propertyType) {
      case '아파트':
        baseArea = 60 + Math.random() * 140; // 60-200평
        break;
      case '오피스텔':
        baseArea = 20 + Math.random() * 40; // 20-60평
        break;
      case '상가':
        baseArea = 30 + Math.random() * 70; // 30-100평
        break;
      case '빌딩':
        baseArea = 200 + Math.random() * 300; // 200-500평
        break;
    }

    properties.push({
      id: `2024-${(i + 1).toString().padStart(4, '0')}`,
      caseNumber: `2024타경${Math.floor(Math.random() * 10000)}`,
      status: statuses[Math.floor(Math.random() * statuses.length)],
      propertyType,
      address: `서울시 강남구 ${isTeheran ? '테헤란로' : '강남대로'} ${Math.floor(Math.random() * 100)}길 ${Math.floor(Math.random() * 100)}`,
      court: courts[Math.floor(Math.random() * courts.length)],
      minimumBidPrice,
      appraisedValue,
      totalArea: Math.round(baseArea * 10) / 10,
      auctionDate: new Date(2024, Math.floor(Math.random() * 12), Math.floor(Math.random() * 28) + 1),
      latitude: location.lat,
      longitude: location.lng,
      images: ['https://via.placeholder.com/500x300'],
      rooms: propertyType === '아파트' || propertyType === '오피스텔' ? Math.floor(Math.random() * 4) + 1 : undefined,
      parkingSpaces: Math.floor(Math.random() * 5),
      constructionYear: 1990 + Math.floor(Math.random() * 34), // 1990-2024
      floor: `${Math.floor(Math.random() * 20) + 1}층`,
      bidCount: Math.floor(Math.random() * 10),
      notes: isTeheran ? '테헤란로 인근 우량매물' : undefined,
    });
  }

  return properties;
}; 