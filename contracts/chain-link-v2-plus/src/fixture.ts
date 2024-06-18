import { ethers } from "hardhat";
import { EventLog, hexlify, WeiPerEther, zeroPadValue } from "ethers";
import { expect } from "chai";

export async function deployLinkVrfFixtureV2() {
  // Deploy Chainlink & Vrf contracts
  const link = await ethers.getContractFactory("LinkToken");
  const linkInstance = await link.deploy();
  await linkInstance.deployed();
  // console.info(`LINK_ADDR=${linkInstance.address}`);
  const vrfFactory = await ethers.getContractFactory("VRFCoordinatorV2Mock");
  const vrfInstance = await vrfFactory.deploy(linkInstance);
  await vrfInstance.deployed();
  // GET CHAIN_LINK V2 TO WORK
  await vrfInstance.setConfig(3, 1000000, 1, 1, 1);
  await vrfInstance.createSubscription();
  const vrfEventFilter = vrfInstance.filters.SubscriptionCreated();
  const vrfEvents = (await vrfInstance.queryFilter(vrfEventFilter)) as unknown as Array<EventLog>;
  if (vrfEvents && vrfEvents.length && vrfEvents[0].args) {
    const subsriptionId = vrfEvents[0].args.subId;
    expect(subsriptionId).to.equal(1);

    const tx01 = linkInstance.transferAndCall(
      vrfInstance,
      WeiPerEther * 18n,
      zeroPadValue(hexlify(subsriptionId.toString()), 32),
    );
    await expect(tx01)
      .to.emit(vrfInstance, "SubscriptionFunded")
      .withArgs(subsriptionId, 0, WeiPerEther * 18n);
  }
  // console.info(`VRF_ADDR=${vrfInstance.address}`);
  return { linkInstance, vrfInstance };
}

export async function deployERC721(name: string): Promise<any> {
  const erc721Factory = await ethers.getContractFactory(name);
  return erc721Factory.deploy();
}
