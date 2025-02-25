export interface AuctionProperty {
  id: string;
  caseNumber: string;        // 사건번호
  court: string;             // 관할법원
  address: string;           // 소재지
  propertyType: string;      // 물건종류
  minimumBidPrice: number;   // 최저매각가격
  appraisedValue: number;    // 감정가
  auctionDate: Date;        // 매각기일
  status: string;           // 진행상태
  latitude: number;         // 위도
  longitude: number;        // 경도
  
  // 상세 정보
  totalArea?: number;       // 총면적(㎡)
  buildingArea?: number;    // 건물면적(㎡)
  landArea?: number;        // 대지면적(㎡)
  usage?: string;          // 용도
  rooms?: number;          // 방 수
  parkingSpaces?: number;  // 주차공간
  constructionYear?: number; // 건축년도
  floor?: string;          // 층수 정보
  
  // 경매 진행 정보
  bidCount?: number;       // 입찰 수
  nextBidDate?: Date;      // 다음 입찰일
  notes?: string;          // 특이사항
  
  // 이미지
  images?: string[];       // 이미지 URL 배열
}

export interface AuctionSearchParams {
  court?: string;          // 관할법원
  propertyType?: string;   // 물건종류
  minPrice?: number;       // 최저가
  maxPrice?: number;       // 최고가
  status?: string;         // 진행상태
  keyword?: string;        // 검색어
  page?: number;          // 페이지 번호
  pageSize?: number;      // 페이지 크기
}

export interface AuctionSearchResult {
  items: AuctionProperty[];
  total: number;
  page: number;
  pageSize: number;
  hasMore: boolean;
} 