import { ethers } from 'ethers';
import fetch from 'node-fetch';

async function viewNFTByTx(txHash) {
    try {
        // Connect to Polygon Amoy
        const provider = new ethers.providers.JsonRpcProvider('https://rpc-amoy.polygon.technology');
        
        console.log('Fetching transaction...');
        const tx = await provider.getTransactionReceipt(txHash);
        
        if (!tx) {
            throw new Error('Transaction not found');
        }

        console.log('\nTransaction Details:');
        console.log('Contract Address:', tx.to);
        console.log('From:', tx.from);
        console.log('Block Number:', tx.blockNumber);
        
        // Get logs from the transaction
        const logs = tx.logs;
        
        // Find Transfer event (topic0 is the event signature)
        const transferEvent = logs.find(log => 
            log.topics[0] === '0xddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef' // Transfer event signature
        );

        if (!transferEvent) {
            throw new Error('No Transfer event found in transaction');
        }

        // Get tokenId from the event (it's in the last topic)
        const tokenId = ethers.BigNumber.from(transferEvent.topics[3]).toString();
        console.log('Token ID:', tokenId);

        // Create contract instance with minimal ABI
        const ERC721_ABI = [
            "function tokenURI(uint256 tokenId) view returns (string)",
            "function ownerOf(uint256 tokenId) view returns (address)",
            "function mintNFT(string memory tokenURI) public returns (uint256)"
        ];
        const contract = new ethers.Contract(tx.to, ERC721_ABI, provider);

        try {
            // Get token URI
            const tokenURI = await contract.tokenURI(tokenId);
            console.log('Token URI:', tokenURI);

            // If the tokenURI is an IPFS URI, fetch the metadata
            if (tokenURI.startsWith('ipfs://')) {
                const ipfsHash = tokenURI.replace('ipfs://', '');
                const metadataUrl = `https://ipfs.io/ipfs/${ipfsHash}`;
                
                console.log('Fetching metadata from:', metadataUrl);
                const response = await fetch(metadataUrl);
                const metadata = await response.json();
                
                console.log('\nNFT Metadata:');
                console.log(JSON.stringify(metadata, null, 2));
            }
        } catch (error) {
            console.log('\nError fetching token metadata:');
            console.log('Error message:', error.message);
            console.log('This might indicate that the contract does not implement the standard ERC721 interface.');
            console.log('You can try viewing the raw transaction data instead.');
        }

        try {
            // Get owner
            const owner = await contract.ownerOf(tokenId);
            console.log('\nOwner:', owner);
        } catch (error) {
            console.log('\nError fetching owner:');
            console.log('Error message:', error.message);
        }

        // Show raw event data
        console.log('\nRaw Event Data:');
        console.log(JSON.stringify(transferEvent, null, 2));

        console.log('\nView on Explorer:');
        console.log(`https://www.oklink.com/amoy/tx/${txHash}`);
        console.log(`https://www.oklink.com/amoy/token/${tx.to}/token/${tokenId}`);

    } catch (error) {
        console.error('Error:', error.message);
    }
}

// Replace with your transaction hash
const txHash = '0x55a7ee6cb0ce15edd6519a27040cb0c00615f8acc913b8b0549e6792a0867b81'; // Add your transaction hash here
viewNFTByTx(txHash); 