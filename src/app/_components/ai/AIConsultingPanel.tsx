'use client';

import {
  Box,
  VStack,
  HStack,
  Text,
  Input,
  Avatar,
  useColorModeValue,
  IconButton,
  Flex,
} from '@chakra-ui/react';
import { useState } from 'react';
import { FaPaperPlane, FaRobot } from 'react-icons/fa';

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

export default function AIConsultingPanel() {
  const [messages, setMessages] = useState<Message[]>([
    {
      role: 'assistant',
      content: '안녕하세요! 부동산 투자 AI 상담사입니다. 어떤 도움이 필요하신가요?',
    },
  ]);
  const [input, setInput] = useState('');
  
  const bgGradient = useColorModeValue(
    'linear(to-br, purple.50, white)',
    'linear(to-br, purple.900, gray.900)'
  );
  const headerBgGradient = useColorModeValue(
    'linear(to-r, purple.400, blue.500)',
    'linear(to-r, purple.600, blue.700)'
  );
  const borderColor = useColorModeValue('purple.100', 'purple.700');
  const bubbleBgUser = useColorModeValue('purple.500', 'purple.200');
  const bubbleTextUser = useColorModeValue('white', 'gray.900');
  const bubbleBgAI = useColorModeValue('white', 'whiteAlpha.200');
  const bubbleBorderAI = useColorModeValue('purple.100', 'purple.600');

  const handleSendMessage = async () => {
    if (!input.trim()) return;

    const newMessage: Message = { role: 'user', content: input };
    setMessages(prev => [...prev, newMessage]);
    setInput('');

    // TODO: 실제 GPT API 연동
    const aiResponse: Message = {
      role: 'assistant',
      content: '현재 AI 응답을 생성 중입니다. 실제 구현 시에는 GPT API를 통해 맞춤형 응답을 제공할 예정입니다.',
    };
    setTimeout(() => {
      setMessages(prev => [...prev, aiResponse]);
    }, 1000);
  };

  return (
    <Box h="100%" display="flex" flexDirection="column" bgGradient={bgGradient}>
      {/* 헤더 */}
      <Box p={6} bgGradient={headerBgGradient}>
        <HStack spacing={4}>
          <Avatar 
            icon={<FaRobot size={20} />} 
            bg="whiteAlpha.900" 
            color="purple.500"
            size="md"
          />
          <VStack align="start" spacing={1}>
            <Text color="white" fontFamily="var(--font-serif)" fontSize="xl" fontWeight="bold">
              AI 부동산 상담사
            </Text>
            <Text fontSize="sm" color="whiteAlpha.900" fontFamily="var(--font-sans)">
              실시간 맞춤형 투자 상담
            </Text>
          </VStack>
        </HStack>
      </Box>

      {/* 메시지 영역 */}
      <VStack
        flex={1}
        overflowY="auto"
        spacing={6}
        p={6}
        align="stretch"
      >
        {messages.map((msg, idx) => (
          <Flex
            key={idx}
            justify={msg.role === 'user' ? 'flex-end' : 'flex-start'}
          >
            {msg.role === 'assistant' && (
              <Avatar
                size="sm"
                icon={<FaRobot />}
                bg="purple.500"
                color="white"
                mr={2}
              />
            )}
            <Box
              maxW="80%"
              p={4}
              borderRadius="lg"
              bg={msg.role === 'user' ? bubbleBgUser : bubbleBgAI}
              color={msg.role === 'user' ? bubbleTextUser : 'inherit'}
              border="1px solid"
              borderColor={msg.role === 'user' ? 'transparent' : bubbleBorderAI}
              fontSize="sm"
              letterSpacing="-0.01em"
              lineHeight="1.7"
              shadow="sm"
            >
              <Text>{msg.content}</Text>
            </Box>
          </Flex>
        ))}
      </VStack>

      {/* 입력 영역 */}
      <Box p={4} borderTop="1px" borderColor={borderColor}>
        <HStack>
          <Input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="메시지를 입력하세요..."
            size="md"
            borderRadius="full"
            borderColor={borderColor}
            _focus={{
              borderColor: 'purple.400',
              boxShadow: '0 0 0 1px var(--chakra-colors-purple-400)',
            }}
            onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
          />
          <IconButton
            aria-label="Send message"
            icon={<FaPaperPlane />}
            onClick={handleSendMessage}
            colorScheme="purple"
            borderRadius="full"
          />
        </HStack>
      </Box>
    </Box>
  );
} 