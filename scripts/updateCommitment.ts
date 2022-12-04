const hre = require("hardhat");
import {getMerkleRoot, addNewCommitment, randomBigInt, getMerkleTreeFromPublicListOfCommitments} from "../utils/TestUtils";
import {toHex, pedersenHashConcat } from "zkp-merkle-airdrop-lib";

/**
 * when a new commitment comes it, update the public list of commitments and the merkle root stored inside the airdrop contract 
 */

async function main() {

    let inputFileName = "./public/publicCommitments.txt" 
    let treeHeight = 5;

    let nullifierHex = toHex(randomBigInt(31)) 
    let secretHex = toHex(randomBigInt(31))

    let nullifier = BigInt(nullifierHex)
    let secret = BigInt (secretHex)
    let commitment = pedersenHashConcat(nullifier, secret)
    let hexCommitment = toHex(commitment)

    // update the public list of commitments
    addNewCommitment(inputFileName,hexCommitment,treeHeight)
    // generate the merkletree
    let mt = getMerkleTreeFromPublicListOfCommitments(inputFileName, treeHeight)
    let newRoot = getMerkleRoot(mt)
    // console.log("newRoot ::", mt)
    // console.log("mtree :::", mt.getStorageString() )
    console.log(`new commitment generated ${hexCommitment} from nullifier: ${nullifierHex} and secret ${secretHex}`)

    let POLLIT_ADDR = "0xF9E95e9212f55e5D90158bA198458c072bdb1e70";
    let PNFT_ADDR = "0x051A4F3995A6165fE3C455E84041f0D7786F0f4a"

    let pollitContract = await hre.ethers.getContractAt("pollIt", POLLIT_ADDR)
    let pid = 1;
    let tx = await pollitContract.updateRoot(newRoot, pid);
    tx.wait();
    console.log("tree updated :: ", tx);


    console.log(`merkleRoot storage variable succesfully updated to ${newRoot} `)
}

main()
    .then(() => process.exit(0))
    .catch(e => {
        console.error(e);
        process.exit(1);
    })