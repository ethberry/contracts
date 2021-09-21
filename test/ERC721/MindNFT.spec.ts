import { expect } from "chai";
import { ethers, upgrades } from "hardhat";
import { ContractFactory } from "ethers";
import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";

import { MindNFT } from "../../typechain";
import { DEFAULT_ADMIN_ROLE, MINTER_ROLE, PAUSER_ROLE } from "../constants";

describe("ERC721 basic", function () {
  let token: ContractFactory;
  let nftInstance: MindNFT;
  let owner: SignerWithAddress;

  beforeEach(async function () {
    token = await ethers.getContractFactory("MindNFT");
    [owner] = await ethers.getSigners();

    nftInstance = (await upgrades.deployProxy(token, ["memoryOS NFT token", "MIND"])) as MindNFT;
  });

  describe("Deployment", function () {
    it("Should set the right roles to deployer", async function () {
      expect(await nftInstance.hasRole(DEFAULT_ADMIN_ROLE, owner.address)).to.equal(true);
      expect(await nftInstance.hasRole(MINTER_ROLE, owner.address)).to.equal(true);
      expect(await nftInstance.hasRole(PAUSER_ROLE, owner.address)).to.equal(true);
    });
  });
});
