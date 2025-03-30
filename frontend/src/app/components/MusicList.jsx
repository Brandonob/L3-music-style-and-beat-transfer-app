'use client';

import { useState } from 'react';
import { useSelector } from 'react-redux';
import { Box, VStack, Text, Button } from '@chakra-ui/react';
import { MusicPlayer } from './MusicPlayer';

export const MusicList = () => {
  const [selectedMusic, setSelectedMusic] = useState(null);
  const musicFiles = useSelector((state) => state.music.musicFiles);

  return (
    <VStack spacing={4} width="100%" maxW="xl" mx="auto" p={4}>
      {musicFiles.map((musicFile) => (
        <Box 
          key={musicFile._id} 
          w="100%" 
          p={4} 
          borderWidth="1px" 
          borderRadius="lg"
          shadow="sm"
        >
          <Text fontWeight="bold">{musicFile.title}</Text>
          <Text>Artist: {musicFile.artist}</Text>
          <Text>Genre: {musicFile.genre}</Text>
          
          <Button
            mt={2}
            colorScheme="blue"
            size="sm"
            onClick={() => setSelectedMusic(selectedMusic === musicFile._id ? null : musicFile._id)}
          >
            {selectedMusic === musicFile._id ? 'Hide Player' : 'Play'}
          </Button>
          
          {selectedMusic === musicFile._id && (
            <Box mt={4}>
              <MusicPlayer musicFile={musicFile} />
            </Box>
          )}
        </Box>
      ))}
    </VStack>
  );
};