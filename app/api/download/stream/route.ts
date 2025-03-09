import { NextResponse } from 'next/server';
import ytdl from 'ytdl-core';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const url = searchParams.get('url');

  if (!url) {
    return NextResponse.json({ error: 'URL is required' }, { status: 400 });
  }

  try {
    // Get video info and highest quality format
    const info = await ytdl.getInfo(url);
    const format = ytdl.chooseFormat(info.formats, { quality: 'highest' });

    // Set response headers for download
    const headers = new Headers();
    headers.set('Content-Disposition', `attachment; filename="${info.videoDetails.title}.mp4"`);
    headers.set('Content-Type', 'video/mp4');

    // Stream the video
    const response = await fetch(format.url);
    return new NextResponse(response.body, { headers });
  } catch (error) {
    console.error('Download error:', error);
    return NextResponse.json({ error: 'Failed to process download' }, { status: 500 });
  }
} 