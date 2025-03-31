import voiceProcessor from './voiceProcessor';
import { getGridFSBucket } from '../gridfs';
import { ObjectId } from 'mongodb';
import wav from 'node-wav';

export async function processRVC(fileId, targetGenre) {
  try {
    const bucket = await getGridFSBucket();
    
    // Read file from GridFS
    const chunks = [];
    const readStream = bucket.openDownloadStream(new ObjectId(fileId));
    
    await new Promise((resolve, reject) => {
      readStream.on('data', chunk => chunks.push(chunk));
      readStream.on('error', reject);
      readStream.on('end', resolve);
    });

    // Combine chunks and decode WAV
    const buffer = Buffer.concat(chunks);
    const wavData = wav.decode(buffer);
    
    // Load the appropriate model
    await voiceProcessor.loadModel(targetGenre);
    
    // Process the audio
    const processedBuffer = await voiceProcessor.processAudio(wavData.channelData[0], targetGenre);
    
    // Encode processed audio back to WAV
    const encodedWav = wav.encode([processedBuffer], {
      sampleRate: wavData.sampleRate,
      float: true,
    });
    
    // Save to GridFS
    const processedFileId = await saveProcessedAudio(encodedWav);
    
    return processedFileId;
  } catch (error) {
    console.error('RVC processing error:', error);
    throw error;
  }
}

async function saveProcessedAudio(audioBuffer) {
  try {
    const bucket = await getGridFSBucket();
    
    return await new Promise((resolve, reject) => {
      const uploadStream = bucket.openUploadStream('processed_audio.wav', {
        contentType: 'audio/wav',
      });

      uploadStream.on('error', reject);
      uploadStream.on('finish', () => resolve(uploadStream.id.toString()));
      
      uploadStream.write(audioBuffer);
      uploadStream.end();
    });
  } catch (error) {
    throw error;
  }
} 