import { Box, VStack, Text, Flex, Image, useColorModeValue, Icon } from '@chakra-ui/react';
import { FaMapMarkerAlt } from 'react-icons/fa';

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
  const bgColor = useColorModeValue('white', 'black');
  const borderColor = useColorModeValue('rgb(230, 230, 230)', 'rgb(38, 38, 38)');
  const hoverBgColor = useColorModeValue('rgb(245, 245, 245)', 'rgb(28, 28, 28)');
  const textColor = useColorModeValue('black', 'white');
  const mutedColor = useColorModeValue('gray.600', 'gray.400');

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
          매물 리스트
        </Text>
      </Box>

      {/* 매물 목록 */}
      <Box 
        overflowY="auto" 
        flex={1} 
        className="minimal-scrollbar"
      >
        <VStack spacing={0} align="stretch">
          {dummyProperties.map((property) => (
            <Box
              key={property.id}
              p={6}
              borderBottom="1px solid"
              borderColor={borderColor}
              _hover={{ bg: hoverBgColor }}
              cursor="pointer"
              transition="all 0.2s"
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
                    src={property.imageUrl}
                    alt={property.title}
                    w="100%"
                    h="100%"
                    objectFit="cover"
                  />
                </Box>

                {/* 정보 */}
                <Box flex={1}>
                  <Text 
                    fontSize="lg" 
                    fontWeight="bold" 
                    mb={2}
                    color={textColor}
                  >
                    {formatPrice(property.price)}
                  </Text>
                  <Text 
                    fontSize="md" 
                    mb={2}
                    color={textColor}
                  >
                    {property.title}
                  </Text>
                  <Flex align="center" color={mutedColor} fontSize="sm">
                    <Icon as={FaMapMarkerAlt} mr={1} />
                    <Text>{property.address}</Text>
                    <Text mx={2}>·</Text>
                    <Text>{property.size}m²</Text>
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