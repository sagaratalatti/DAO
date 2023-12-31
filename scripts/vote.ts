import * as fs from "fs"
import { network, ethers } from "hardhat"
import { proposalFile, developmentChains, VOTING_PERIOD } from "../helper-hardhat-config"
import { moveBlocks } from "../utils/move-blocks"


async function main() {
  const proposals = JSON.parse(fs.readFileSync(proposalFile, "utf8"))
  // Get the last proposal for the network. You could also change it for your index
  const proposalId = "71868859171677419052155345699497483540960066113331982602962523540651890624828";
  // 0 = Against, 1 = For, 2 = Abstain for this example
  const voteWay = 1
  const reason = "I lika do da cha cha"
  await vote(proposalId, voteWay, reason)
}

// 0 = Against, 1 = For, 2 = Abstain for this example
export async function vote(proposalId: string, voteWay: number, reason: string) {
  console.log("Voting...")
  const governor = await ethers.getContract("GovernorContract")
  const voteTx = await governor.getFunction("castVoteWithReason")(proposalId, voteWay, reason)
  const voteTxReceipt = await voteTx.wait(1)
  const log = governor.interface.parseLog(voteTxReceipt.logs[0]);
  const reasonLog = log?.args.reason;
  console.log(`Voting Reason: ${reasonLog}`);
  const proposalState = await governor.getFunction("state")(proposalId)

  console.log(`Current Proposal State: ${proposalState}`)
  if (developmentChains.includes(network.name)) {
    await moveBlocks(VOTING_PERIOD + 1)
  }
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error)
    process.exit(1)
  })