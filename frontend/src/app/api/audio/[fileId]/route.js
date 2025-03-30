import { GridFSBucket, ObjectId } from 'mongodb';
import { NextResponse } from 'next/server';
import { getDB } from '../../../../../lib/mongodb';

export async function GET(req, { params }) {
    console.log('params', params);
  const db = await getDB();
  const { fileId } = await params;
  const bucket = new GridFSBucket(db, {
    bucketName: 'music'
  });

  try {
    // Find the file metadata
    const files = await bucket.find({ _id: new ObjectId(fileId) }).toArray();
    console.log('files', files);
    if (!files.length) {
      return NextResponse.json(
        { error: 'File not found' },
        { status: 404 }
      );
    }

    const file = files[0];

    // Create readable stream
    const stream = bucket.openDownloadStream(new ObjectId(fileId));

    // Return the stream with appropriate headers
    return new NextResponse(stream, {
      headers: {
        'Content-Type': file.contentType,
        'Content-Length': file.length.toString(),
        'Accept-Ranges': 'bytes',
      },
    });
  } catch (error) {
    console.error('Error streaming file:', error);
    return NextResponse.json(
      { error: 'Error streaming file' },
      { status: 500 }
    );
  }
}