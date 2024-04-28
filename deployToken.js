require("@nomiclabs/hardhat-waffle");
require("dotenv").config();

const { ethers } = require("hardhat");

async function main() {
    await hre.run('compile');

    try {
        const MyToken = await ethers.getContractFactory("MyToken");
        console.log("Deploying MyToken...");
        
        const initialSupply = process.env.INITIAL_TOKEN_SUPPLY;
        if (!initialSupply || isNaN(initialSupply) || parseInt(initialSupply) <= 0) {
            throw new Error("Invalid INITIAL_TOKEN_SUPPLY environment variable. Please set a positive number.");
        }

        const myToken = await MyToken.deploy(initialSupply);
        await myToken.deployed();
        console.log(`MyToken deployed to: ${myToken.address}`);
    } catch (error) {
        console.error("Deployment failed:", error.message);
        process.exitCode = 1;
        return;
    }
}

main().catch((error) => {
    console.error("Unhandled error:", error);
    process.exitCode = 1;
});