export interface networkConfigItem {
    ethUsdPriceFeed?: string
    blockConfirmations?: number
  }
  
  export interface networkConfigInfo {
    [key: string]: networkConfigItem
  }


export const networkConfig: networkConfigInfo = {
    localhost: {},
    hardhat: {},
    sepolia: {
      blockConfirmations: 6,
    },
}

export const MINIMUM_DELAY = 3600; // 1 hour
export const VOTING_PERIOD = 5; // 5 blocks
export const VOTING_DELAY = 1; // 1 block
export const QUORUM_PERCENTAGE = 4; // 4% of the voters need to pass
export const ADDRESS_ZERO = "0x0000000000000000000000000000000000000000" // blackhole address
export const NEW_STORE_VALUE = 77;
export const PROPOSAL_DESCRIPTION = "This proposal shall execute the box store function to save the uint256 passed through proposal";

export const developmentChains = ["hardhat", "localhost"];
export const proposalFile = "proposals.json";

// contract functions
export const STORE_FUNCTION = "store";
export const BURN_TOKENS = "burn";
export const APPROVE_TRANSACTION = "approveTransaction";
