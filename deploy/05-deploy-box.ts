import { HardhatRuntimeEnvironment } from "hardhat/types";
import { DeployFunction } from "hardhat-deploy/types";
import { ethers } from "hardhat";
import { developmentChains, networkConfig } from "../helper-hardhat-config";
import verify from "../helper-functions";

const deployBox: DeployFunction = async function (hre: HardhatRuntimeEnvironment) {
    
    const { getNamedAccounts, deployments, network } = hre;
    const { deploy, log, get } = deployments;
    const { deployer } = await getNamedAccounts();
    
    log("----------------------------------------------------")
    log("Deploying Box ...");
    const box = await deploy("Box", {
        from: deployer,
        args: [],
        log: true,
        waitConfirmations: networkConfig[network.name].blockConfirmations || 1,
    });

    log(`Box at ${box.address}`)
    if (!developmentChains.includes(network.name) && process.env.ETHERSCAN_API_KEY) {
        await verify(box.address, []);
    }

    const boxContract = await ethers.getContractAt("Box", box.address);
    const timeLock = await ethers.getContract("TimeLock");

    const transferOwnershipTx = await boxContract.transferOwnership(await timeLock.getAddress());
    await transferOwnershipTx.wait(1);
    log("Box ownership has been transferred to TimeLock contract");

}

export default deployBox;
deployBox.tags = ["all", "box"];