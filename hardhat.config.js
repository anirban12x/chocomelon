require("@nomiclabs/hardhat-waffle");

module.exports = {
  solidity: "0.8.4",
  paths: {
    artifacts: "./src/backend/artifacts",
    sources: "./src/backend/contracts",
    cache: "./src/backend/cache",
    tests: "./src/backend/test"
  },
  networks: {
    hardhat: {
      chainId: 1337 // Hardhat default chain ID for local network
    },
    localhost: {
      url: "http://127.0.0.1:8545", // URL for local Hardhat node
      chainId: 1337
    },
    // If you plan to deploy to Infura testnets later:
    // rinkeby: {
    //   url: `https://rinkeby.infura.io/v3/YOUR_INFURA_PROJECT_ID`,
    //   accounts: [`0x${YOUR_PRIVATE_KEY}`]
    // }
  },
};
