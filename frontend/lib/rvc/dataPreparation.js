import { AudioContext } from 'web-audio-api';
import * as tf from '@tensorflow/tfjs-node';

export async function prepareTrainingData(audioBuffers, genreType) {
  const audioContext = new AudioContext();
  const fftSize = 2048;
  const inputs = [];
  const outputs = [];

  try {
    for (const buffer of audioBuffers) {
      const analyser = audioContext.createAnalyser();
      analyser.fftSize = fftSize;

      const source = audioContext.createBufferSource();
      source.buffer = buffer;
      source.connect(analyser);

      const frequencyData = new Float32Array(analyser.frequencyBinCount);
      analyser.getFloatFrequencyData(frequencyData);

      inputs.push(frequencyData);
      // Add target genre characteristics
      // This is a simplified example - you'd need to define proper genre characteristics
      outputs.push(generateGenreCharacteristics(genreType, frequencyData.length));
    }

    return {
      inputs: tf.tensor2d(inputs),
      outputs: tf.tensor2d(outputs),
    };
  } catch (error) {
    console.error('Error preparing training data:', error);
    throw error;
  }
}

function generateGenreCharacteristics(genreType, length) {
  // This is a simplified example
  // You'd need to define proper genre characteristics based on your requirements
  const characteristics = new Float32Array(length);
  
  switch (genreType) {
    case 'rock':
      // Enhance mid frequencies
      for (let i = 0; i < length; i++) {
        characteristics[i] = i > length/4 && i < length/2 ? 1.2 : 1.0;
      }
      break;
    case 'jazz':
      // Enhance low-mid frequencies
      for (let i = 0; i < length; i++) {
        characteristics[i] = i < length/3 ? 1.3 : 1.0;
      }
      break;
    // Add more genres as needed
  }
  
  return characteristics;
} 