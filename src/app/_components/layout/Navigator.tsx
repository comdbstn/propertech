import { Box, VStack, Button, Icon, Tooltip, useColorModeValue } from '@chakra-ui/react';
import { FaHome, FaSearch, FaHeart, FaHistory, FaCog, FaChartLine } from 'react-icons/fa';
import { useRouter } from 'next/navigation';

export default function Navigator() {
  const router = useRouter();
  const bgColor = useColorModeValue('white', 'gray.800');
  const borderColor = useColorModeValue('gray.200', 'gray.700');

  const navItems = [
    { icon: FaHome, label: '홈', path: '/' },
    { icon: FaSearch, label: '매물 검색', path: '/search' },
    { icon: FaHeart, label: '관심 매물', path: '/favorites' },
    { icon: FaHistory, label: '검색 기록', path: '/history' },
    { icon: FaChartLine, label: '투자 분석', path: '/analysis' },
    { icon: FaCog, label: '설정', path: '/settings' },
  ];

  return (
    <Box
      position="fixed"
      left={0}
      top={0}
      h="100vh"
      w="60px"
      bg={bgColor}
      borderRight="1px"
      borderColor={borderColor}
      py={4}
      zIndex={100}
      boxShadow="sm"
    >
      <VStack spacing={4}>
        {navItems.map((item) => (
          <Tooltip key={item.path} label={item.label} placement="right">
            <Button
              variant="ghost"
              p={3}
              borderRadius="lg"
              onClick={() => router.push(item.path)}
              _hover={{ bg: 'blue.50' }}
            >
              <Icon as={item.icon} boxSize={5} />
            </Button>
          </Tooltip>
        ))}
      </VStack>
    </Box>
  );
} 