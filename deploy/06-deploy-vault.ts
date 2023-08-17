import { HardhatRuntimeEnvironment } from "hardhat/types";
import { DeployFunction } from "hardhat-deploy/types";
import { networkConfig, VOTING_DELAY, VOTING_PERIOD, QUORUM_PERCENTAGE, developmentChains, HH_ADDRESS_1, HH_ADDRESS_2 } from "../helper-hardhat-config";
import verify from "../helper-functions";
import { ethers } from "hardhat";

const deployVault: DeployFunction = async function (hre: HardhatRuntimeEnvironment) {
    
    const { getNamedAccounts, deployments, network } = hre;
    const { deploy, log, get } = deployments;
    const { deployer } = await getNamedAccounts()
   
    const governance = await ethers.getContract("GovernorContract", deployer);
    const governanceToken = await ethers.getContract("GovernanceToken", deployer);
    const governanceAddress = await governance.getAddress()
    const tokenAddress = await governanceToken.getAddress();

    const owners = [deployer, HH_ADDRESS_1, HH_ADDRESS_2];

    const args = [tokenAddress, owners, 2 , governanceAddress];

    log("----------------------------------------------------")
    log("Deploying Vault Contract..."); 
    console.log(`deployer: ${deployer}`)
    console.log(`Governor: ${governanceAddress}`)

    console.log(owners);

     const vault = await deploy("Vault", {
        from: deployer,
        args: args,
        log: true,
        waitConfirmations: networkConfig[network.name].blockConfirmations || 1,
    }); 
    
    log(`Deployed vault contract to address ${vault.address}`);
    if (!developmentChains.includes(network.name) && process.env.ETHERSCAN_API_KEY) {
        await verify(vault.address, args)
    } 
}


export default deployVault;
deployVault.tags = ["all", "vault"]