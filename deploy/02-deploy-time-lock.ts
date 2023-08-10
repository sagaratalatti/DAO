import { HardhatRuntimeEnvironment } from "hardhat/types";
import { DeployFunction } from "hardhat-deploy/types";
import { MINIMUM_DELAY, developmentChains, networkConfig } from "../helper-hardhat-config";
import verify from "../helper-functions";

const deployTimelock: DeployFunction = async function (hre: HardhatRuntimeEnvironment) {
    
    const { getNamedAccounts, deployments, network } = hre;
    const { deploy, log } = deployments;
    const { deployer } = await getNamedAccounts();
    const args = [MINIMUM_DELAY, [], [], deployer];

    log("----------------------------------------------------")
    log("Deploying Timelock contract...");

    const timeLock = await deploy("TimeLock", {
        from: deployer,
        args: args,
        log: true,
        waitConfirmations: networkConfig[network.name].blockConfirmations || 1,
    });

    log(`Deployed governance contract to address ${timeLock.address}`);

    if (!developmentChains.includes(network.name) && process.env.ETHERSCAN_API_KEY) {
        await verify(timeLock.address, args);
    }

}

export default deployTimelock;
deployTimelock.tags = ["all", "timelock"];