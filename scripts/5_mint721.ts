// Mint a setofNFT to the privateAidrop contract
const hre = require("hardhat");
require('dotenv').config();
import { Web3Storage, getFilesFromPath } from 'web3.storage'
 


async function main() {
    
    let Nft_ADDR = "0x051A4F3995A6165fE3C455E84041f0D7786F0f4a";
    let IPFS_token = process.env.IPFS_TOKEN;
    let string  = IPFS_token;

    const token = process.env.API_TOKEN
const client = new Web3Storage({token:""});
let cid1 ="";
async function storeFiles () {
  const files = await getFilesFromPath('./public/cat.jpg')
  const cid = await client.put(files)
  console.log(cid)
  cid1 = cid;
}

await storeFiles();

    let NFT = await hre.ethers.getContractAt("NFT", Nft_ADDR)
    let tx1 = await NFT.createToken(cid1);
    tx1.wait();
    console.log(` NFTs succefully minted and trasferred` )
}

main().then(() => process.exit(0))
    .catch(e => {
        console.error(e);
        process.exit(-1);
    })