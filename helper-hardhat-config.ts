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
export const SAGAR_ADDRESS = "0x3124475af0ba367fFf33a5DC9BcE78c41f493713"
export const GAURAV_ADDRESS = "0x7032576BCF4a7fc07d083F3c6b1f320a75B17959"
export const RUTURAJ_ADDRESS = "0xe83dD509245EA4920c910b3D61f32582744f6d2F"
export const HH_ADDRESS_1 = "0x70997970C51812dc3A010C7d01b50e0d17dc79C8"
export const HH_ADDRESS_2 = "0x3C44CdDdB6a900fa2b585dd299e03d12FA4293BC"

export const PROPOSAL_DESCRIPTION = "This proposal shall execute the box store function to save the uint256 passed through proposal";

export const developmentChains = ["hardhat", "localhost"];
export const proposalFile = "proposals.json";

// contract functions
export const STORE_FUNCTION = "store";
export const APPROVE_TRANSACTION_FUNCTION = "approveTransaction";
export const SUBMIT_TRANSACTION_FUNCTION = "submitTransaction";
export const BURN_TOKENS = "burn";
export const APPROVE_TRANSACTION = "approveTransaction";
export const TRANSFER_TOKENS_FUNCTION = "transferTokens";

// function arguments
export const NEW_STORE_VALUE = 77;
export const SUBMIT_TRANSACTION_ID = 1651198130471028976109111467856801098765282281128954988686930752887367508211;
export const APPROVE_TRANSACTION_ID = 1651198130471028976109111467856801098765282281128954988686930752887367508211;
export const WITHDRAW_AMOUNT = 1000;
export const TRANSFER_FUNCTION_BYTECODE = 0xbec3fa170000000000000000000000007032576bcf4a7fc07d083f3c6b1f320a75b1795900000000000000000000000000000000000000000000021e19e0c9bab2400000;
