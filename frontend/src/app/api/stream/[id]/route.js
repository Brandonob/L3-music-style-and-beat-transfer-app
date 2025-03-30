import { NextResponse } from 'next/server';
import { getDB } from '../../../../../lib/mongodb';
import { ObjectId } from 'mongodb';
import { Readable } from 'stream';
import { getGridFSBucket } from '../../../../../lib/gridfs';

export async function GET(req, { params }) {
  try {
    const { id } = params;
    const db = await getDB();
    
    // Get the file information from your music collection
    const musicDoc = await db.collection('music').findOne({
      _id: new ObjectId(id)
    });

    if (!musicDoc) {
      return NextResponse.json(
        { error: 'Music file not found' },
        { status: 404 }
      );
    }

    // Get the file from GridFS
    const bucket = await getGridFSBucket();
    const downloadStream = bucket.openDownloadStream(new ObjectId(musicDoc.fileId));

    // Create response with appropriate headers
    const response = new NextResponse(Readable.from(downloadStream));
    response.headers.set('Content-Type', 'audio/mpeg');
    response.headers.set('Accept-Ranges', 'bytes');

    return response;

  } catch (error) {
    console.error('Streaming error:', error);
    return NextResponse.json(
      { error: 'Failed to stream audio' },
      { status: 500 }
    );
  }
}