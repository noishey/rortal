import { NextResponse } from 'next/server';

const STABLE_HORDE_API_KEY = process.env.STABLE_HORDE_API_KEY;
const STABLE_HORDE_API_URL = 'https://stablehorde.net/api/v2/generate/async';

export async function POST(request: Request) {
  try {
    const { prompt, negative_prompt, steps, cfg_scale, width, height } = await request.json();

    if (!STABLE_HORDE_API_KEY) {
      return NextResponse.json({ error: 'API key not configured' }, { status: 500 });
    }

    const response = await fetch(STABLE_HORDE_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'apikey': STABLE_HORDE_API_KEY,
      },
      body: JSON.stringify({
        prompt: prompt,
        negative_prompt: negative_prompt,
        params: {
          steps: steps || 30,
          cfg_scale: cfg_scale || 7.5,
          width: width || 512,
          height: height || 512,
          sampler_name: 'k_euler',
          n: 1,
        },
        models: ['stable_diffusion'],
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Failed to generate image');
    }

    const data = await response.json();
    const generationId = data.id;

    // Poll for generation status
    let status;
    do {
      const statusResponse = await fetch(`https://stablehorde.net/api/v2/generate/check/${generationId}`, {
        headers: {
          'apikey': STABLE_HORDE_API_KEY,
        },
      });
      
      if (!statusResponse.ok) {
        throw new Error('Failed to check generation status');
      }
      
      status = await statusResponse.json();
      
      if (status.faulted) {
        throw new Error('Generation failed');
      }
      
      await new Promise(resolve => setTimeout(resolve, 1000));
    } while (!status.done);

    // Get the generated image
    const imageResponse = await fetch(`https://stablehorde.net/api/v2/generate/status/${generationId}`, {
      headers: {
        'apikey': STABLE_HORDE_API_KEY,
      },
    });

    if (!imageResponse.ok) {
      throw new Error('Failed to get generated image');
    }

    const imageData = await imageResponse.json();
    return NextResponse.json({ image: imageData.generations[0].img });
  } catch (error) {
    console.error('Generation error:', error);
    return NextResponse.json({ 
      error: error instanceof Error ? error.message : 'Failed to generate image' 
    }, { status: 500 });
  }
} 