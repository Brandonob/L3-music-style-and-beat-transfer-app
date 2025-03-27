import { GridFSBucket } from 'mongodb';
import { getDB } from './mongodb';

export async function uploadToGridFS(file, filename) {
  try {
    const db = await getDB();
    const bucket = new GridFSBucket(db, {
      bucketName: 'music' // This would create music.files and music.chunks collections
    });

    // Create a buffer from the file
    const buffer = Buffer.from(await file.arrayBuffer());
    
    // Upload to GridFS
    return await new Promise((resolve, reject) => {
      const uploadStream = bucket.openUploadStream(filename, {
        contentType: file.type,
      });

      uploadStream.on('error', (error) => {
        reject(error);
      });

      uploadStream.on('finish', function() {
        // Use the id from the uploadStream itself
        resolve(uploadStream.id.toString());
      });

      uploadStream.write(buffer);
      uploadStream.end();
    });
  } catch (error) {
    console.error('GridFS upload error:', error);
    throw error;
  }
}