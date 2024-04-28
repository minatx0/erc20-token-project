require("@nomiclabs/hardhat-waffle");
require("@nomiclabs/hardhat-ethers");
require("dotenv").config();

task("network-name", "Prints the network name", async (taskArgs, hre) => {
  try {
    console.log("Network:", hre.network.name);
  } catch (error) {
    console.error("Failed to print the network name:", error.message);
    process.exit(1);
  }
});

module.exports = {
  solidity: {
    version: "0.8.4",
    settings: {
      optimizer: {
        enabled: true,
        runs: 200
      }
    }
  },
  networks: {
    hardhat: {},
    rinkeby: {
      url: process.env.RINKEBY_URL,
      accounts: [process.env.PRIVATE_KEY]
    },
    ropsten: {
      url: process.env.ROPSTEN_URL,
      accounts: [process.env.PRIVATE_KEY]
    }
  },
  paths: {
    sources: "./contracts",
    tests: "./test",
    cache: "./cache",
    artifacts: "./artifacts"
  },
};

(async () => {
  try {
  } catch (error) {
    console.error("An error occurred during the script execution:", error);
    process.exit(1);
  }
})();