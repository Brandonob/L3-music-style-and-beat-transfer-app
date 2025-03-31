'use client';

import { useEffect, useRef, useState } from 'react';
import WaveSurfer from 'wavesurfer.js';
import HoverPlugin from 'wavesurfer.js/dist/plugins/hover';
import { Box, IconButton, HStack, Text, Slider, SliderTrack, SliderFilledTrack, SliderThumb } from '@chakra-ui/react';
import { FaPlay, FaPause, FaVolumeUp, FaVolumeMute } from 'react-icons/fa';

export const MusicPlayer = ({ musicFile }) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [volume, setVolume] = useState(1);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [isMuted, setIsMuted] = useState(false);
  
  const waveformRef = useRef(null);
  const wavesurferRef = useRef(null);
  const audioUrl = `/api/audio/${musicFile.fileId}`;

  useEffect(() => {
    let wavesurfer = null;

    if (waveformRef.current) {
      wavesurfer = WaveSurfer.create({
        container: waveformRef.current,
        waveColor: '#4A5568',
        progressColor: '#2B6CB0',
        cursorColor: '#2B6CB0',
        barWidth: 2,
        barRadius: 3,
        responsive: true,
        height: 60,
        plugins: [
          HoverPlugin.create({
            lineColor: '#000',
            lineWidth: 2,
            labelBackground: '#2B6CB0',
            labelColor: '#fff',
            labelSize: '11px',
          })
        ]
      });

      wavesurferRef.current = wavesurfer;

      wavesurfer.on('loading', () => setIsLoading(true));
      wavesurfer.on('ready', () => {
        setIsLoading(false);
        setDuration(wavesurfer.getDuration());
      });
      wavesurfer.on('error', (error) => {
        console.error('Wavesurfer error:', error);
        setError('Error loading audio file');
      });
      wavesurfer.on('audioprocess', () => {
        setCurrentTime(wavesurfer.getCurrentTime());
      });
      wavesurfer.on('finish', () => {
        setIsPlaying(false);
      });

      wavesurfer.load(audioUrl);

      return () => {
        if (wavesurfer) {
          wavesurfer.unAll();
          wavesurfer.destroy();
        }
      };
    }
  }, [audioUrl]);

  const handlePlayPause = () => {
    if (wavesurferRef.current) {
      wavesurferRef.current.playPause();
      setIsPlaying(!isPlaying);
    }
  };

  const handleVolumeChange = (value) => {
    if (wavesurferRef.current) {
      wavesurferRef.current.setVolume(value);
      setVolume(value);
      setIsMuted(value === 0);
    }
  };

  const toggleMute = () => {
    if (wavesurferRef.current) {
      if (isMuted) {
        wavesurferRef.current.setVolume(volume || 1);
        setIsMuted(false);
      } else {
        wavesurferRef.current.setVolume(0);
        setIsMuted(true);
      }
    }
  };

  const formatTime = (time) => {
    if (!time) return '0:00';
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  return (
    <Box className="w-full">
      <Box p={2}>
        <strong>{musicFile.title}</strong> - {musicFile.artist}
      </Box>
      
      <div ref={waveformRef} />

      <HStack mt={4} spacing={4} justify="center" align="center">
        <IconButton
          icon={isPlaying ? <FaPause /> : <FaPlay />}
          onClick={handlePlayPause}
          isLoading={isLoading}
          aria-label={isPlaying ? 'Pause' : 'Play'}
          colorScheme="blue"
        />

        <Text fontSize="sm" minWidth="60px">
          {formatTime(currentTime)}
        </Text>

        <Text fontSize="sm" minWidth="60px">
          {formatTime(duration)}
        </Text>

        <IconButton
          icon={isMuted ? <FaVolumeMute /> : <FaVolumeUp />}
          onClick={toggleMute}
          aria-label={isMuted ? 'Unmute' : 'Mute'}
          colorScheme="blue"
          variant="ghost"
        />

        <Box width="100px">
          <Slider
            aria-label="Volume"
            min={0}
            max={1}
            step={0.01}
            value={isMuted ? 0 : volume}
            onChange={handleVolumeChange}
          >
            <SliderTrack>
              <SliderFilledTrack />
            </SliderTrack>
            <SliderThumb />
          </Slider>
        </Box>
      </HStack>

      {error && (
        <Text color="red.500" mt={2} textAlign="center">
          {error}
        </Text>
      )}
    </Box>
  );
};