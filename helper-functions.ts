import { run } from "hardhat";

const verify = async (contractAddress: string, args: any[]) => {
    console.log("Verifying contract...")
    try {
        await run("verify:verify", {
            address: contractAddress,
            constructorArguments: args,
        })
    } catch (exception: any) {
        if (exception.message.toLowerCase().includes("already verified")) {
            console.log("Already verified!")
        } else {
            console.log(exception)
        }
    }
}

export default verify