import { NextResponse } from 'next/server';
import { getDB } from '../../../../lib/mongodb';
import { uploadToGridFS } from '../../../../lib/gridfs';

export async function POST(req) {
  try {
    const formData = await req.formData();
    const file = formData.get('file');
    const title = formData.get('title');
    const artist = formData.get('artist');
    const genre = formData.get('genre');
    const duration = formData.get('duration');

    // Validate file exists
    if (!file) {
      return NextResponse.json(
        { success: false, message: 'No file provided' },
        { status: 400 }
      );
    }

    console.log('Checking for duplicate file:', {
      fileName: file.name,
      fileSize: file.size,
      fileType: file.type
    });

    // Check for existing file
    const db = await getDB();
    const existingFile = await db.collection('music').findOne({
      fileName: file.name,
      fileSize: file.size
    });

    if (existingFile) {
      return NextResponse.json({
        success: false,
        message: 'This file has already been uploaded',
        existingFileId: existingFile.fileId
      }, { status: 409 }); // 409 Conflict
    }

    // Upload file to GridFS
    const fileId = await uploadToGridFS(file, file.name);
    console.log('File uploaded to GridFS, fileId:', fileId);

    const music = await db.collection('music').insertOne({
      title,
      artist,
      genre,
      fileName: file.name,
      fileSize: file.size,
      fileId: fileId,
      duration: duration,
      uploadDate: new Date(),
    });

    return NextResponse.json({ 
      success: true, 
      message: 'File uploaded successfully',
      musicId: music.insertedId,
      fileId: fileId
    });

  } catch (error) {
    console.error('Upload error details:', {
      message: error.message,
      stack: error.stack,
      name: error.name
    });
    
    return NextResponse.json(
      { 
        success: false, 
        message: 'Failed to upload file',
        error: error.message // Adding the specific error message
      },
      { status: 500 }
    );
  }
}