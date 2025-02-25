'use client';

import { Box, Flex, useColorModeValue } from '@chakra-ui/react';
import { ReactNode } from 'react';
import Navigator from './Navigator';

interface MainLayoutProps {
  children: ReactNode;
  leftPanel: ReactNode;
}

export default function MainLayout({ children, leftPanel }: MainLayoutProps) {
  const borderColor = useColorModeValue('gray.200', 'gray.700');
  const bgColor = useColorModeValue('gray.50', 'gray.900');

  return (
    <Box h="100vh" overflow="hidden">
      {/* 네비게이터 */}
      <Navigator />

      {/* 메인 콘텐츠 영역 */}
      <Flex mt="60px" h="calc(100vh - 60px)">
        {/* 좌측 패널 - AI 상담 인터페이스 (30%) */}
        <Box
          w="30%"
          h="100%"
          borderRight="1px"
          borderColor={borderColor}
          bg="white"
        >
          {leftPanel}
        </Box>

        {/* 우측 패널 - 지도 영역 (70%) */}
        <Box
          w="70%"
          h="100%"
          position="relative"
          bg={bgColor}
        >
          {children}
        </Box>
      </Flex>
    </Box>
  );
} 