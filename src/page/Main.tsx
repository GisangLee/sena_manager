import { Box, Heading, Text } from "@chakra-ui/react";

const MainPage = () => {
  return (
    <Box
      position="relative"
      w="100%"
      h="calc(100vh - 64px)" // 상단 nav 높이 고려
      bg="black" // 검정 바탕
    >
      {/* 배경 이미지 오버레이 */}
      <Box
        position="absolute"
        top={0}
        left={0}
        w="100%"
        h="100%"
        backgroundImage="url('https://cdn.gametoc.co.kr/news/photo/202505/92724_273871_136.jpg')"
        bgSize="cover"
        opacity={0.2} // 사진을 어둡게 (0~1)
        zIndex={0}
      />

      {/* 텍스트 내용 */}
      <Box
        position="relative"
        zIndex={1}
        w="100%"
        h="100%"
        display="flex"
        alignItems="center"
        justifyContent="center"
        flexDirection="column"
        textAlign="center"
      >
        <Heading size="2xl" color="white">
          세나 리버스 램찌 길드
        </Heading>
        <Text mt={4} fontSize="lg" color="gray.200">
          즐겁고 예의 있는 성인 길드에 오신 걸 환영합니다!
        </Text>
      </Box>
    </Box>
  );
};

export default MainPage;