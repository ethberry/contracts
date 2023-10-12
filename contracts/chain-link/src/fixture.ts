import { ethers } from "hardhat";

export async function deployLinkVrfFixture() {
  // Deploy Chainlink & Vrf contracts
  const link = await ethers.getContractFactory("LinkToken");
  const linkInstance = await link.deploy();
  await linkInstance.deployed();
  // console.info(`LINK_ADDR=${linkInstance.address}`);
  const vrfFactory = await ethers.getContractFactory("VRFCoordinatorMock");
  const vrfInstance = await vrfFactory.deploy(linkInstance);
  await vrfInstance.deployed();
  // console.info(`VRF_ADDR=${vrfInstance.address}`);
  return { linkInstance, vrfInstance };
}
