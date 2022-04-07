import { task } from "hardhat/config";
import "@nomiclabs/hardhat-web3";

task("decode", "Decode error message")
  .addParam("data", "encoded data")
  .setAction(async (args, hre) => {
    await Promise.resolve();

    function decodeMessage(code: string): string {
      let codeString = `0x${code.substr(138)}`.replace(/0+$/, "");

      // If the codeString is an odd number of characters, add a trailing 0
      if (codeString.length % 2 === 1) {
        codeString += "0";
      }

      return hre.ethers.utils.toUtf8String(codeString);
    }

    console.info(decodeMessage(args.data));
  });
