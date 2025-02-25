'use client';

import {
  Box,
  Button,
  Text,
  Input,
  Stack,
  Heading,
  useColorModeValue,
} from '@chakra-ui/react';

export default function AIConsultingPanel() {
  const bgColor = useColorModeValue('white', 'gray.800');
  const borderColor = useColorModeValue('gray.200', 'gray.700');
  const inputBg = useColorModeValue('gray.50', 'gray.900');

  return (
    <Stack h="100%" p={4} bg={bgColor}>
      {/* 사용자 프로필 섹션 */}
      <Box p={4} bg={inputBg} borderRadius="lg" borderWidth="1px" borderColor={borderColor}>
        <Button colorScheme="gray" size="sm" w="100%" mb={2}>
          로그인/회원가입
        </Button>
        <Text fontSize="sm" color="gray.500">
          로그인하여 맞춤 추천을 받아보세요
        </Text>
      </Box>

      {/* AI 상담 폼 */}
      <Stack spacing={6}>
        <Heading size="md" color="gray.700">투자 선호도 설정</Heading>

        <Stack spacing={4}>
          <Box>
            <Text mb={2} fontSize="sm" fontWeight="medium">투자 가능 금액</Text>
            <Input placeholder="금액을 입력하세요" bg={inputBg} />
          </Box>

          <Box>
            <Text mb={2} fontSize="sm" fontWeight="medium">대출 가능 금액</Text>
            <Input placeholder="금액을 입력하세요" bg={inputBg} />
          </Box>

          <Box>
            <Text mb={2} fontSize="sm" fontWeight="medium">목표 수익률</Text>
            <Input placeholder="목표 수익률을 입력하세요" bg={inputBg} />
          </Box>

          <Box>
            <Text mb={2} fontSize="sm" fontWeight="medium">선호 지역</Text>
            <Input placeholder="지역을 입력하세요" bg={inputBg} />
          </Box>

          <Box>
            <Text mb={2} fontSize="sm" fontWeight="medium">물건 유형</Text>
            <Input as="select" placeholder="물건 유형을 선택하세요" bg={inputBg}>
              <option value="apartment">아파트</option>
              <option value="house">단독주택</option>
              <option value="commercial">상가</option>
              <option value="office">오피스텔</option>
            </Input>
          </Box>

          <Box>
            <Text mb={2} fontSize="sm" fontWeight="medium">투자 목적</Text>
            <Input as="select" placeholder="투자 목적을 선택하세요" bg={inputBg}>
              <option value="rental">임대수익형</option>
              <option value="capital">시세차익형</option>
              <option value="living">실거주형</option>
            </Input>
          </Box>
        </Stack>

        <Button
          colorScheme="gray"
          size="lg"
          w="100%"
          bg="gray.900"
          color="white"
          _hover={{ bg: 'gray.700' }}
        >
          AI 분석 시작
        </Button>
      </Stack>

      <Box borderTop="1px" borderColor={borderColor} pt={4} mt={4} />

      {/* AI 분석 결과 영역 */}
      <Box>
        <Heading size="md" mb={4} color="gray.700">
          AI 분석 결과
        </Heading>
        <Text color="gray.500">
          투자 선호도를 입력하시면 AI가 최적의 매물을 추천해드립니다.
        </Text>
      </Box>
    </Stack>
  );
} 