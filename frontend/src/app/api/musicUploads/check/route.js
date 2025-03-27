import { getDB } from '../../../../../lib/mongodb';
import { NextResponse } from 'next/server';

export async function GET(req) {
    try {
        const { searchParams } = new URL(req.url);
        const title = searchParams.get('title');
        const artist = searchParams.get('artist');

        if (!title || !artist) {
            return NextResponse.json({ error: 'Title and artist are required' }, { status: 400 });
        }

        const db = await getDB();
        //escape the artist and title to avoid regex errors
        const escapedArtist = artist.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
        const escapedTitle = title.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
        const exists = await db.collection('music.files').findOne({
            filename: new RegExp(`^${escapedArtist} - ${escapedTitle}\..*$`, 'i')
        });

        return NextResponse.json({ exists: !!exists });
    } catch (error) {
        console.error('Error checking for duplicates:', error);
        return NextResponse.json({ error: 'Failed to check for duplicates' }, { status: 500 });
    }
}