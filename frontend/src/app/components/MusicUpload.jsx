'use client';

import { useState, useEffect } from 'react';
import {
  Box,
  Button,
  FormControl,
  FormLabel,
  Input,
  Select,
  VStack,
  useToast,
  Progress,
  Text,
} from '@chakra-ui/react';
import { fetchAllMusicFiles } from '../redux/slices/musicSlice';
import { useDispatch } from 'react-redux';

export const MusicUpload = () => {
  const [file, setFile] = useState(null);
  const [duration, setDuration] = useState(null);
  const [title, setTitle] = useState('');
  const [artist, setArtist] = useState('');
  const [genre, setGenre] = useState('');
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const toast = useToast();
  const dispatch = useDispatch();

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setFile(file);
      
      // Calculate duration
      const audio = new Audio();
      const reader = new FileReader();
      
      reader.onload = function(e) {
        audio.src = e.target.result;
        audio.addEventListener('loadedmetadata', () => {
          setDuration(audio.duration);
        });
      };
      
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!file) return;

    // Check for duplicates first
    try {
      // Fix the duplicate check endpoint
      const checkResponse = await fetch(`/api/music/check?title=${encodeURIComponent(title)}&artist=${encodeURIComponent(artist)}`);
      const checkData = await checkResponse.json();
      
      if (checkData.exists) {
        toast({
          title: 'Duplicate Found',
          description: 'A song with this title and artist already exists',
          status: 'warning',
          duration: 5000,
          isClosable: true,
        });
        return;
      }

      // Continue with upload if no duplicate found
      setUploading(true);
      const formData = new FormData();
      formData.append('file', file);
      formData.append('title', title);
      formData.append('artist', artist);
      formData.append('genre', genre);
      formData.append('duration', duration);

      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });

      const data = await response.json();

      if (response.status === 409) {
        toast({
          title: 'Duplicate File',
          description: 'This file has already been uploaded',
          status: 'warning',
          duration: 5000,
          isClosable: true,
        });
        return;
      }

      if (!response.ok) {
        throw new Error(data.message || 'Upload failed');
      }

      toast({
        title: 'Success',
        description: 'Music uploaded successfully',
        status: 'success',
        duration: 5000,
        isClosable: true,
      });

      // Reset form
      setFile(null);
      setTitle('');
      setArtist('');
      setGenre('');
    } catch (error) {
      toast({
        title: 'Error',
        description: error.message || 'Failed to upload music',
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
    } finally {
      setUploading(false);
      setProgress(0);
    }
  };

  return (
    <Box className="max-w-xl mx-auto p-6 bg-white rounded-lg shadow-lg">
      <form onSubmit={handleSubmit}>
        <VStack spacing={4}>
          <FormControl isRequired>
            <FormLabel>Title</FormLabel>
            <Input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Enter song title"
              className="border-gray-300 focus:ring-blue-500"
            />
          </FormControl>

          <FormControl isRequired>
            <FormLabel>Artist</FormLabel>
            <Input
              value={artist}
              onChange={(e) => setArtist(e.target.value)}
              placeholder="Enter artist name"
              className="border-gray-300 focus:ring-blue-500"
            />
          </FormControl>

          <FormControl isRequired>
            <FormLabel>Genre</FormLabel>
            <Select
              value={genre}
              onChange={(e) => setGenre(e.target.value)}
              placeholder="Select genre"
              className="border-gray-300 focus:ring-blue-500"
            >
              <option value="rock">Rock</option>
              <option value="pop">Pop</option>
              <option value="country">Country</option>
              <option value="rnb">R&B</option>
              <option value="jazz">Jazz</option>
              <option value="classical">Classical</option>
              <option value="hiphop">Hip Hop</option>
            </Select>
          </FormControl>

          <FormControl isRequired>
            <FormLabel>Music File</FormLabel>
            <Input
              type="file"
              accept="audio/*"
              onChange={handleFileChange}
              className="border-gray-300 focus:ring-blue-500"
            />
          </FormControl>

          {uploading && (
            <Box w="100%">
              <Progress value={progress} size="sm" colorScheme="blue" />
              <Text mt={2} fontSize="sm" color="gray.500">
                Uploading... {progress}%
              </Text>
            </Box>
          )}

          <Button
            type="submit"
            colorScheme="blue"
            isLoading={uploading}
            loadingText="Uploading"
            className="w-full"
          >
            Upload Music
          </Button>
        </VStack>
      </form>
    </Box>
  );
}