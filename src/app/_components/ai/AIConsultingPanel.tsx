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
  
  const bgColor = useColorModeValue('white', 'gray.800');
  const borderColor = useColorModeValue('gray.200', 'gray.700');
  const bubbleBgUser = useColorModeValue('blue.500', 'blue.200');
  const bubbleBgAI = useColorModeValue('gray.100', 'gray.700');

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
    <Box h="100%" display="flex" flexDirection="column">
      {/* 헤더 */}
      <Box p={4} borderBottom="1px" borderColor={borderColor} bg={bgColor}>
        <HStack>
          <Avatar icon={<FaRobot />} bg="blue.500" color="white" />
          <VStack align="start" spacing={0}>
            <Text fontWeight="bold">AI 부동산 상담사</Text>
            <Text fontSize="sm" color="gray.500">실시간 맞춤형 투자 상담</Text>
          </VStack>
        </HStack>
      </Box>

      {/* 메시지 영역 */}
      <VStack
        flex={1}
        overflowY="auto"
        spacing={4}
        p={4}
        align="stretch"
        bg={useColorModeValue('gray.50', 'gray.900')}
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
                bg="blue.500"
                color="white"
                mr={2}
              />
            )}
            <Box
              maxW="80%"
              p={3}
              borderRadius="lg"
              bg={msg.role === 'user' ? bubbleBgUser : bubbleBgAI}
              color={msg.role === 'user' ? 'white' : 'inherit'}
            >
              <Text>{msg.content}</Text>
            </Box>
          </Flex>
        ))}
      </VStack>

      {/* 입력 영역 */}
      <Box p={4} borderTop="1px" borderColor={borderColor} bg={bgColor}>
        <HStack>
          <Input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="메시지를 입력하세요..."
            onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
          />
          <IconButton
            aria-label="Send message"
            icon={<FaPaperPlane />}
            colorScheme="blue"
            onClick={handleSendMessage}
          />
        </HStack>
      </Box>
    </Box>
  );
} 