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
  const bgColor = useColorModeValue('white', 'gray.800');
  const borderColor = useColorModeValue('gray.200', 'gray.700');
  const activeColor = useColorModeValue('blue.500', 'blue.300');
  const inactiveColor = useColorModeValue('gray.500', 'gray.500');

  return (
    <Box
      position="absolute"
      top={4}
      right={4}
      zIndex={2}
      bg={bgColor}
      p={4}
      borderRadius="lg"
      border="1px solid"
      borderColor={borderColor}
      boxShadow="lg"
    >
      <VStack spacing={4} align="stretch">
        <Box>
          <Text mb={2} fontSize="sm" fontWeight="bold">
            보기 모드
          </Text>
          <Box display="flex" gap={2}>
            <Button
              flex={1}
              size="sm"
              leftIcon={<FaMapMarkerAlt />}
              colorScheme={mode === 'property' ? 'blue' : 'gray'}
              variant={mode === 'property' ? 'solid' : 'outline'}
              onClick={() => onModeChange('property')}
            >
              매물
            </Button>
            <Button
              flex={1}
              size="sm"
              leftIcon={<FaDrawPolygon />}
              colorScheme={mode === 'territory' ? 'blue' : 'gray'}
              variant={mode === 'territory' ? 'solid' : 'outline'}
              onClick={() => onModeChange('territory')}
            >
              영역
            </Button>
          </Box>
        </Box>

        <Box>
          <Text mb={2} fontSize="sm" fontWeight="bold">
            경쟁 강도 필터
          </Text>
          <Slider
            min={0}
            max={100}
            step={10}
            value={competitionFilter * 100}
            onChange={(v) => onCompetitionFilterChange(v / 100)}
          >
            <SliderTrack bg={inactiveColor}>
              <SliderFilledTrack bg={activeColor} />
            </SliderTrack>
            <Tooltip
              label={`${Math.round(competitionFilter * 100)}%`}
              placement="top"
              isOpen
            >
              <SliderThumb boxSize={6} />
            </Tooltip>
          </Slider>
        </Box>
      </VStack>
    </Box>
  );
} 