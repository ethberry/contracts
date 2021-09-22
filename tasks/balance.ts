import { task } from "hardhat/config";
import "@nomiclabs/hardhat-web3";

task("balance", "Prints an account's balance")
  .addParam("account", "The account's address")
  .setAction(async (args, hre) => {
    const account = hre.web3.utils.toChecksumAddress(args.account);
    const balance = await hre.web3.eth.getBalance(account);

    // eslint-disable-next-line no-console
    console.log(hre.web3.utils.fromWei(balance, "ether"), "ETH");
  });
