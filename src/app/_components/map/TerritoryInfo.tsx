'use client';

import {
  Box,
  VStack,
  Text,
  Stat,
  StatLabel,
  StatNumber,
  StatGroup,
  Progress,
  Divider,
  useColorModeValue,
} from '@chakra-ui/react';
import { AuctionProperty } from '@/app/_types/auction';
import { formatPrice } from '@/app/_utils/format';

interface Territory {
  properties: AuctionProperty[];
  competitionScore: number;
}

interface TerritoryInfoProps {
  territory: Territory;
}

export default function TerritoryInfo({ territory }: TerritoryInfoProps) {
  const bgColor = useColorModeValue('white', 'gray.800');
  const borderColor = useColorModeValue('gray.200', 'gray.700');

  // 평균 가격 계산
  const avgPrice = territory.properties.reduce((sum: number, prop: AuctionProperty) => 
    sum + prop.minimumBidPrice, 0) / territory.properties.length;

  // 평균 감정가 대비 입찰가 비율
  const avgPriceRatio = territory.properties.reduce((sum: number, prop: AuctionProperty) => 
    sum + (prop.minimumBidPrice / prop.appraisedValue), 0) / territory.properties.length;

  // 물건 종류별 개수
  const propertyTypeCounts = territory.properties.reduce((acc: Record<string, number>, prop: AuctionProperty) => {
    acc[prop.propertyType] = (acc[prop.propertyType] || 0) + 1;
    return acc;
  }, {});

  return (
    <Box
      position="absolute"
      bottom={4}
      right={4}
      zIndex={2}
      bg={bgColor}
      p={6}
      borderRadius="lg"
      border="1px solid"
      borderColor={borderColor}
      boxShadow="lg"
      maxW="400px"
      w="full"
    >
      <VStack spacing={4} align="stretch">
        <Text fontSize="lg" fontWeight="bold">
          영역 분석
        </Text>

        <StatGroup>
          <Stat>
            <StatLabel>매물 수</StatLabel>
            <StatNumber>{territory.properties.length}개</StatNumber>
          </Stat>
          <Stat>
            <StatLabel>평균 입찰가</StatLabel>
            <StatNumber>{formatPrice(avgPrice)}</StatNumber>
          </Stat>
          <Stat>
            <StatLabel>감정가 대비</StatLabel>
            <StatNumber>{Math.round(avgPriceRatio * 100)}%</StatNumber>
          </Stat>
        </StatGroup>

        <Box>
          <Text fontSize="sm" fontWeight="bold" mb={2}>
            경쟁 강도
          </Text>
          <Progress
            value={territory.competitionScore * 100}
            colorScheme={territory.competitionScore > 0.7 ? 'red' : 
                        territory.competitionScore > 0.3 ? 'yellow' : 'green'}
            size="lg"
            borderRadius="full"
          />
          <Text fontSize="sm" color="gray.500" mt={1}>
            {territory.competitionScore > 0.7 ? '매우 높음' :
             territory.competitionScore > 0.5 ? '높음' :
             territory.competitionScore > 0.3 ? '보통' : '낮음'}
          </Text>
        </Box>

        <Divider />

        <Box>
          <Text fontSize="sm" fontWeight="bold" mb={2}>
            물건 종류별 분포
          </Text>
          <VStack spacing={2} align="stretch">
            {Object.entries(propertyTypeCounts).map(([type, count]) => (
              <Box key={type}>
                <Text fontSize="sm">
                  {type}: {count}개 ({Math.round((count / territory.properties.length) * 100)}%)
                </Text>
                <Progress
                  value={(count / territory.properties.length) * 100}
                  size="sm"
                  colorScheme="blue"
                  borderRadius="full"
                />
              </Box>
            ))}
          </VStack>
        </Box>
      </VStack>
    </Box>
  );
} 