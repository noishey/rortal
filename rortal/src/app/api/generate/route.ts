import { NextResponse } from 'next/server';

const STABLE_HORDE_API_KEY = process.env.STABLE_HORDE_API_KEY;
const STABLE_HORDE_API_URL = 'https://stablehorde.net/api/v2/generate/async';

// Increase the Next.js API route timeout (for Vercel and similar platforms)
export const config = {
  runtime: 'edge',
  maxDuration: 60, // 60 seconds timeout
};

export async function POST(request: Request) {
  try {
    const { prompt, negative_prompt, steps, cfg_scale, width, height, sampler_name } = await request.json();

    if (!STABLE_HORDE_API_KEY) {
      return NextResponse.json({ error: 'API key not configured' }, { status: 500 });
    }

    // Simplified parameters that match Stable Horde's API exactly
    const params = {
      steps: Math.min(steps || 20, 20),       // Increased default steps
      cfg_scale: Math.min(cfg_scale || 7.0, 7.0), // Adjusted cfg_scale
      width: Math.min(width || 512, 512),     // Increased default width
      height: Math.min(height || 512, 512),   // Increased default height
      sampler_name: sampler_name || 'k_euler_a',
      n: 1,
    };

    // Validate sampler name
    const validSamplers = [
      'k_heun', 'k_lms', 'k_dpm_2_a', 'k_dpm_2', 'k_dpm_adaptive',
      'k_dpmpp_2m', 'DDIM', 'dpmsolver', 'k_euler_a', 'lcm',
      'k_euler', 'k_dpmpp_sde', 'k_dpm_fast', 'k_dpmpp_2s_a'
    ];

    if (sampler_name && !validSamplers.includes(sampler_name)) {
      throw new Error(`Invalid sampler name. Must be one of: ${validSamplers.join(', ')}`);
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
        params: params,
        models: ['stable_diffusion'],
        nsfw: false,
        censor_nsfw: false,
        trusted_workers: true,
        slow_workers: true, // Allow slower workers to increase chance of getting a result
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error('Stable Horde API Error:', errorData);
      throw new Error(errorData.message || 'Failed to generate image');
    }

    const data = await response.json();
    const generationId = data.id;

    // Improved polling strategy with exponential backoff
    let attempts = 0;
    const maxAttempts = 30; // Increased max attempts
    let status;
    let backoffTime = 1000; // Start with 1 second

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
      
      if (attempts >= maxAttempts) {
        throw new Error('Generation timed out after multiple attempts');
      }
      
      // If not done, implement exponential backoff
      if (!status.done) {
        attempts++;
        console.log(`Waiting for generation, attempt ${attempts}/${maxAttempts}, wait time: ${backoffTime}ms`);
        await new Promise(resolve => setTimeout(resolve, backoffTime));
        
        // Increase backoff time for next attempt (capped at 5 seconds)
        backoffTime = Math.min(backoffTime * 1.5, 5000);
      }
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
    
    if (!imageData.generations || imageData.generations.length === 0) {
      throw new Error('No images were generated');
    }
    
    return NextResponse.json({ image: imageData.generations[0].img });
  } catch (error) {
    console.error('Generation error:', error);
    return NextResponse.json({ 
      error: error instanceof Error ? error.message : 'Failed to generate image' 
    }, { status: 500 });
  }
} 