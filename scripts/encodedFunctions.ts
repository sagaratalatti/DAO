import { ethers, network } from "hardhat"
import {
  STORE_FUNCTION,
  NEW_STORE_VALUE,
  APPROVE_TRANSACTION_ID,
  APPROVE_TRANSACTION_FUNCTION,
  SUBMIT_TRANSACTION_FUNCTION,
  SAGAR_ADDRESS,
  GAURAV_ADDRESS,
  SUBMIT_TRANSACTION_ID,
  WITHDRAW_AMOUNT,
  TRANSFER_TOKENS_FUNCTION,
  TRANSFER_FUNCTION_BYTECODE,
} from "../helper-hardhat-config"


export async function propose() {
  const box = await ethers.getContract("Box")
  const vault = await ethers.getContract("Vault")

  // Box encodedFunctionCall
  const encodedBoxFunctionCall = box.interface.encodeFunctionData(STORE_FUNCTION, [NEW_STORE_VALUE])
  console.log(`Box EncodedFunctionCall: \n ${encodedBoxFunctionCall}`)

  // const _amount = ethers.parseEther("10000");
  // const encodedFunctionTransfer = vault.interface.encodeFunctionData(TRANSFER_TOKENS_FUNCTION, [GAURAV_ADDRESS, _amount]);
  const encodedSubmitFunctionCall = vault.interface.encodeFunctionData(SUBMIT_TRANSACTION_FUNCTION, [SAGAR_ADDRESS, GAURAV_ADDRESS, SUBMIT_TRANSACTION_ID, WITHDRAW_AMOUNT,TRANSFER_FUNCTION_BYTECODE]);
  //console.log(`Vault transferEncodedFunctionCall = ${encodedFunctionTransfer}`);
  console.log(`Vault encodedSubitTransactionFunctionCall = ${encodedSubmitFunctionCall}`);

  const encodedApproveFunctionCall = vault.interface.encodeFunctionData(APPROVE_TRANSACTION_FUNCTION, [APPROVE_TRANSACTION_ID])
  console.log(`Vault EncodedApproveFunctionCall = ${encodedApproveFunctionCall}`)

}

propose()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error)
    process.exit(1)
  })