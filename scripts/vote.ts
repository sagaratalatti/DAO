import * as fs from "fs";
import { VOTING_PERIOD, developmentChains, proposalFile } from "../helper-hardhat-config";
import { network, ethers } from "hardhat";
import { moveBlocks } from "../utils/move-blocks";

const index = 0;

async function main(proposalIndex: number) {

    const proposals = JSON.parse(fs.readFileSync(proposalFile, "utf8"));
    const proposalId = proposals[network.config.chainId!][proposalIndex];
    // 0 = Against, 1 = For, 2 = Abstain
    const voteWay = 1;
    const governance = await ethers.getContract("GovernorContract");
    const reason = "I Like Mangoes";
    const voteTxResponse = await governance.castVoteWithReason(proposalId, voteWay, reason);

    await voteTxResponse.wait(1);
    if (developmentChains.includes(network.name)) {
        await moveBlocks(VOTING_PERIOD + 1);
    }
    
    console.log("Voted! WAGMI!");

    // const proposalState = await governance.state("Enter JSON hash");
}

main(index).then(() => process.exit(0)).catch((error) => {
    console.error(error);
    process.exit(1);
});