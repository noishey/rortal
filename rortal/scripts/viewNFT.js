import { ethers } from 'ethers';
import fetch from 'node-fetch';

// ERC721 interface for tokenURI
const ERC721_ABI = [
    "function tokenURI(uint256 tokenId) view returns (string)",
    "function ownerOf(uint256 tokenId) view returns (address)"
];

async function viewNFT(tokenId) {
    try {
        // Connect to Polygon Amoy
        const provider = new ethers.providers.JsonRpcProvider('https://rpc-amoy.polygon.technology');
        
        // Contract address
        const contractAddress = '0xd9Aa3fAe83B41f4F9835fB7ab7d087f0c91419ED';
        
        // Create contract instance with minimal ABI
        const contract = new ethers.Contract(contractAddress, ERC721_ABI, provider);

        console.log('\nViewing Link:');
        console.log('Polygon Amoy Explorer:', `https://www.oklink.com/amoy/token/${contractAddress}/token/${tokenId}`);
        
        console.log('\nToken Details:');
        console.log('Token ID:', tokenId);
        console.log('Contract:', contractAddress);

        try {
            // Get token URI
            const tokenURI = await contract.tokenURI(tokenId);
            console.log('Token URI:', tokenURI);
            
            // If the tokenURI is an IPFS URI, fetch the metadata
            if (tokenURI.startsWith('ipfs://')) {
                const ipfsHash = tokenURI.replace('ipfs://', '');
                const metadataUrl = `https://ipfs.io/ipfs/${ipfsHash}`;
                
                const response = await fetch(metadataUrl);
                const metadata = await response.json();
                
                console.log('\nNFT Metadata:');
                console.log('Name:', metadata.name);
                console.log('Description:', metadata.description);
                console.log('Image:', metadata.image?.replace('ipfs://', 'https://ipfs.io/ipfs/'));
                
                if (metadata.attributes) {
                    console.log('\nAttributes:');
                    metadata.attributes.forEach(attr => {
                        console.log(`${attr.trait_type}: ${attr.value}`);
                    });
                }
            }
        } catch (fetchError) {
            console.log('Could not fetch token metadata:', fetchError.message);
        }
        
        try {
            // Get owner
            const owner = await contract.ownerOf(tokenId);
            console.log('\nOwner:', owner);
        } catch (ownerError) {
            console.log('Could not fetch owner:', ownerError.message);
        }
        
    } catch (error) {
        console.error('Error:', error.message);
    }
}

// View the specific NFT
const tokenId = '427289198013598850965338683847236570414302303289';
viewNFT(tokenId);

// To run this script:
// 1. Make sure you have Node.js installed
// 2. Install dependencies: npm install ethers
// 3. Run: node scripts/viewNFT.js 