'use client';

import {
  Box,
  VStack,
  Button,
  Slider,
  SliderTrack,
  SliderFilledTrack,
  SliderThumb,
  Text,
  useColorModeValue,
  Tooltip,
  HStack,
} from '@chakra-ui/react';
import { FaMapMarkerAlt, FaDrawPolygon } from 'react-icons/fa';

export type MapMode = 'property' | 'territory';

interface MapControlsProps {
  mode: MapMode;
  onModeChange: (mode: MapMode) => void;
  competitionFilter: number;
  onCompetitionFilterChange: (value: number) => void;
}

export default function MapControls({
  mode,
  onModeChange,
  competitionFilter,
  onCompetitionFilterChange,
}: MapControlsProps) {
  const bgColor = useColorModeValue('white', 'black');
  const borderColor = useColorModeValue('gray.200', 'gray.700');
  const textColor = useColorModeValue('black', 'white');
  const buttonBgColor = useColorModeValue('gray.100', 'gray.800');
  const buttonHoverBgColor = useColorModeValue('gray.200', 'gray.700');
  const activeButtonBgColor = useColorModeValue('black', 'white');
  const activeButtonTextColor = useColorModeValue('white', 'black');
  const sliderBgColor = useColorModeValue('gray.200', 'gray.700');
  const sliderFilledBgColor = useColorModeValue('black', 'white');

  return (
    <Box
      position="absolute"
      top={4}
      right={4}
      zIndex={2}
      bg={bgColor}
      p={6}
      borderRadius="lg"
      border="1px solid"
      borderColor={borderColor}
      boxShadow="lg"
      backdropFilter="blur(8px)"
      minW="240px"
    >
      <VStack spacing={6} align="stretch">
        <Box>
          <Text 
            mb={3} 
            fontSize="sm" 
            fontWeight="medium"
            color={textColor}
            letterSpacing="tight"
          >
            보기 모드
          </Text>
          <HStack spacing={2}>
            <Button
              flex={1}
              size="sm"
              leftIcon={<FaMapMarkerAlt />}
              bg={mode === 'property' ? activeButtonBgColor : buttonBgColor}
              color={mode === 'property' ? activeButtonTextColor : textColor}
              _hover={{
                bg: mode === 'property' ? activeButtonBgColor : buttonHoverBgColor,
                transform: 'translateY(-1px)',
              }}
              onClick={() => onModeChange('property')}
              borderRadius="md"
              fontWeight="medium"
              transition="all 0.2s"
            >
              매물
            </Button>
            <Button
              flex={1}
              size="sm"
              leftIcon={<FaDrawPolygon />}
              bg={mode === 'territory' ? activeButtonBgColor : buttonBgColor}
              color={mode === 'territory' ? activeButtonTextColor : textColor}
              _hover={{
                bg: mode === 'territory' ? activeButtonBgColor : buttonHoverBgColor,
                transform: 'translateY(-1px)',
              }}
              onClick={() => onModeChange('territory')}
              borderRadius="md"
              fontWeight="medium"
              transition="all 0.2s"
            >
              영역
            </Button>
          </HStack>
        </Box>

        <Box>
          <Text 
            mb={3} 
            fontSize="sm" 
            fontWeight="medium"
            color={textColor}
            letterSpacing="tight"
          >
            경쟁 강도 필터
          </Text>
          <Slider
            min={0}
            max={100}
            step={10}
            value={competitionFilter * 100}
            onChange={(v) => onCompetitionFilterChange(v / 100)}
          >
            <SliderTrack bg={sliderBgColor}>
              <SliderFilledTrack bg={sliderFilledBgColor} />
            </SliderTrack>
            <Tooltip
              label={`${Math.round(competitionFilter * 100)}%`}
              placement="top"
              bg={activeButtonBgColor}
              color={activeButtonTextColor}
              fontSize="xs"
              hasArrow
            >
              <SliderThumb 
                boxSize={4}
                bg={sliderFilledBgColor}
                _focus={{
                  boxShadow: 'none',
                }}
              />
            </Tooltip>
          </Slider>
        </Box>
      </VStack>
    </Box>
  );
} 