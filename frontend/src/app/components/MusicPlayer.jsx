'use client';

import { useState } from 'react';
import AudioPlayer from 'react-h5-audio-player';
import 'react-h5-audio-player/lib/styles.css';
import { Box } from '@chakra-ui/react';

export const MusicPlayer = ({ musicFile }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const audioUrl = `/api/stream/${musicFile._id}`;

  return (
    <Box className="w-full">
      <AudioPlayer
        src={audioUrl}
        autoPlay={false}
        showSkipControls={false}
        onError={(e) => {
          setError('Error loading audio file');
          console.error('Audio player error:', e);
        }}
        onLoadStart={() => setIsLoading(true)}
        onCanPlay={() => setIsLoading(false)}
        header={
          <Box p={2}>
            <strong>{musicFile.title}</strong> - {musicFile.artist}
          </Box>
        }
      />
    </Box>
  );
};