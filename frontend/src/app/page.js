'use client'
import Image from "next/image";
import { MusicUpload } from "./components/MusicUpload";
import { Container, Box, Heading, Text } from "@chakra-ui/react";

export default function Home() {
  return (
    <Container maxW="container.xl" className="py-10">
      <Box className="text-center mb-10">
        <Heading className="text-4xl font-bold text-gray-800 mb-4">
          Music Upload Platform
        </Heading>
        <Text className="text-gray-600">
          Upload and share your favorite music tracks
        </Text>
      </Box>
      
      <MusicUpload />
    </Container>
  );
}
