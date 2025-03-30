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
      {musicFiles.map((music) => (
        <Box 
          key={music._id} 
          w="100%" 
          p={4} 
          borderWidth="1px" 
          borderRadius="lg"
          shadow="sm"
        >
          <Text fontWeight="bold">{music.title}</Text>
          <Text>Artist: {music.artist}</Text>
          <Text>Genre: {music.genre}</Text>
          
          <Button
            mt={2}
            colorScheme="blue"
            size="sm"
            onClick={() => setSelectedMusic(selectedMusic === music._id ? null : music._id)}
          >
            {selectedMusic === music._id ? 'Hide Player' : 'Play'}
          </Button>
          
          {selectedMusic === music._id && (
            <Box mt={4}>
              <MusicPlayer musicFile={music} />
            </Box>
          )}
        </Box>
      ))}
    </VStack>
  );
};