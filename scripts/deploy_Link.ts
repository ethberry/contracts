import "@nomiclabs/hardhat-ethers";
import { ethers, upgrades, network } from "hardhat";
import { Link } from "../typechain";
import { addr } from "../test/constants";

async function main() {
  // We get the contract to deploy
  const link = await ethers.getContractFactory("Link");
  const networkName = network.name;

  const chainLinkVRFCoordinator = addr[networkName].chainLinkVRFCoordinator;
  const chainLinkToken = addr[networkName].chainLinkToken;
  const chainLinkKeyHash = addr[networkName].chainLinkKeyHash;
  const chainLinkFee = ethers.BigNumber.from((addr[networkName].chainLinkFee * 1e18).toString());
  // console.log("chainLinkFee", chainLinkFee);

  const linkInstance = (await upgrades.deployProxy(link, [
    chainLinkVRFCoordinator,
    chainLinkToken,
    chainLinkKeyHash,
    chainLinkFee,
    // ethers.BigNumber.from(chainLinkFee),
  ])) as Link;

  console.info("Link deployed to:", linkInstance.address);
}

main()
  .then(() => process.exit(0))
  .catch(error => {
    console.error(error);
    process.exit(1);
  });
