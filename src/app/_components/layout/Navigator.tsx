import { Box, VStack, Button, Icon, Tooltip, useColorModeValue } from '@chakra-ui/react';
import { FaHome, FaSearch, FaHeart, FaHistory, FaCog, FaChartLine } from 'react-icons/fa';
import { useRouter } from 'next/navigation';

export default function Navigator() {
  const router = useRouter();
  const bgColor = useColorModeValue('white', 'gray.900');
  const borderColor = useColorModeValue('gray.200', 'gray.700');
  const iconColor = useColorModeValue('gray.700', 'gray.300');
  const hoverBg = useColorModeValue('gray.100', 'gray.800');

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
      py={6}
      zIndex={100}
    >
      <VStack spacing={5}>
        {navItems.map((item) => (
          <Tooltip 
            key={item.path} 
            label={item.label} 
            placement="right"
            hasArrow
            bg="gray.900"
            color="white"
            fontFamily="var(--font-sans)"
            fontSize="sm"
          >
            <Button
              variant="ghost"
              p={3}
              borderRadius="md"
              onClick={() => router.push(item.path)}
              _hover={{ bg: hoverBg }}
              color={iconColor}
            >
              <Icon as={item.icon} boxSize={5} />
            </Button>
          </Tooltip>
        ))}
      </VStack>
    </Box>
  );
} 