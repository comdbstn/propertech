'use client';

import MainLayout from './components/layout/MainLayout';
import AIConsultingPanel from './components/ai/AIConsultingPanel';
import KakaoMap from './components/map/KakaoMap';
import { Box } from '@chakra-ui/react';

export default function Home() {
  return (
    <MainLayout leftPanel={<AIConsultingPanel />}>
      <Box as="div" h="100%" w="100%">
        <KakaoMap />
      </Box>
    </MainLayout>
  );
}
