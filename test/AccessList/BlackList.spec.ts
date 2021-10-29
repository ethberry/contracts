import { expect } from "chai";
import { ethers } from "hardhat";
import { ContractFactory } from "ethers";
import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";

import { BlackListTest } from "../../typechain-types";
import { DEFAULT_ADMIN_ROLE } from "../constants";

describe("BlackList", function () {
  let contract: ContractFactory;
  let contractInstance: BlackListTest;
  let owner: SignerWithAddress;
  let receiver: SignerWithAddress;

  beforeEach(async function () {
    contract = await ethers.getContractFactory("BlackListTest");
    [owner, receiver] = await ethers.getSigners();

    contractInstance = (await contract.deploy()) as BlackListTest;
  });

  describe("Deployment", function () {
    it("should set the right roles to deployer", async function () {
      const isAdmin = await contractInstance.hasRole(DEFAULT_ADMIN_ROLE, owner.address);
      expect(isAdmin).to.equal(true);
    });
  });

  describe("Black list", function () {
    it("should fail: no admin role", async function () {
      const tx = contractInstance.connect(receiver).blacklist(receiver.address);
      await expect(tx).to.be.revertedWith(
        `AccessControl: account ${receiver.address.toLowerCase()} is missing role ${DEFAULT_ADMIN_ROLE}`,
      );
    });

    it("should check black list", async function () {
      const isBlackListed = await contractInstance.isBlacklisted(receiver.address);
      expect(isBlackListed).to.equal(false);
    });

    it("should add to black list", async function () {
      const tx = contractInstance.blacklist(receiver.address);
      await expect(tx).to.emit(contractInstance, "Blacklisted").withArgs(receiver.address);
      const isBlackListed = await contractInstance.isBlacklisted(receiver.address);
      expect(isBlackListed).to.equal(true);
    });

    it("should delete from black list", async function () {
      await contractInstance.blacklist(receiver.address);
      const tx = contractInstance.unBlacklist(receiver.address);
      await expect(tx).to.emit(contractInstance, "UnBlacklisted").withArgs(receiver.address);
      const isBlackListed = await contractInstance.isBlacklisted(receiver.address);
      expect(isBlackListed).to.equal(false);
    });

    it("should fail: blacklisted", async function () {
      await contractInstance.blacklist(receiver.address);
      const tx = contractInstance.connect(receiver).testMe();
      await expect(tx).to.be.revertedWith(`BlackListError("${receiver.address}")`);
    });

    it("should pass", async function () {
      const result = await contractInstance.connect(receiver).testMe();
      expect(result).to.equal(true);
    });
  });
});
