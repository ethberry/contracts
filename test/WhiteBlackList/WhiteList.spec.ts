import { expect } from "chai";
import { ethers, upgrades } from "hardhat";
import { ContractFactory } from "ethers";
import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";

import { WhiteListTest } from "../../typechain";
import { DEFAULT_ADMIN_ROLE } from "../constants";

describe("WhiteList", function () {
  let contract: ContractFactory;
  let contractInstance: WhiteListTest;
  let owner: SignerWithAddress;
  let receiver: SignerWithAddress;

  beforeEach(async function () {
    contract = await ethers.getContractFactory("WhiteListTest");
    [owner, receiver] = await ethers.getSigners();

    contractInstance = (await upgrades.deployProxy(contract)) as WhiteListTest;
  });

  describe("Deployment", function () {
    it("should set the right roles to deployer", async function () {
      const isAdmin = await contractInstance.hasRole(DEFAULT_ADMIN_ROLE, owner.address);
      expect(isAdmin).to.equal(true);
    });
  });

  describe("White list", function () {
    it("should fail: no admin role", async function () {
      const tx = contractInstance.connect(receiver).whitelist(receiver.address);
      await expect(tx).to.be.revertedWith(
        `AccessControl: account ${receiver.address.toLowerCase()} is missing role ${DEFAULT_ADMIN_ROLE}`,
      );
    });

    it("should check white list", async function () {
      const isBlackListed = await contractInstance.isWhitelisted(receiver.address);
      expect(isBlackListed).to.equal(false);
    });

    it("should add to white list", async function () {
      const tx = contractInstance.whitelist(receiver.address);
      await expect(tx).to.emit(contractInstance, "Whitelisted").withArgs(receiver.address);
      const isBlackListed = await contractInstance.isWhitelisted(receiver.address);
      expect(isBlackListed).to.equal(true);
    });

    it("should delete from black list", async function () {
      await contractInstance.whitelist(receiver.address);
      const tx = contractInstance.unWhitelist(receiver.address);
      await expect(tx).to.emit(contractInstance, "UnWhitelisted").withArgs(receiver.address);
      const isWhiteListed = await contractInstance.isWhitelisted(receiver.address);
      expect(isWhiteListed).to.equal(false);
    });

    it("should fail: test method", async function () {
      const tx = contractInstance.connect(receiver).testMe();
      await expect(tx).to.be.revertedWith(
        `WhiteListUpgradeable: account ${receiver.address.toLowerCase()} is not whitelisted`,
      );
    });
  });
});
