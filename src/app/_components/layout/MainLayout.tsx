'use client';

import { Box, Flex, useColorModeValue } from '@chakra-ui/react';
import Navigator from './Navigator';
import AIConsultingPanel from '../ai/AIConsultingPanel';
import KakaoMap from '../map/KakaoMap';

export default function MainLayout() {
  const bgColor = useColorModeValue('gray.50', 'gray.900');
  const borderColor = useColorModeValue('gray.200', 'gray.700');

  return (
    <Box minH="100vh" bg={bgColor}>
      <Navigator />
      
      {/* 메인 콘텐츠 */}
      <Flex 
        mt="60px" 
        h="calc(100vh - 60px)" 
        maxW="1600px" 
        mx="auto"
        px={6}
        py={6}
        gap={6}
      >
        {/* 왼쪽 패널 */}
        <Flex 
          direction="column" 
          w="400px"
          gap={6}
        >
          {/* AI 상담 패널 */}
          <Box 
            flex={1} 
            bg={useColorModeValue('white', 'black')}
            borderRadius="lg"
            overflow="hidden"
            border="1px solid"
            borderColor={borderColor}
            boxShadow="sm"
          >
            <AIConsultingPanel />
          </Box>
        </Flex>

        {/* 오른쪽 패널 */}
        <Flex 
          flex={1} 
          bg={useColorModeValue('white', 'black')}
          borderRadius="lg"
          overflow="hidden"
          border="1px solid"
          borderColor={borderColor}
          boxShadow="sm"
        >
          <KakaoMap />
        </Flex>
      </Flex>
    </Box>
  );
} 