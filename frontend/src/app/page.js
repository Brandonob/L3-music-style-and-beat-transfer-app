'use client'
import Image from "next/image";
import { useEffect } from "react";
import { MusicUpload } from "./components/MusicUpload";
import { Container, Box, Heading, Text } from "@chakra-ui/react";
import { MusicList } from "./components/MusicList"; 
// import { AudioPlayer } from "./components/MusicPlayer";
import { useSelector, useDispatch } from "react-redux";
import { fetchAllMusicFiles } from "./redux/slices/musicSlice";

export default function Home() {
  const musicFiles = useSelector((state) => state.music.musicFiles);  
  const currentTrack = useSelector((state) => state.music.currentTrack);
  const dispatch = useDispatch();

useEffect(() => {
    dispatch(fetchAllMusicFiles());
  }, []);

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
      {/* <AudioPlayer musicId={currentTrack} /> */}
      <MusicList />
    </Container>
  );
}
