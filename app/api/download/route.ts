import { NextResponse } from 'next/server';
import puppeteer from 'puppeteer';

async function getVideoSource(tmdbId: string) {
  try {
    // Launch headless browser
    const browser = await puppeteer.launch({ headless: 'new' });
    const page = await browser.newPage();
    
    // Go to the embed page
    await page.goto(`https://multiembed.mov/directstream.php?video_id=${tmdbId}&tmdb=1`);
    
    // Wait for video element and get its source
    await page.waitForSelector('video source');
    const videoSrc = await page.$eval('video source', (el) => el.getAttribute('src'));
    
    await browser.close();

    if (!videoSrc) {
      throw new Error('Video source not found');
    }

    return {
      streamUrl: videoSrc,
      downloadUrl: videoSrc,
      quality: '1080p',
      size: '~2GB'
    };
  } catch (error) {
    console.error('Error getting video source:', error);
    return null;
  }
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const tmdbId = searchParams.get('tmdbId');
  
  if (!tmdbId) {
    return NextResponse.json({ error: 'Movie ID is required' }, { status: 400 });
  }

  const videoSource = await getVideoSource(tmdbId);
  if (!videoSource) {
    return NextResponse.json({ error: 'Failed to get video source' }, { status: 404 });
  }

  return NextResponse.json(videoSource);
} 