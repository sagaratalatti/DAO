import { STORE_FUNCTION, NEW_STORE_VALUE, PROPOSAL_DESCRIPTION, developmentChains, MINIMUM_DELAY } from "../helper-hardhat-config";
import { ethers, network } from "hardhat";
import { moveTime } from "../utils/move-time";
import { moveBlocks } from "../utils/move-blocks";

export async function queueAndExecute () {
    const args = [NEW_STORE_VALUE];
    const box = await ethers.getContract("Box");
    const encodedFunctionCall = box.interface.encodeFunctionData(STORE_FUNCTION, args);
    const descriptionHash = ethers.utils.keccak256(
        ethers.utils.toUtf8Bytes(PROPOSAL_DESCRIPTION);
    );

    const governance = await ethers.getContract("GovernorContract");
    console.log("Queueing...");
    const queueTx = await governance.queue(
        [box.address],
        [0],
        [encodedFunctionCall],
        descriptionHash
    );

    await queueTx.wait(1);

    if (developmentChains.includes(network.name)) {
        await moveTime(MINIMUM_DELAY + 1);
        await moveBlocks(1);
    }

    console.log("Executing...");
    const executeTx = await governance.execute(
        [box.address],
        [0],
        [encodedFunctionCall],
        descriptionHash
    );

    await executeTx.wait(1);

    const boxNewValue = await box.retrieve();
    console.log(`New Box Value: ${boxNewValue.toString()}`);
}

queueAndExecute().then(() => process.exit(0)).catch((error) => {
    console.error(error);
    process.exit(1);
});