import { ethers } from "hardhat";
import { expect } from "chai";
import { BigNumberish, Contract, Signer } from "ethers";

describe("Governance Token", function() {

    let governorToken: any;
    let owner: Signer;
    let account1: Signer;
    let account2: Signer;

    before("Deploys contract", async() => {
        [owner, account1, account2] = await ethers.getSigners();
        const GovernanceToken = await ethers.getContractFactory("GovernanceToken");
        governorToken = await GovernanceToken.deploy();
    });

    it("Deployment should assign the total supply of token to the owner", async () => {

        const ownerBalance = await governorToken.balanceOf(await owner.getAddress());
        expect(await governorToken.totalSupply()).to.equal(ownerBalance);
    });

    it("Owner transfers tokens to 2 accounts", async() => {
        const transferAmount = ethers.parseEther("333333");
      
        // Transfer tokens from owner to account1]
        await governorToken.connect(await owner.getAddress()).transfer(account1, transferAmount);
        //await governorToken.transferFrom(await owner.getAddress(), account1, transferAmount);
        //await governorToken.transferFrom(await owner.getAddress(), account2, transferAmount);
      
        const finalAccount1Balance = await governorToken.balanceOf(await account1.getAddress());
        const finalAccount2Balance = await governorToken.balanceOf(await account2.getAddress());
      
        //expect(finalOwnerBalance).to.equal(initialOwnerBalance.sub(transferAmount) * 2);
        expect(finalAccount1Balance).to.equal(transferAmount);
        expect(finalAccount2Balance).to.equal(transferAmount);
        
    })
})