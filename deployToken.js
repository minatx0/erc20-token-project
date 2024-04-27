require("@nomiclabs/hardhat-waffle");
require("dotenv").config();
const { ethers } = require("hardhat");

async function main() {
  await hre.run('compile');
  const MyToken = await ethers.getContractFactory("MyToken");
  console.log("Deploying MyToken...");
  const myToken = await MyToken.deploy(process.env.INITIAL_TOKEN_SUPPLY);
  await myToken.deployed();
  console.log(`MyToken deployed to: ${myToken.address}`);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});