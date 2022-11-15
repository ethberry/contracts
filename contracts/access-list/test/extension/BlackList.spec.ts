import { expect, use } from "chai";
import { solidity } from "ethereum-waffle";
import { ethers } from "hardhat";

import { DEFAULT_ADMIN_ROLE, InterfaceId } from "@gemunion/contracts-constants";
import { shouldBeAccessible, shouldSupportsInterface } from "@gemunion/contracts-mocha";

import { deployAccessList } from "../shared/fixtures";

use(solidity);

describe("BlackListTest", function () {
  const factory = () => deployAccessList(this.title);

  shouldBeAccessible(factory)(DEFAULT_ADMIN_ROLE);

  describe("Black list", function () {
    it("should fail: account is missing role", async function () {
      const [_owner, receiver] = await ethers.getSigners();
      const contractInstance = await factory();

      const tx = contractInstance.connect(receiver).blacklist(receiver.address);
      await expect(tx).to.be.revertedWith(
        `AccessControl: account ${receiver.address.toLowerCase()} is missing role ${DEFAULT_ADMIN_ROLE}`,
      );
    });

    it("should check black list", async function () {
      const [_owner, receiver] = await ethers.getSigners();
      const contractInstance = await factory();

      const isBlackListed = await contractInstance.isBlacklisted(receiver.address);
      expect(isBlackListed).to.equal(false);
    });

    it("should add to black list", async function () {
      const [_owner, receiver] = await ethers.getSigners();
      const contractInstance = await factory();

      const tx = contractInstance.blacklist(receiver.address);
      await expect(tx).to.emit(contractInstance, "Blacklisted").withArgs(receiver.address);
      const isBlackListed = await contractInstance.isBlacklisted(receiver.address);
      expect(isBlackListed).to.equal(true);
    });

    it("should delete from black list", async function () {
      const [_owner, receiver] = await ethers.getSigners();
      const contractInstance = await factory();

      await contractInstance.blacklist(receiver.address);
      const tx = contractInstance.unBlacklist(receiver.address);
      await expect(tx).to.emit(contractInstance, "UnBlacklisted").withArgs(receiver.address);
      const isBlackListed = await contractInstance.isBlacklisted(receiver.address);
      expect(isBlackListed).to.equal(false);
    });

    it("should fail: blacklisted", async function () {
      const [_owner, receiver] = await ethers.getSigners();
      const contractInstance = await factory();

      await contractInstance.blacklist(receiver.address);
      const tx = contractInstance.connect(receiver).testMe();
      await expect(tx).to.be.revertedWith(`BlackListError`).withArgs(receiver.address);
    });

    it("should pass", async function () {
      const [_owner, receiver] = await ethers.getSigners();
      const contractInstance = await factory();

      const result = await contractInstance.connect(receiver).testMe();
      expect(result).to.equal(true);
    });
  });

  shouldSupportsInterface(factory)(InterfaceId.IERC165, InterfaceId.IAccessControl);
});
