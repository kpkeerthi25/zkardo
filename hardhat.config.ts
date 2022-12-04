import { HardhatUserConfig } from "hardhat/config";
import "@nomicfoundation/hardhat-toolbox";
require('dotenv').config();

const config: HardhatUserConfig = {
  solidity: "0.8.17",
  networks: {
    mumbai: {
      url: `${process.env.ALCHEMY_URL}`,
      accounts: [`0x${process.env.MUMBAI_PRIVATE_KEY1}`, `0x${process.env.MUMBAI_PRIVATE_KEY2}` ]

    }
  },
  etherscan: {
    apiKey: process.env.POLYGONSCAN_API_KEY,
 }
};

export default config;
