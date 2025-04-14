interface MintedNFTProps {
    tokenId: string;
  }
  
  export default function MintedNFT({ tokenId }: MintedNFTProps) {
    return (
      <div className="p-4 border rounded shadow-lg">
        <h2 className="text-xl">Your NFT has been minted!</h2>
        <p>Token ID: {tokenId}</p>
        <p>Check it out on OpenSea!</p>
      </div>
    );
  }
  