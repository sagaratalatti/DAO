import { ethers, getNamedAccounts } from "hardhat";
import { expect } from "chai";
import { MINIMUM_DELAY } from "../helper-hardhat-config";
import { Signer } from "ethers";

describe("Governance Token", async () => {

    let owner: Signer;
    let account1: Signer;
    let timeLock: any;

    before("Deploys contract", async() => {
        [owner, account1] = await ethers.getSigners();
        const TimeLock = await ethers.getContractFactory("TimeLock");
        timeLock = await TimeLock.deploy(MINIMUM_DELAY, [], [], await owner.getAddress());
    });

    describe ("TimeLock", () => {
        
        it ("Should have the correct minDelay value", async () => {
            const minDelay = await timeLock.minDelay();
            expect(minDelay).to.equal(MINIMUM_DELAY);
        });

        it ("Should have the correct admin address", async () => {
            const admin = await timeLock.admin();
            const ownerAddress = await owner.getAddress();
            expect(admin).to.equal(ownerAddress);
        });
    })
})