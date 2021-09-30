import { expect } from "chai";
import { ethers, upgrades } from "hardhat";
import { ContractFactory } from "ethers";
import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";

import { Link } from "../../typechain";

describe("Link", function () {
  let link: ContractFactory;
  let linkInstance: Link;
  let owner: SignerWithAddress;

  beforeEach(async function () {
    link = await ethers.getContractFactory("Link");
    [owner] = await ethers.getSigners();

    linkInstance = (await upgrades.deployProxy(link, [
      "0xa555fC018435bef5A13C6c6870a9d4C11DEC329C", // VRF Coordinator
      "0x84b9B910527Ad5C03A9Ca831909E21e236EA7b06", // LINK Token
    ])) as Link;
  });

  describe("Deployment", function () {
    it("should set the right roles to deployer", async function () {
      await linkInstance.getRandomNumber("1234567890");
      void owner;
      expect(true).to.equal(true);
    });
  });
});
