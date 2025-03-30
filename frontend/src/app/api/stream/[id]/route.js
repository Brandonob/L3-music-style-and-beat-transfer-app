import { NextResponse } from 'next/server';
import { getDB } from '../../../../../lib/mongodb';
import { ObjectId } from 'mongodb';
import { Readable } from 'stream';
import { getGridFSBucket } from '../../../../../lib/gridfs';

export async function GET(req, { params }) {
  try {
    console.log('params', params);  
    const db = await getDB();
    const { id } = await params;
    
    // Validate if id is a valid ObjectId
    if (!ObjectId.isValid(id)) {
      return NextResponse.json(
        { error: 'Invalid file ID format' },
        { status: 400 }
      );
    }

    
    // Get the file information directly from GridFS files collection
    //find music file by fileId
    //fileId is the id of the song stored in the music collection
    const musicFile = await db.collection('music.files').findOne({
      _id: new ObjectId(id)  // Changed from fileId to _id since we're looking in music.files
    });

    if (!musicFile) {
      return NextResponse.json(
        { error: 'Music file not found' },
        { status: 404 }
      );
    }

    // Get the file from GridFS
    const bucket = await getGridFSBucket();
    const downloadStream = bucket.openDownloadStream(new ObjectId(id)); // Use the id directly since it's the GridFS file id

    // Create response with appropriate headers
    const response = new NextResponse(Readable.from(downloadStream));
    response.headers.set('Content-Type', musicFile.contentType || 'audio/mpeg');
    response.headers.set('Accept-Ranges', 'bytes');
    response.headers.set('Cache-Control', 'no-cache');
    response.headers.set('Content-Length', musicFile.length.toString());

    return response;

  } catch (error) {
    console.error('Streaming error:', error);
    return NextResponse.json(
      { error: 'Failed to stream audio' },
      { status: 500 }
    );
  }
}