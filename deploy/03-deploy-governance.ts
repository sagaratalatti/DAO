import { HardhatRuntimeEnvironment } from "hardhat/types";
import { DeployFunction } from "hardhat-deploy/types";
import { networkConfig, VOTING_DELAY, VOTING_PERIOD, QUORUM_PERCENTAGE, developmentChains } from "../helper-hardhat-config";
import verify from "../helper-functions";

const deployGovernance: DeployFunction = async function (hre: HardhatRuntimeEnvironment) {
    
    const { getNamedAccounts, deployments, network } = hre;
    const { deploy, log, get } = deployments;
    const { deployer } = await getNamedAccounts();

    const governanceToken = await get("GovernanceToken");
    const timeLock = await get("TimeLock");
    const args = [governanceToken.address, timeLock.address, VOTING_DELAY, VOTING_PERIOD, QUORUM_PERCENTAGE];

    log("----------------------------------------------------")
    log("Deploying Governance Token...");
    const governance = await deploy("GovernorContract", {
        from: deployer,
        args: args,
        log: true,
        waitConfirmations: networkConfig[network.name].blockConfirmations || 1,
    });
    
    log(`Deployed governance contract to address ${governance.address}`);
    if (!developmentChains.includes(network.name) && process.env.ETHERSCAN_API_KEY) {
        await verify(governance.address, args)
    }
};


export default deployGovernance;
deployGovernance.tags = ["all", "governance"]