import { Box, VStack, Text, Badge, Flex, Image, useColorModeValue } from '@chakra-ui/react';

interface Property {
  id: string;
  type: string;
  title: string;
  price: number;
  size: number;
  address: string;
  imageUrl: string;
}

export default function PropertyList() {
  const bgColor = useColorModeValue('white', 'gray.900');
  const borderColor = useColorModeValue('gray.200', 'gray.700');
  const hoverBgColor = useColorModeValue('gray.50', 'gray.800');

  const formatPrice = (price: number) => {
    if (price >= 10000) {
      return `${Math.floor(price / 10000)}억 ${price % 10000 > 0 ? `${price % 10000}만` : ''}`;
    }
    return `${price}만`;
  };

  const dummyProperties: Property[] = [
    {
      id: '1',
      type: '매매',
      title: '해커톤 아파트',
      price: 40000,
      size: 81.08,
      address: '서울시 강남구',
      imageUrl: 'https://images.unsplash.com/photo-1484154218962-a197022b5858',
    },
    {
      id: '2',
      type: '매매',
      title: '푸미아크로뷰',
      price: 35000,
      size: 35.88,
      address: '서울시 서초구',
      imageUrl: 'https://images.unsplash.com/photo-1484154218962-a197022b5858',
    },
  ];

  return (
    <VStack spacing={0} align="stretch" h="100%" bg={bgColor}>
      {/* 헤더 */}
      <Box p={6} borderBottom="1px" borderColor={borderColor}>
        <Text fontSize="2xl" fontWeight="bold" fontFamily="var(--font-serif)">
          매물 리스트
        </Text>
      </Box>

      {/* 매물 목록 */}
      <Box overflowY="auto" flex={1}>
        <VStack spacing={0} align="stretch">
          {dummyProperties.map((property) => (
            <Box
              key={property.id}
              p={4}
              borderBottom="1px"
              borderColor={borderColor}
              _hover={{ bg: hoverBgColor }}
              cursor="pointer"
              transition="all 0.2s"
            >
              <Flex gap={4}>
                {/* 이미지 */}
                <Box flexShrink={0} w="120px" h="90px" overflow="hidden" borderRadius="md">
                  <Image
                    src={property.imageUrl}
                    alt={property.title}
                    w="100%"
                    h="100%"
                    objectFit="cover"
                  />
                </Box>

                {/* 정보 */}
                <Box flex={1}>
                  <Flex justify="space-between" align="start" mb={2}>
                    <Badge colorScheme="blue" fontSize="sm">
                      {property.type}
                    </Badge>
                    <Text fontSize="lg" fontWeight="bold" color="blue.500">
                      {formatPrice(property.price)}
                    </Text>
                  </Flex>
                  <Text fontSize="md" fontWeight="bold" mb={1}>
                    {property.title}
                  </Text>
                  <Text fontSize="sm" color="gray.500">
                    {property.size}m² · {property.address}
                  </Text>
                </Box>
              </Flex>
            </Box>
          ))}
        </VStack>
      </Box>
    </VStack>
  );
} 