import { NextResponse } from 'next/server';

// Use a reliable Stable Diffusion model
const HF_API_URL = '';
const HF_API_KEY = process.env.HUGGING_FACE_API_KEY;

export const runtime = "edge";
export const maxDuration = 60;

export async function POST(request: Request) {
  try {
    if (!HF_API_KEY) {
      return NextResponse.json({ 
        error: 'Hugging Face API key not configured.' 
      }, { status: 500 });
    }

    const { prompt, negative_prompt, steps, cfg_scale, width, height } = await request.json();

    const response = await fetch(HF_API_URL, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${HF_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        inputs: prompt,
        parameters: {
          negative_prompt: negative_prompt || "text, watermark, signature, blurry",
          num_inference_steps: steps || 25,
          guidance_scale: cfg_scale || 7.0,
          width: width || 512,
          height: height || 512
        }
      })
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`HF API Error: ${response.status} - ${errorText}`);
    }

    const imageBlob = await response.blob();
    const arrayBuffer = await imageBlob.arrayBuffer();
    const base64Image = Buffer.from(arrayBuffer).toString('base64');
    
    return NextResponse.json({ 
      image: `data:image/png;base64,${base64Image}`
    });
  } catch (error) {
    console.error('Generation error:', error);
    return NextResponse.json({ 
      error: error instanceof Error ? error.message : 'Failed to generate image' 
    }, { status: 500 });
  }
}