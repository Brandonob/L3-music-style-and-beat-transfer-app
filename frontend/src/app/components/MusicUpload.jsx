'use client';

import { useState } from 'react';
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

export const MusicUpload = () => {
  const [file, setFile] = useState(null);
  const [title, setTitle] = useState('');
  const [artist, setArtist] = useState('');
  const [genre, setGenre] = useState('');
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const toast = useToast();

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!file) return;

    setUploading(true);
    const formData = new FormData();
    formData.append('file', file);
    formData.append('title', title);
    formData.append('artist', artist);
    formData.append('genre', genre);

    try {
      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) throw new Error('Upload failed');

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
        description: 'Failed to upload music',
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