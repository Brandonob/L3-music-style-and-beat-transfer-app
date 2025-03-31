'use client';

import { useState } from 'react';
import { useSelector } from 'react-redux';
import { Box, VStack, Text, Button, Heading } from '@chakra-ui/react';
import { MusicPlayer } from './MusicPlayer';

export const MusicList = () => {
  const [selectedMusic, setSelectedMusic] = useState(null);
  const musicFiles = useSelector((state) => state.music.musicFiles);

  return (
    <VStack spacing={4} width="100%" maxW="xl" mx="auto" p={4}>
        <Heading className="text-4xl font-bold text-gray-800 mb-4">
          Music List
        </Heading>
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