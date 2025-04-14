const hre = require("hardhat");

async function main() {
    console.log("Deploying BrowserMintNFT contract...");
    
    const BrowserMintNFT = await hre.ethers.getContractFactory("BrowserMintNFT");
    console.log("Contract factory created");
    
    const nft = await BrowserMintNFT.deploy();
    console.log("Deployment transaction sent, waiting for confirmation...");
    
    await nft.deployed();
    console.log("BrowserMintNFT deployed to:", nft.address);
    
    // Wait for 5 block confirmations
    console.log("Waiting for 5 block confirmations...");
    await nft.deployTransaction.wait(5);
    
    // Verify contract on Etherscan
    console.log("Verifying contract on Etherscan...");
    try {
        await hre.run("verify:verify", {
            address: nft.address,
            constructorArguments: [],
        });
        console.log("Contract verified successfully!");
    } catch (error) {
        console.error("Verification failed:", error.message);
    }
}

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error);
        process.exit(1);
    });