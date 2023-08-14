import { HardhatRuntimeEnvironment } from "hardhat/types";
import { DeployFunction } from "hardhat-deploy/types";
import { ethers } from "hardhat";
import { developmentChains, networkConfig } from "../helper-hardhat-config";
import verify from "../helper-functions";

const deployMemeToken: DeployFunction = async function (hre: HardhatRuntimeEnvironment) {
    
    const { getNamedAccounts, deployments, network } = hre;
    const { deploy, log } = deployments;
    const { deployer } = await getNamedAccounts();

    log("----------------------------------------------------")
    log("Deploying Meme Token...");
    const memeToken = await deploy("MemeToken", {
        from: deployer,
        args: [10000000000],
        log: true,
        // we need to wait if on a live network so we can verify properly
        waitConfirmations: networkConfig[network.name].blockConfirmations || 1,
        
    });

    log(`Deployed meme token to address ${memeToken.address}`);
    if (!developmentChains.includes(network.name) && process.env.ETHERSCAN_API_KEY) {
        await verify(memeToken.address, []);
    }

    log(`Delegating to ${deployer}`)
    // await delegate(memeToken.address, deployer);
    log("Deployer delegated"!)
};

/* const delegate = async (memeTokenAddress: string, delegatedAccount: string) => {
    const memeToken = await ethers.getContractAt("MemeToken", memeTokenAddress);
    
    const tx = await memeToken.transfer(delegatedAccount);
    await tx.wait(1);
    console.log(`Checkpoints ${await memeToken.numCheckpoints(delegatedAccount)}`);
} */

export default deployMemeToken;
deployMemeToken.tags = ["all", "memetoken"]