require("@nomiclabs/hardhat-waffle");
require("@nomiclabs/hardhat-ethers");
require("dotenv").config();

task("network-name", "Prints the network name", async (_, hre) => {
  console.log(`Network: ${hre.network.name}`);
}).catch((error) => {
  console.error(`Failed to print the network name: ${error.message}`);
  process.exit(1);
});

const solidityConfig = {
  version: "0.8.4",
  settings: {
    optimizer: {
      enabled: true,
      runs: 200,
    },
  },
};

function getNetworkConfig() {
  return {
    hardhat: {},
    rinkeby: {
      url: process.env.RINKEBY_URL,
      accounts: [`0x${process.env.PRIVATE_KEY}`],
    },
    ropsten: {
      url: process.env.ROPSTEN_URL,
      accounts: [`0x${process.env.PRIVATE_KEY}`],
    },
  };
}

module.exports = {
  solidity: solidityConfig,
  networks: getNetworkConfig(),
  paths: {
    sources: "./contracts",
    tests: "./test",
    cache: "./cache",
    artifacts: "./artifacts",
  },
};

(async () => {})().catch((error) => {
  console.error(`An error occurred during the script execution: ${error}`);
  process.exit(1);
});