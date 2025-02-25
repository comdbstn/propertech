'use client';

import MainLayout from './_components/layout/MainLayout';
import AIConsultingPanel from './_components/ai/AIConsultingPanel';
import KakaoMap from './_components/map/KakaoMap';
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
