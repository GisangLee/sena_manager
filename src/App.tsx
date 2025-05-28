import { Box, Flex, Link as ChakraLink } from '@chakra-ui/react';
import { Routes, Route, useLocation } from 'react-router-dom';
import MainPage from '../src/page/Main';
import MembersPage from '../src/page/Members';
import ParticipationPage from '../src/page/GongSeongParticipation';
import { Toaster } from "./components/ui/toaster";
function App() {
  const { pathname } = useLocation();

  return (
    <>
      <Toaster />
      {/* 네비게이션: 고정 위치 */}
      <Box
        as="nav"
        position="fixed"
        top={0}
        left={0}
        w="100%"
        zIndex="1000"
        p={4}
        bg="white"
        shadow="sm"
        display="flex"
        justifyContent="center"
        gap={6}
      >
        <ChakraLink
          href="/"
          fontWeight="bold"
          color={pathname === '/' ? 'blue.500' : 'gray.700'}
        >
            🏠 홈
        </ChakraLink>
        <ChakraLink
          href="/members"
          fontWeight="bold"
          color={pathname === '/members' ? 'blue.500' : 'gray.700'}
        >
          👥 길드원 목록
        </ChakraLink>
        <ChakraLink
          href="/gongseong-participation"
          fontWeight="bold"
          color={pathname === '/participation' ? 'blue.500' : 'gray.700'}
        >
          📆 공성전 참여
        </ChakraLink>
      </Box>

      {/* 전체 페이지 래퍼 */}
      <Box pt="80px" minH="100vh" bg="gray.50">
        <Box p={6}>
          <Routes>
            <Route path="/" element={<MainPage />} />
            <Route path="/members" element={<MembersPage />} />
            <Route path="/gongseong-participation" element={<ParticipationPage />} />
            <Route path="*" element={<MembersPage />} />
          </Routes>
        </Box>
      </Box>
    </>
  );
}
export default App;