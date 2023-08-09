import { HardhatRuntimeEnvironment } from "hardhat/types";
import { DeployFunction } from "hardhat-deploy/types";
import { ethers } from "hardhat";

const setupGovernance: DeployFunction = async function (hre: HardhatRuntimeEnvironment) {
    
    const { getNamedAccounts, deployments } = hre;
    const { log } = deployments;
    const { deployer } = await getNamedAccounts();
    
    const timeLock = await ethers.getContract("TimeLock", deployer);
    const governance = await ethers.getContract("GovernorContract", deployer);

    log("----------------------------------------------------")
    log("Setting up roles...");
    const proposerRole = ethers.id("PROPOSER_ROLE");
    const executorRole = ethers.id("EXECUTOR_ROLE");
    const adminRole = ethers.id("TIMELOCK_ADMIN_ROLE")

    log(`ProposerRole = ${proposerRole} \n ExecutorRole = ${executorRole} \n AdminRole = ${adminRole}`);

    const proposerTx = await timeLock.getFunction("grantRole")(proposerRole, await governance.getAddress());
    await proposerTx.wait(1); // wait for 1 block confirmation
    const executorTx = await timeLock.getFunction("grantRole")(executorRole, ethers.ZeroAddress);
    await executorTx.wait(1); // wait for 1 block confirmation */
    const revokeTx = await timeLock.getFunction("revokeRole")(adminRole, deployer);
    await revokeTx.wait(1); // wait for 1 block confirmation */
}

export default setupGovernance;
setupGovernance.tags = ["all", "setup"];