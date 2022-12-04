// Collect against locally created merkle tree (only the first 4 commitments)
const hre = require("hardhat");
import { readFileSync } from "fs";
import { getMerkleTreeFromPublicListOfCommitments } from "../utils/TestUtils";
import { generateProofCallData, pedersenHash, toHex } from "zkp-merkle-airdrop-lib";

/** Collect an airdrop from the local merkle tree against deployed contract. */
async function main() {
    
    
    let singers = await hre.ethers.getSigners();
    let collector = singers[1]

    // TO MODIFTY0xB2e2255DA418dFF0b4C15Ba301Ba6E580x051A4F3995A6165fE3C455E84041f0D7786F0f4aBCb0975f
    let proof = "0x2314d19a9572f66c15df30631bc9a578cd65032cbfcb4e56574a7ccd032310c20455a417dc7d5d3647c1a2666b2d3ffd8155d8b481725d274a53fe69d462ed13043ff38779747aa6005683f0448c9155486366097f2e7dd39d17c79601d63498270663cbab27ebb6405885b1f1fabffab4dc98f598b86b3d7faabd0264db6011167723ec3bd6650b2b1c6519b5eb2df30f3ba6adabad01ce510178d9247e25871ba105ef9847100b7d68cc8217b628a518c385decb2ae60e1886d2c4e3b9fdf8239a52db9c0539b95c026b804a45c50c0a177238d98fc4bd6e6be14d470211bf1e33024df9b3d51f41f0c09b41526514de419d55d82e79231c0248a1bfd71c70095594b3b7f31d47b9ab16cc88780d41937135ea9e38bef2332c86fc8d88e4570ddbdcb9f56f82427abf08e9efe3531604cd8dce182553b967af91f35a33c7b51b62ae4f4f4da0fe1bed25cb0898ddfa7e99cf3d8f7d6b44c4a08aea29aa75df0719fe17d9131ff632ed19468a8c2ac5e51f6950b32c4cb1c096985ede48dc2e282a3eae599e4951a284d815f3d3e2d8a9950a2c89a44eaa262b64faba5f3a740c201e850d52e69276782e2651b07095edc681372d4a3a7336b01acd5c1875310cfb34332afe28e45598f873557d889665bc4d5e19107d3cd49391a1b30c827b0bd91dbad8f5b0151fbc5b78090363affcbc4580f120430bb9150d2f17553f861c958d68422fe677355f04e611b947b1cea0249bc5b011e60c3f818aa28bd08800d40f72d188c1fa37f876163ff71fc1820c7a19c68d6d25bcccd3cd6b1357551a6d7e99a35a1523a5df347723c06e998f4c185f82d35a64e2e933491597564f19c2f16073f4298bfad012b1d634e2b879cd0ab6e4d7a6404296bdabbe0a91fb2552d05d75e1cc16d24faf565e34ea5a15cf317103e5e439b9cc9de0a8c9ef441b602d795ac22f77cb7f8749a84489f2cf5dbebcdad6a896a2a6a047c94999d4111c7801bc71e767823b34b193e7921ee317633268a7f0e95b7dd28b9c54088918482ebfb9e2a44c91ccbf99a4599de764d1c0a74cd4379d1dfcd5d6500c701b25ee34ef4fcfed07c7ae98f6ad89a7026fa69650be4833e406d12839d372a2cb"
    let nullifierHash = "0x0e35c8af6447d3c8569673ddd3269336e11e71827afffe17b43c82c0f7d1dbf2"

    let POLLIT_ADDR = "0xF9E95e9212f55e5D90158bA198458c072bdb1e70";
    let Nft_ADDR = "0x051A4F3995A6165fE3C455E84041f0D7786F0f4a";

    let pId = 1;

    let pollitContract = await hre.ethers.getContractAt("pollIt", POLLIT_ADDR)

    let tx2 = await pollitContract.getProposalsForNftContract(Nft_ADDR);
    console.log(tx2);

    let tx1 = await pollitContract.connect("0x65F34F0B4D2b8e1568dD85D360C7614077458f4E").castVote(proof, nullifierHash, pId, true);
    await tx1.wait();
    console.log("success in casting vote");

    let tx3 = await pollitContract.getProposalsForNftContract(Nft_ADDR);
    console.log(tx3);

}

main().then(() => process.exit(0))
    .catch(e => {
        console.error(e);
        process.exit(-1);
    })