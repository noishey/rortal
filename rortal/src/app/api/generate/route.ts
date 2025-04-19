import { NextResponse } from 'next/server';

// AUTOMATIC1111 WebUI API configuration
const SD_API_URL = process.env.SD_API_URL || 'http://127.0.0.1:7860'; // Default local address
const API_ENDPOINT = `${SD_API_URL}/sdapi/v1/txt2img`;

// Increase the Next.js API route timeout (for Vercel and similar platforms)
export const config = {
  runtime: 'edge',
  maxDuration: 60, // 60 seconds timeout
};

export async function POST(request: Request) {
  try {
    const { prompt, negative_prompt, steps, cfg_scale, width, height, sampler_name } = await request.json();

    if (!SD_API_URL) {
      return NextResponse.json({ error: 'AUTOMATIC1111 API URL not configured' }, { status: 500 });
    }

    // Map to AUTOMATIC1111 parameters
    const params = {
      prompt: prompt || '',
      negative_prompt: negative_prompt || '',
      steps: steps || 4, // Lower default for faster generation with LCM
      cfg_scale: cfg_scale || 7.0,
      width: width || 512,
      height: height || 512,
      sampler_name: mapSamplerName(sampler_name),
      batch_size: 1,
      n_iter: 1,
      seed: -1, // Random seed
      enable_hr: false, // No high-res fix for faster generation
      denoising_strength: 0.7
    };

    console.log('Sending request to AUTOMATIC1111:', JSON.stringify(params));

    // Make request to AUTOMATIC1111 WebUI API
    const response = await fetch(API_ENDPOINT, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(params),
    });

    if (!response.ok) {
      let errorText = 'Failed to generate image';
      try {
        const errorData = await response.json();
        errorText = errorData.detail || errorData.error || errorText;
      } catch (e) {
        errorText = await response.text().catch(() => errorText);
      }
      console.error('AUTOMATIC1111 API Error:', errorText);
      throw new Error(errorText);
    }

    const data = await response.json();
    
    if (!data.images || data.images.length === 0) {
      throw new Error('No images were generated');
    }
    
    // First image in base64 format
    const imageBase64 = data.images[0];
    return NextResponse.json({ image: 'data:image/png;base64,' + imageBase64 });
  } catch (error) {
    console.error('Generation error:', error);
    return NextResponse.json({ 
      error: error instanceof Error ? error.message : 'Failed to generate image' 
    }, { status: 500 });
  }
}

// Helper function to map sampler names between different APIs
function mapSamplerName(sampler: string | undefined): string {
  // Map samplers to AUTOMATIC1111 names
  const samplerMap: Record<string, string> = {
    'lcm': 'LCM', // LCM sampler for fast generation
    'k_euler_a': 'Euler a',
    'k_euler': 'Euler',
    'k_heun': 'Heun',
    'k_dpm_2': 'DPM2',
    'k_dpm_2_a': 'DPM2 a',
    'k_lms': 'LMS',
    'k_dpm_fast': 'DPM fast',
    'k_dpm_adaptive': 'DPM adaptive',
    'k_dpmpp_2s_a': 'DPM++ 2S a',
    'k_dpmpp_2m': 'DPM++ 2M',
    'k_dpmpp_sde': 'DPM++ SDE',
    'DDIM': 'DDIM'
  };

  // Return mapped sampler or default to LCM for speed
  return sampler ? (samplerMap[sampler] || 'LCM') : 'LCM';
} 