import { task } from "hardhat/config";
import "@nomiclabs/hardhat-web3";

task("balance-erc20", "Prints an ERC20's balance + ETH")
  .addParam("account", "The account's address")
  .addParam("contract", "The ERC20 contract's address")
  .setAction(async (args, hre) => {
    const { account, contract } = args.account;

    const balance = await hre.web3.eth.getBalance(account);
    console.info("ETH Balance:", hre.web3.utils.fromWei(balance, "ether"), "ETH");

    const coinFactory = await hre.ethers.getContractFactory("TokenErc20");
    const coinInstance = coinFactory.attach(contract);
    const accBalance = await coinInstance.balanceOf(account);
    const accBalanceString = accBalance.toString();

    console.info("ERC20 Balance in wei:", accBalanceString);
    console.info("ERC20 Balance in ether:", hre.ethers.utils.formatEther(accBalanceString));
  });
