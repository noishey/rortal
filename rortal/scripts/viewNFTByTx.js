import { ethers } from 'ethers';
import fetch from 'node-fetch';
import fs from 'fs';
import path from 'path';

async function viewNFTByTx(txHash) {
    try {
        // Connect to Polygon Amoy
        const provider = new ethers.providers.JsonRpcProvider('https://rpc-amoy.polygon.technology');
        
        // Get transaction receipt
        const receipt = await provider.getTransactionReceipt(txHash);
        if (!receipt) {
            throw new Error('Transaction not found');
        }

        // Get transaction
        const tx = await provider.getTransaction(txHash);
        if (!tx) {
            throw new Error('Transaction details not found');
        }

        console.log('\nTransaction Details:');
        console.log('Transaction Hash:', txHash);
        console.log('Block Number:', receipt.blockNumber);
        console.log('From:', receipt.from);
        console.log('To:', receipt.to);
        console.log('Status:', receipt.status === 1 ? 'Success' : 'Failed');
        
        // Show raw transaction data
        console.log('\nRaw Transaction Data:', tx.data);

        // Parse input data
        const iface = new ethers.utils.Interface([
            "function mintNFT(string tokenURI) returns (uint256)"
        ]);
        
        try {
            const decodedData = iface.parseTransaction({ data: tx.data });
            console.log('\nMint Details:');
            console.log('Function Called:', decodedData.name);
            console.log('Token URI:', decodedData.args[0]);

            // If it's an IPFS URI, show the HTTP gateway URL
            if (decodedData.args[0].startsWith('ipfs://')) {
                const ipfsUrl = decodedData.args[0].replace('ipfs://', 'https://ipfs.io/ipfs/');
                console.log('IPFS Gateway URL:', ipfsUrl);

                try {
                    // First try to fetch as image
                    const response = await fetch(ipfsUrl);
                    const contentType = response.headers.get('content-type');
                    
                    if (contentType && contentType.startsWith('image/')) {
                        console.log('\nDirect Image Link:', ipfsUrl);
                        console.log('Content Type:', contentType);

                        // Save the image locally
                        const imageBuffer = await response.buffer();
                        const fileName = `nft_${txHash.slice(2, 10)}.${contentType.split('/')[1]}`;
                        const savePath = path.join(process.cwd(), 'images', fileName);
                        
                        // Create images directory if it doesn't exist
                        if (!fs.existsSync(path.join(process.cwd(), 'images'))) {
                            fs.mkdirSync(path.join(process.cwd(), 'images'));
                        }
                        
                        fs.writeFileSync(savePath, imageBuffer);
                        console.log('\nImage saved locally at:', savePath);
                    } else {
                        // If not an image, try parsing as JSON
                        const metadata = await response.json();
                        console.log('\nNFT Metadata:');
                        console.log('Name:', metadata.name);
                        console.log('Description:', metadata.description);
                        if (metadata.image) {
                            const imageUrl = metadata.image.startsWith('ipfs://')
                                ? metadata.image.replace('ipfs://', 'https://ipfs.io/ipfs/')
                                : metadata.image;
                            console.log('Image URL:', imageUrl);
                        }
                        if (metadata.attributes) {
                            console.log('\nAttributes:');
                            metadata.attributes.forEach(attr => {
                                console.log(`${attr.trait_type}: ${attr.value}`);
                            });
                        }
                    }
                } catch (metadataError) {
                    console.log('Could not fetch content:', metadataError.message);
                }
            }
        } catch (decodeError) {
            console.log('Could not decode transaction data:', decodeError.message);
        }

        // Look for Transfer event in logs
        console.log('\nTransaction Logs:');
        receipt.logs.forEach((log, index) => {
            console.log(`\nLog ${index + 1}:`);
            console.log('Address:', log.address);
            console.log('Topics:', log.topics);
            console.log('Data:', log.data);
        });

        const transferTopic = ethers.utils.id("Transfer(address,address,uint256)");
        const transferLog = receipt.logs.find(log => log.topics[0] === transferTopic);
        
        if (transferLog) {
            const tokenId = ethers.BigNumber.from(transferLog.topics[3]);
            console.log('\nToken Details:');
            console.log('Token ID:', tokenId.toString());
            console.log('Contract:', transferLog.address);
            console.log('From:', ethers.utils.defaultAbiCoder.decode(['address'], transferLog.topics[1])[0]);
            console.log('To:', ethers.utils.defaultAbiCoder.decode(['address'], transferLog.topics[2])[0]);
            console.log('\nViewing Links:');
            console.log('Polygon Amoy Explorer:', `https://www.oklink.com/amoy/token/${transferLog.address}/token/${tokenId}`);
            console.log('Transaction:', `https://www.oklink.com/amoy/tx/${txHash}`);
        }

    } catch (error) {
        console.error('Error:', error.message);
    }
}

// View the NFT from transaction
const txHash = '0x698928bdc98c2fec05a68ea227cbe57a902a1920e1e1f9d74a3c20b2b8d57810';
viewNFTByTx(txHash); 