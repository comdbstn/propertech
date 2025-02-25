'use client';

import { Box, Flex } from '@chakra-ui/react';
import { ReactNode } from 'react';

interface MainLayoutProps {
  children: ReactNode;
  leftPanel: ReactNode;
}

export default function MainLayout({ children, leftPanel }: MainLayoutProps) {
  return (
    <Flex h="100vh" overflow="hidden">
      {/* 좌측 패널 - AI 상담 인터페이스 (30%) */}
      <Box
        w="30%"
        h="100%"
        borderRight="1px"
        borderColor="gray.200"
        overflowY="auto"
        bg="white"
      >
        {leftPanel}
      </Box>

      {/* 우측 패널 - 지도 영역 (70%) */}
      <Box w="70%" h="100%" position="relative">
        {children}
      </Box>
    </Flex>
  );
} 