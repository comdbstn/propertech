import { Box, HStack, Button, Icon, Tooltip, useColorModeValue, Text, Flex } from '@chakra-ui/react';
import { FaSearch, FaHeart, FaHistory, FaCog, FaChartLine, FaBuilding } from 'react-icons/fa';
import { useRouter } from 'next/navigation';

export default function Navigator() {
  const router = useRouter();
  const bgGradient = useColorModeValue(
    'linear(to-r, white, gray.50)',
    'linear(to-r, gray.900, gray.800)'
  );
  const borderColor = useColorModeValue('gray.200', 'gray.700');
  const textColor = useColorModeValue('black', 'white');
  const mutedColor = useColorModeValue('gray.600', 'gray.400');
  const hoverBg = useColorModeValue('gray.100', 'gray.800');
  const tooltipBg = textColor;
  const tooltipColor = useColorModeValue('white', 'black');
  const logoBg = useColorModeValue('black', 'white');
  const logoColor = useColorModeValue('white', 'black');
  const logoTextAccent = useColorModeValue('black', 'white');

  const navItems = [
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
      px={6}
      zIndex={100}
      backdropFilter="blur(8px)"
      boxShadow="sm"
    >
      <Flex h="100%" justify="space-between" align="center" maxW="1600px" mx="auto">
        {/* 로고 */}
        <Button
          variant="unstyled"
          onClick={() => router.push('/')}
          display="flex"
          alignItems="center"
          height="auto"
          _hover={{ opacity: 0.8 }}
          gap={2}
        >
          <Box
            bg={logoBg}
            w="32px"
            h="32px"
            display="flex"
            alignItems="center"
            justifyContent="center"
            borderRadius="md"
            color={logoColor}
          >
            <Icon as={FaBuilding} boxSize={5} />
          </Box>
          <Text
            fontSize="xl"
            fontWeight="bold"
            fontFamily="var(--font-serif)"
            color={textColor}
            letterSpacing="-0.03em"
          >
            PROPER
            <Text as="span" color={logoTextAccent}>
              TECH
            </Text>
          </Text>
        </Button>

        {/* 네비게이션 메뉴 */}
        <HStack spacing={1} ml="auto">
          {navItems.map((item) => (
            <Tooltip 
              key={item.path} 
              label={item.label} 
              placement="bottom"
              hasArrow
              bg={tooltipBg}
              color={tooltipColor}
              fontFamily="var(--font-sans)"
              fontSize="sm"
            >
              <Button
                variant="ghost"
                px={4}
                py={6}
                borderRadius="md"
                onClick={() => router.push(item.path)}
                _hover={{ 
                  bg: hoverBg,
                  transform: 'translateY(-1px)',
                }}
                color={mutedColor}
                transition="all 0.2s"
                display="flex"
                gap={2}
                fontSize="sm"
              >
                <Icon as={item.icon} boxSize={4} />
                <Text display={{ base: 'none', lg: 'block' }}>
                  {item.label}
                </Text>
              </Button>
            </Tooltip>
          ))}
        </HStack>
      </Flex>
    </Box>
  );
} 