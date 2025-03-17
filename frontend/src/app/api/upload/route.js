import { NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';

export async function POST(req) {
  try {
    const formData = await req.formData();
    const file = formData.get('file');
    const title = formData.get('title');
    const artist = formData.get('artist');
    const genre = formData.get('genre');

    // Here you would typically:
    // 1. Upload the file to a storage service (e.g., AWS S3)
    // 2. Get the file URL
    // 3. Store metadata in MongoDB

    const { db } = await connectToDatabase();

    const music = await db.collection('music').insertOne({
      title,
      artist,
      genre,
      fileName: file.name,
      fileSize: file.size,
      uploadDate: new Date(),
      // fileUrl: uploadedFileUrl, // Add this after implementing file storage
    });

    return NextResponse.json({ 
      success: true, 
      message: 'File uploaded successfully',
      musicId: music.insertedId 
    });

  } catch (error) {
    console.error('Upload error:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to upload file' },
      { status: 500 }
    );
  }
}