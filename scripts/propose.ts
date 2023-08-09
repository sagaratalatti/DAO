import { ethers, network } from "hardhat"
import {
  developmentChains,
  VOTING_DELAY,
  proposalFile,
  STORE_FUNCTION,
  PROPOSAL_DESCRIPTION,
  NEW_STORE_VALUE,
} from "../helper-hardhat-config"
import * as fs from "fs"
import { moveBlocks } from "../utils/move-blocks"

export async function propose(args: any[], functionToCall: string, proposalDescription: string) {
  const governor = await ethers.getContract("GovernorContract")
  const box = await ethers.getContract("Box")
  const encodedFunctionCall = box.interface.encodeFunctionData(functionToCall, args)
  console.log(`Proposing ${functionToCall} on ${await box.getAddress()} with ${args}`)
  console.log(`Proposal Description:\n  ${proposalDescription}`)
  console.log(`Proposal EncodedFunctionCall: \n ${encodedFunctionCall}`)
  const proposeTx = await governor.getFunction("propose")(
    [await box.getAddress()],
    [0],
    [encodedFunctionCall],
    proposalDescription
  )
  // If working on a development chain, we will push forward till we get to the voting period.
  if (developmentChains.includes(network.name)) {
    await moveBlocks(VOTING_DELAY + 1)
  }
  const proposeReceipt = await proposeTx.wait(1)
  const proposalId = proposeReceipt.events[0].args.proposalId
  console.log(`Proposed with proposal ID:\n  ${proposalId}`)

  const proposalState = await governor.getFunction("state").call(proposalId)
  const proposalSnapShot = await governor.getFunction("proposalSnapshot").call(proposalId)
  const proposalDeadline = await governor.getFunction("proposalDeadline").call(proposalId)
  // save the proposalId
  storeProposalId(proposalId);

  // the Proposal State is an enum data type, defined in the IGovernor contract.
  // 0:Pending, 1:Active, 2:Canceled, 3:Defeated, 4:Succeeded, 5:Queued, 6:Expired, 7:Executed
  console.log(`Current Proposal State: ${proposalState}`)
  // What block # the proposal was snapshot
  console.log(`Current Proposal Snapshot: ${proposalSnapShot}`)
  // The block number the proposal voting expires
  console.log(`Current Proposal Deadline: ${proposalDeadline}`)
}

function storeProposalId(proposalId: any) {
  const chainId = network.config.chainId!.toString();
  let proposals:any;

  if (fs.existsSync(proposalFile)) {
      proposals = JSON.parse(fs.readFileSync(proposalFile, "utf8"));
  } else {
      proposals = { };
      proposals[chainId] = [];
  }   
  proposals[chainId].push(proposalId.toString());
  fs.writeFileSync(proposalFile, JSON.stringify(proposals), "utf8");
}

propose([NEW_STORE_VALUE], STORE_FUNCTION, PROPOSAL_DESCRIPTION)
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error)
    process.exit(1)
  })