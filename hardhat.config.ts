import { HardhatUserConfig } from "hardhat/config";
import "@nomicfoundation/hardhat-toolbox";
import "hardhat-deploy";
import "@nomiclabs/hardhat-ethers";
import "@typechain/hardhat";
import "hardhat-gas-reporter";
import "dotenv/config";
import "solidity-coverage";

const COINMARKETCAP_API_KEY = process.env.COINMARKETCAP_API_KEY || ""
const SEPOLIA_RPC_URL = process.env.SEPOLIA_RPC_URL
const PRIVATE_KEY = process.env.PRIVATE_KEY || "privateKey"
const ETHERSCAN_API_KEY = process.env.ETHERSCAN_API_KEY || ""


const config: HardhatUserConfig = {
  defaultNetwork: "hardhat",
  
  networks: {
    hardhat: {
      chainId: 31337,
      allowUnlimitedContractSize: true
    },
    localhost: {
      chainId: 31337,
      allowUnlimitedContractSize: true
    },
    sepolia: {
      url: SEPOLIA_RPC_URL,
      accounts: [PRIVATE_KEY],
      chainId: 11155111,
    }
  },

  solidity: {
    version: "0.8.18",
    settings: {
      optimizer: {
        enabled: true,
        runs: 200,
      },
    },
  },

  etherscan: {
    apiKey: ETHERSCAN_API_KEY,
  },

  gasReporter: {
    enabled: true,
    currency: "USD",
    outputFile: "gas-reporter.txt",
    noColors: true,
    coinmarketcap: COINMARKETCAP_API_KEY,
  },

  namedAccounts: {
    deployer: {
      default: 0, // here this will be default take the first account as deployers
      1: 0, // similarly on mainnet it will take the first account as deployer. Note though that depending on how hardhat network as configured, the account 0 on one network can be different thatn on another
    }
  },

  mocha: {
    timeout: 200000, // 200 seconds max for running tests
  }
};

export default config;
