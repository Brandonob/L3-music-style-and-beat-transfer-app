import { getDB } from '../../../../lib/mongodb';
import { NextResponse } from 'next/server';

//get all music uploads
export async function GET(req) {
    try {   
        const db = await getDB();
        const musicUploads = await db.collection('music').find({}).toArray();
        return NextResponse.json(musicUploads);
    } catch (error) {
        console.error('Error fetching music uploads:', error);
        return NextResponse.json({ error: 'Failed to fetch music uploads' }, { status: 500 });
    }
}
