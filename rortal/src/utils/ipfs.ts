import { Web3Storage } from 'web3.storage';

const client = new Web3Storage({ token: process.env.WEB3_STORAGE_TOKEN! });

export async function uploadToIPFS(imageUrl: string): Promise<string> {
  try {
    // Fetch the image
    const response = await fetch(imageUrl);
    const blob = await response.blob();
    
    // Create a File object
    const file = new File([blob], 'generated-image.png', { type: 'image/png' });
    
    // Upload to IPFS
    const cid = await client.put([file]);
    
    // Return the IPFS URL
    return `https://${cid}.ipfs.dweb.link/generated-image.png`;
  } catch (error) {
    console.error('Error uploading to IPFS:', error);
    throw error;
  }
} 