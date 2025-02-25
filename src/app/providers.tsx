'use client';

import { CacheProvider } from '@chakra-ui/next-js';
import { ChakraProvider, createLocalStorageManager } from '@chakra-ui/react';
import { ReactNode } from 'react';

const colorModeManager = createLocalStorageManager('chakra-ui-color-mode');

export function Providers({ children }: { children: ReactNode }) {
  return (
    <CacheProvider>
      <ChakraProvider colorModeManager={colorModeManager}>
        {children}
      </ChakraProvider>
    </CacheProvider>
  );
} 