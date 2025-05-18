import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    
    const response = await fetch('https://catbox.moe/user/api.php', {
      method: 'POST',
      body: formData
    });

    if (!response.ok) {
      console.error('Catbox API error:', response.status, await response.text());
      throw new Error('Upload failed');
    }

    const url = await response.text();
    
    // Check if the response is a valid URL
    if (!url.startsWith('http')) {
      console.error('Invalid response from Catbox:', url);
      throw new Error('Invalid response from upload service');
    }

    return NextResponse.json({ url });
  } catch (error) {
    console.error('Upload error:', error);
    return NextResponse.json(
      { error: 'Failed to upload image' },
      { status: 500 }
    );
  }
} 