import { NextResponse } from 'next/server';

// Stable Horde API configuration
const STABLE_HORDE_API_URL = 'https://stablehorde.net/api/v2';
const STABLE_HORDE_API_KEY = process.env.STABLE_HORDE_API_KEY || ''; // Default to empty string if not set

// Configure edge runtime for better performance
export const runtime = "edge";
export const maxDuration = 60; // 60 seconds timeout

export async function POST(request: Request) {
  try {
    const { prompt, negative_prompt, steps, cfg_scale, width, height, sampler_name, seed } = await request.json();

    if (!STABLE_HORDE_API_KEY) {
      console.warn('Stable Horde API key not configured, using anonymous access');
    }

    // Start generation
    const generationResponse = await fetch(`${STABLE_HORDE_API_URL}/generate/async`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'apikey': STABLE_HORDE_API_KEY,
      },
      body: JSON.stringify({
        prompt: prompt || '',
        negative_prompt: negative_prompt || '',
        params: {
          steps: steps || 8,
          cfg_scale: cfg_scale || 7.0,
          width: width || 512,
          height: height || 512,
          sampler_name: sampler_name || 'k_euler_a',
          seed: String(seed || "-1"), // Ensure it's a string
          n: 1,
          karras: true,
          hires_fix: false,
          clip_skip: 1,
          tiling: false,
          use_nsfw_censor: false
        },
        nsfw: false,
        censor_nsfw: false,
        models: ["stable_diffusion"],
        r2: true,
        shared: false,
        trusted_workers: true,
        slow_workers: false,
        workers: [],
        worker_blacklist: false,
        dry_run: false
      }),
    });

    if (!generationResponse.ok) {
      let errorText = 'Failed to start image generation';
      try {
        const errorData = await generationResponse.json();
        errorText = JSON.stringify(errorData);
      } catch (e) {
        errorText = await generationResponse.text().catch(() => errorText);
      }
      console.error('Stable Horde API Error:', errorText);
      throw new Error(errorText);
    }

    const data = await generationResponse.json();
    const id = data.id;
    
    if (!id) {
      throw new Error('No generation ID was returned');
    }
    
    // Poll for results with timeout
    const startTime = Date.now();
    const timeout = 60000; // 60 seconds timeout
    let status = 'processing';
    let retryCount = 0;
    const maxRetries = 10;

    while (status === 'processing' && Date.now() - startTime < timeout) {
      // Wait before checking
      const waitTime = Math.min(250 * Math.pow(2, retryCount), 2000);
      await new Promise(resolve => setTimeout(resolve, waitTime));
      retryCount = Math.min(retryCount + 1, maxRetries);
      
      try {
        // Check generation status
        const checkResponse = await fetch(`${STABLE_HORDE_API_URL}/generate/check/${id}`, {
          headers: {
            'apikey': STABLE_HORDE_API_KEY,
          },
        });

        if (!checkResponse.ok) {
          throw new Error('Failed to check generation status');
        }

        const checkData = await checkResponse.json();
        status = checkData.done ? 'done' : 'processing';

        if (status === 'done') {
          // Get the generation result
          const resultResponse = await fetch(`${STABLE_HORDE_API_URL}/generate/status/${id}`, {
            headers: {
              'apikey': STABLE_HORDE_API_KEY,
            },
          });

          if (!resultResponse.ok) {
            throw new Error('Failed to get generation result');
          }

          const resultData = await resultResponse.json();
          
          if (resultData.generations && resultData.generations.length > 0) {
            const imageUrl = resultData.generations[0].img;
            
            // Fetch the image and convert to base64
            const imageResponse = await fetch(imageUrl);
            if (!imageResponse.ok) {
              throw new Error('Failed to fetch generated image');
            }
            
            const imageBuffer = await imageResponse.arrayBuffer();
            const base64Image = Buffer.from(imageBuffer).toString('base64');
            const mimeType = imageResponse.headers.get('content-type') || 'image/png';
            
            return NextResponse.json({ 
              image: `data:${mimeType};base64,${base64Image}`,
              generationId: id
            });
          } else {
            throw new Error('No generations found in the result');
          }
        }
      } catch (error) {
        console.error('Error polling generation:', error);
        if (retryCount >= maxRetries) {
          throw error;
        }
        continue;
      }
    }

    throw new Error('Generation timed out or failed');
  } catch (error) {
    console.error('Generation error:', error);
    return NextResponse.json({ 
      error: error instanceof Error ? error.message : 'Failed to generate image' 
    }, { status: 500 });
  }
}