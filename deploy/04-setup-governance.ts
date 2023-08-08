import { HardhatRuntimeEnvironment } from "hardhat/types";
import { DeployFunction } from "hardhat-deploy/types";
import { ADDRESS_ZERO } from "../helper-hardhat-config";
import { ethers } from "hardhat";

const setupGovernance: DeployFunction = async function (hre: HardhatRuntimeEnvironment) {
    
    const { getNamedAccounts, deployments } = hre;
    const { log } = deployments;
    const { deployer } = await getNamedAccounts();
    
    const timeLock = await ethers.getContract("TimeLock", deployer);
    const governance = await ethers.getContract("GovernorContract", deployer);

    log("----------------------------------------------------")
    log("Setting up roles...");
    const proposerRole = await timeLock.PROPOSER_ROLE();
    const executorRole = await timeLock.EXECUTOR_ROLE();
    const adminRole = await timeLock.TIMELOCK_ADMIN_ROLE();

    const proposerTx = await timeLock.grantRole(proposerRole, await governance.getAddress());
    await proposerTx.wait(1); // wait for 1 block confirmation
    const executorTx = await timeLock.grantRole(executorRole, ADDRESS_ZERO);
    await executorTx.wait(1); // wait for 1 block confirmation
    const revokeTx = await timeLock.revokeRole(adminRole, deployer);
    await revokeTx.wait(1);
}

export default setupGovernance;
setupGovernance.tags = ["all", "setup"];