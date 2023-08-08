import { ethers, network } from "hardhat"
import { NEW_STORE_VALUE, STORE_FUNCTION, PROPOSAL_DESCRIPTION, developmentChains, VOTING_DELAY, proposalFile} from "../helper-hardhat-config";
import { moveBlocks } from "../utils/move-blocks";
import * as fs from "fs";

export async function propose(args: any[], functionToCall: string, proposalDescription: string) {
    const governance = await ethers.getContract("GovernorContract");
    const box = await ethers.getContract("Box");
    const encodedFunctionCall = box.interface.encodeFunctionData(functionToCall, args);

    console.log(`Proposing ${functionToCall} on ${box.address} with ${args}`);
    console.log(`Proposal Description: \n ${proposalDescription}`);

    const proposeTx = await governance.propose([box.address], [0], [encodedFunctionCall], proposalDescription);
    const proposeReceipt = await proposeTx.wait(1);

    if(developmentChains.includes(network.name)) {
        await moveBlocks(VOTING_DELAY + 1);
    }

    const proposalId = proposeReceipt.events[0].args.proposalId;
    let proposals = JSON.parse(fs.readFileSync(proposalFile, "utf8"));
    proposals[network.config.chainId!.toString()].push(proposalId.toString());
    fs.writeFileSync(proposalFile, JSON.stringify(proposals));

}

propose([NEW_STORE_VALUE], STORE_FUNCTION, PROPOSAL_DESCRIPTION).then(() => process.exit(0)).catch((error) => {
    console.log(error);
    process.exit(1);
});