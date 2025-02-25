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
  Heading,
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
  
  const bgColor = useColorModeValue('white', 'black');
  const borderColor = useColorModeValue('rgb(230, 230, 230)', 'rgb(38, 38, 38)');
  const textColor = useColorModeValue('black', 'white');
  const mutedColor = useColorModeValue('gray.600', 'gray.400');
  const bubbleBgUser = useColorModeValue('black', 'white');
  const bubbleTextUser = useColorModeValue('white', 'black');
  const bubbleBgAI = useColorModeValue('rgb(245, 245, 245)', 'rgb(28, 28, 28)');

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
    <Box h="100%" display="flex" flexDirection="column" bg={bgColor}>
      {/* 헤더 */}
      <Box 
        p={6} 
        borderBottom="1px solid" 
        borderColor={borderColor}
      >
        <Heading
          fontSize="2xl"
          color={textColor}
          letterSpacing="-0.03em"
          mb={1}
        >
          AI 부동산 상담사
        </Heading>
        <Text 
          fontSize="sm" 
          color={mutedColor}
          letterSpacing="-0.02em"
        >
          실시간 맞춤형 투자 상담
        </Text>
      </Box>

      {/* 메시지 영역 */}
      <VStack
        flex={1}
        overflowY="auto"
        spacing={6}
        p={6}
        align="stretch"
        className="minimal-scrollbar"
      >
        {messages.map((msg, idx) => (
          <Flex
            key={idx}
            justify={msg.role === 'user' ? 'flex-end' : 'flex-start'}
          >
            {msg.role === 'assistant' && (
              <Avatar
                size="sm"
                icon={<FaRobot size={12} />}
                bg={textColor}
                color={bgColor}
                mr={3}
              />
            )}
            <Box
              maxW="80%"
              p={4}
              borderRadius="sm"
              bg={msg.role === 'user' ? bubbleBgUser : bubbleBgAI}
              color={msg.role === 'user' ? bubbleTextUser : textColor}
              fontSize="sm"
              letterSpacing="-0.02em"
              lineHeight="1.6"
            >
              <Text>{msg.content}</Text>
            </Box>
          </Flex>
        ))}
      </VStack>

      {/* 입력 영역 */}
      <Box 
        p={4} 
        borderTop="1px solid" 
        borderColor={borderColor}
      >
        <HStack>
          <Input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="메시지를 입력하세요..."
            size="md"
            borderRadius="sm"
            borderColor={borderColor}
            _focus={{
              borderColor: textColor,
              boxShadow: 'none',
            }}
            onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
          />
          <IconButton
            aria-label="Send message"
            icon={<FaPaperPlane size={14} />}
            onClick={handleSendMessage}
            bg={textColor}
            color={bgColor}
            borderRadius="sm"
            _hover={{
              opacity: 0.8,
            }}
          />
        </HStack>
      </Box>
    </Box>
  );
} 