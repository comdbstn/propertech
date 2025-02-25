import { Box, HStack, Button, Icon, Tooltip, useColorModeValue } from '@chakra-ui/react';
import { FaHome, FaSearch, FaHeart, FaHistory, FaCog, FaChartLine } from 'react-icons/fa';
import { useRouter } from 'next/navigation';

export default function Navigator() {
  const router = useRouter();
  const bgGradient = useColorModeValue(
    'linear(to-r, white, gray.50)',
    'linear(to-r, gray.900, gray.800)'
  );
  const borderColor = useColorModeValue('gray.200', 'gray.700');
  const iconColor = 'black';
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
      top={0}
      left={0}
      right={0}
      h="60px"
      bgGradient={bgGradient}
      borderBottom="1px"
      borderColor={borderColor}
      px={4}
      zIndex={100}
      backdropFilter="blur(8px)"
      boxShadow="sm"
    >
      <HStack h="100%" spacing={2} justify="center">
        {navItems.map((item) => (
          <Tooltip 
            key={item.path} 
            label={item.label} 
            placement="bottom"
            hasArrow
            bg="black"
            color="white"
            fontFamily="var(--font-sans)"
            fontSize="sm"
          >
            <Button
              variant="ghost"
              p={3}
              borderRadius="lg"
              onClick={() => router.push(item.path)}
              _hover={{ 
                bg: hoverBg,
                transform: 'translateY(-2px)',
                transition: 'all 0.2s'
              }}
              color={iconColor}
              transition="all 0.2s"
            >
              <Icon as={item.icon} boxSize={5} />
            </Button>
          </Tooltip>
        ))}
      </HStack>
    </Box>
  );
} 