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
        const initialOwnerBalance = await governorToken.balanceOf(await owner.getAddress());
        const initialAccount1Balance = await governorToken.balanceOf(await account1.getAddress());
        const initialAccount2Balance = await governorToken.balanceOf(await account2.getAddress());
        
        const ownerBalance = await governorToken.balanceOf(await owner.getAddress());
        const transferAmount = 333333;
      
        // Transfer tokens from owner to account1
        await governorToken.connect(owner).transfer(await account1.getAddress(), transferAmount);
        await governorToken.connect(owner).transsfer(await account2.getAddress(), transferAmount);
      
        const finalOwnerBalance = await governorToken.balanceOf(await owner.getAddress());
        const finalAccount1Balance = await governorToken.balanceOf(await account1.getAddress());
        const finalAccount2Balance = await governorToken.balanceOf(await account2.getAddress());
      
        expect(finalOwnerBalance).to.equal(initialOwnerBalance.sub(transferAmount) * 2);
        expect(finalAccount1Balance).to.equal(transferAmount);
        expect(finalAccount2Balance).to.equal(transferAmount);
        
    })
})