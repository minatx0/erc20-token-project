require("@nomiclabs/hardhat-waffle");
require("dotenv").config();

const { ethers } = require("hardhat");

async function main() {
    try {
        await hre.run('compile');
    } catch (compileError) {
        console.error("Compilation error:", compileError.message);
        process.exitCode = 1;
        return;
    }

    try {
        const MyToken = await ethers.getContractFactory("MyToken");
        console.log("Deploying MyToken...");

        const initialSupply = process.env.INITIAL_TOKEN_SUPPLY;

        const supply = Number(initialSupply);
        if (!initialSupply || isNaN(supply) || supply <= 0) {
            throw new Error("Invalid INITIAL_TOKEN_SUPPLY environment variable. Please set a positive number.");
        }

        const myToken = await MyToken.deploy(supply.toString());
        await myToken.deployed();
        console.log(`MyToken deployed to: ${myToken.address}`);

        // Novel Feature: Event Listening after Deployment
        await setupEventListeners(myToken); // Set up our novel feature: event listening
    } catch (error) {
        console.error("Deployment failed:", error.message);
        process.exitCode = 1;
        return;
    }
}

// Novel Feature Implementation: Setup event listeners for the MyToken contract
async function setupEventListeners(myToken) {
    console.log("Setting up event listeners...");
    
    // Example Transfer event listener
    myToken.on("Transfer", (from, to, amount, event) => {
        console.log(`Transfer event! ${amount} tokens from ${from} to ${to}.`);
        // Additional code can be implemented here, e.g., real-time notifications, triggering other functions, etc.
    });

    // Add more listeners as needed, depending on the events your MyToken contract emits
    // This is a basic template to expand upon

    console.log("Event listeners setup complete. Ready to monitor real-time interactions.");
}

main().catch((error) => {
    console.error("Unhandled error:", error);
    process.exitCode = 1;
});