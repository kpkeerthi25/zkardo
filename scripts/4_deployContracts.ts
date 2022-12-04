const hre = require("hardhat");
import { BigNumber } from "@ethersproject/bignumber";
import {getMerkleTreeFromPublicListOfCommitments, getMerkleRoot} from "../utils/TestUtils";
import { PollIt } from "../typechain-types";
import { NFT } from "../typechain-types/contracts/PNft.sol";

/**
 * Deploys a test set of contracts: ERC721, Verifier, PrivateAirdrop
 */
async function main() {

    let NUM_ERC721_PER_REDEMPTION = 100;
    let inputFileName = "./public/publicCommitments.txt"
    let treeHeight = 5

    let mt = getMerkleTreeFromPublicListOfCommitments(inputFileName, treeHeight)
    let merkleTreeRoot = getMerkleRoot(mt)

    // DEPLOY PLONK VERIFIER
    let plonkFactory = await hre.ethers.getContractFactory("PlonkVerifier")
    let plonk = await plonkFactory.deploy()
    console.log(`Plonk Verifier contract address: ${plonk.address}`)

    let pollitFactory = await hre.ethers.getContractFactory("pollIt")
    let pollitC: PollIt = (
        await pollitFactory.deploy(
            plonk.address 
        ) as PollIt
    )
    console.log(`Pollit contract address: ${pollitC.address}`)

    let nftFactory = await hre.ethers.getContractFactory("NFT")
    let NFTc: NFT = (
        await nftFactory.deploy() as NFT
    )

    console.log(`NFt contract address: ${NFTc.address}`)
}

main()
    .then(() => process.exit(0))
    .catch(e => {
        console.error(e);
        process.exit(1);
    })