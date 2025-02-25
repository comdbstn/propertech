'use client';

import { Box, VStack, Text, Flex, Image, useColorModeValue, Icon, Badge } from '@chakra-ui/react';
import { FaMapMarkerAlt, FaCalendar, FaGavel } from 'react-icons/fa';
import { AuctionProperty } from '@/app/_types/auction';

interface PropertyListProps {
  properties: AuctionProperty[];
  selectedId?: string;
  onPropertyClick?: (property: AuctionProperty) => void;
}

export default function PropertyList({ properties, selectedId, onPropertyClick }: PropertyListProps) {
  const bgColor = useColorModeValue('white', 'black');
  const borderColor = useColorModeValue('rgb(230, 230, 230)', 'rgb(38, 38, 38)');
  const hoverBgColor = useColorModeValue('rgb(245, 245, 245)', 'rgb(28, 28, 28)');
  const textColor = useColorModeValue('black', 'white');
  const mutedColor = useColorModeValue('gray.600', 'gray.400');
  const selectedBgColor = useColorModeValue('blue.50', 'blue.900');
  const fallbackBgColor = useColorModeValue('gray.100', 'gray.700');

  const formatPrice = (price: number) => {
    const billion = Math.floor(price / 100000000);
    const million = Math.floor((price % 100000000) / 10000);
    
    if (billion > 0) {
      return `${billion}억 ${million > 0 ? `${million}만` : ''}`;
    }
    return `${million}만`;
  };

  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString('ko-KR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  return (
    <VStack spacing={0} align="stretch" h="100%" bg={bgColor}>
      {/* 헤더 */}
      <Box 
        p={6} 
        borderBottom="1px solid" 
        borderColor={borderColor}
      >
        <Text 
          fontSize="2xl" 
          fontWeight="bold" 
          color={textColor}
          letterSpacing="-0.03em"
        >
          경매 매물 ({properties.length})
        </Text>
      </Box>

      {/* 매물 목록 */}
      <Box 
        overflowY="auto" 
        flex={1} 
        className="minimal-scrollbar"
      >
        <VStack spacing={0} align="stretch">
          {properties.map((property) => (
            <Box
              key={property.id}
              p={6}
              borderBottom="1px solid"
              borderColor={borderColor}
              bg={property.id === selectedId ? selectedBgColor : undefined}
              _hover={{ bg: property.id === selectedId ? selectedBgColor : hoverBgColor }}
              cursor="pointer"
              transition="all 0.2s"
              onClick={() => onPropertyClick?.(property)}
            >
              <Flex gap={6}>
                {/* 이미지 */}
                <Box 
                  flexShrink={0} 
                  w="140px" 
                  h="100px" 
                  overflow="hidden" 
                  borderRadius="sm"
                  border="1px solid"
                  borderColor={borderColor}
                >
                  <Image
                    src={property.images?.[0] || '/images/no-image.png'}
                    alt={property.address}
                    w="100%"
                    h="100%"
                    objectFit="cover"
                    fallback={
                      <Box
                        w="100%"
                        h="100%"
                        bg={fallbackBgColor}
                        display="flex"
                        alignItems="center"
                        justifyContent="center"
                      >
                        <Text fontSize="sm" color={mutedColor}>이미지 없음</Text>
                      </Box>
                    }
                  />
                </Box>

                {/* 정보 */}
                <Box flex={1}>
                  <Flex gap={2} mb={2} align="center">
                    <Badge colorScheme={property.status === '진행중' ? 'green' : 'gray'}>
                      {property.status}
                    </Badge>
                    <Text 
                      fontSize="sm" 
                      color={mutedColor}
                    >
                      {property.caseNumber}
                    </Text>
                  </Flex>
                  
                  <Text 
                    fontSize="lg" 
                    fontWeight="bold" 
                    mb={2}
                    color={textColor}
                  >
                    {formatPrice(property.minimumBidPrice)}
                  </Text>
                  
                  <Text 
                    fontSize="md" 
                    mb={2}
                    color={textColor}
                  >
                    {property.propertyType} | {property.totalArea}㎡
                  </Text>
                  
                  <Flex direction="column" gap={1}>
                    <Flex align="center" color={mutedColor} fontSize="sm">
                      <Icon as={FaMapMarkerAlt} mr={1} />
                      <Text>{property.address}</Text>
                    </Flex>
                    
                    <Flex align="center" color={mutedColor} fontSize="sm">
                      <Icon as={FaGavel} mr={1} />
                      <Text>{property.court}</Text>
                    </Flex>
                    
                    <Flex align="center" color={mutedColor} fontSize="sm">
                      <Icon as={FaCalendar} mr={1} />
                      <Text>입찰 {formatDate(property.auctionDate)}</Text>
                    </Flex>
                  </Flex>
                </Box>
              </Flex>
            </Box>
          ))}
        </VStack>
      </Box>
    </VStack>
  );
} 