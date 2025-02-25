import { AuctionProperty, AuctionSearchParams, AuctionSearchResult } from '../_types/auction';

class AuctionService {
  private baseUrl: string;

  constructor() {
    // 실제 API URL로 변경 필요
    this.baseUrl = process.env.NEXT_PUBLIC_AUCTION_API_URL || 'https://api.example.com';
  }

  // 경매 물건 검색
  async searchProperties(params: AuctionSearchParams): Promise<AuctionSearchResult> {
    // TODO: 실제 API 연동
    // 현재는 더미 데이터 반환
    const dummyData: AuctionProperty[] = [
      {
        id: '1',
        caseNumber: '2024-1234',
        court: '서울중앙지방법원',
        address: '서울특별시 강남구 삼성동 123-45',
        propertyType: '아파트',
        minimumBidPrice: 500000000,
        appraisedValue: 650000000,
        auctionDate: new Date('2024-04-01'),
        status: '진행중',
        latitude: 37.508855,
        longitude: 127.056183,
        totalArea: 84.23,
        buildingArea: 84.23,
        usage: '주거용',
        rooms: 3,
        parkingSpaces: 1,
        constructionYear: 2010,
        floor: '8/15',
        bidCount: 0,
        nextBidDate: new Date('2024-04-01'),
        images: [
          'https://via.placeholder.com/500x300',
          'https://via.placeholder.com/500x300',
        ],
      },
      {
        id: '2',
        caseNumber: '2024-5678',
        court: '서울중앙지방법원',
        address: '서울특별시 강남구 역삼동 456-78',
        propertyType: '오피스텔',
        minimumBidPrice: 300000000,
        appraisedValue: 380000000,
        auctionDate: new Date('2024-04-15'),
        status: '진행중',
        latitude: 37.501033,
        longitude: 127.037386,
        totalArea: 59.67,
        buildingArea: 59.67,
        usage: '주거용',
        rooms: 2,
        parkingSpaces: 1,
        constructionYear: 2015,
        floor: '12/20',
        bidCount: 0,
        nextBidDate: new Date('2024-04-15'),
        images: [
          'https://via.placeholder.com/500x300',
          'https://via.placeholder.com/500x300',
        ],
      },
    ];

    return {
      items: dummyData,
      total: dummyData.length,
      page: params.page || 1,
      pageSize: params.pageSize || 10,
      hasMore: false,
    };
  }

  // 경매 물건 상세 정보 조회
  async getPropertyDetail(id: string): Promise<AuctionProperty | null> {
    const properties = await this.searchProperties({});
    return properties.items.find(item => item.id === id) || null;
  }

  // 관할법원 목록 조회
  async getCourts(): Promise<string[]> {
    return [
      '서울중앙지방법원',
      '서울동부지방법원',
      '서울남부지방법원',
      '서울북부지방법원',
      '서울서부지방법원',
    ];
  }

  // 물건 종류 목록 조회
  async getPropertyTypes(): Promise<string[]> {
    return [
      '아파트',
      '단독주택',
      '다가구주택',
      '오피스텔',
      '상가',
      '토지',
      '공장',
    ];
  }
}

export const auctionService = new AuctionService(); 