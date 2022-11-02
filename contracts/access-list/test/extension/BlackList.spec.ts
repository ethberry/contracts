import { expect, use } from "chai";
import { solidity } from "ethereum-waffle";
import { ethers } from "hardhat";

import { DEFAULT_ADMIN_ROLE, InterfaceId } from "../constants";
import { shouldSupportsInterface } from "../shared/supportInterface";
import { shouldBeAccessible } from "../shared/accessible";
import { deployAccessList } from "../shared/fixtures";

use(solidity);

describe("BlackList", function () {
  const name = "BlackListTest";

  shouldBeAccessible(name)(DEFAULT_ADMIN_ROLE);

  describe("Black list", function () {
    it("should fail: account is missing role", async function () {
      const [_owner, receiver] = await ethers.getSigners();
      const { contractInstance } = await deployAccessList(name);

      const tx = contractInstance.connect(receiver).blacklist(receiver.address);
      await expect(tx).to.be.revertedWith(
        `AccessControl: account ${receiver.address.toLowerCase()} is missing role ${DEFAULT_ADMIN_ROLE}`,
      );
    });

    it("should check black list", async function () {
      const [_owner, receiver] = await ethers.getSigners();
      const { contractInstance } = await deployAccessList(name);

      const isBlackListed = await contractInstance.isBlacklisted(receiver.address);
      expect(isBlackListed).to.equal(false);
    });

    it("should add to black list", async function () {
      const [_owner, receiver] = await ethers.getSigners();
      const { contractInstance } = await deployAccessList(name);

      const tx = contractInstance.blacklist(receiver.address);
      await expect(tx).to.emit(contractInstance, "Blacklisted").withArgs(receiver.address);
      const isBlackListed = await contractInstance.isBlacklisted(receiver.address);
      expect(isBlackListed).to.equal(true);
    });

    it("should delete from black list", async function () {
      const [_owner, receiver] = await ethers.getSigners();
      const { contractInstance } = await deployAccessList(name);

      await contractInstance.blacklist(receiver.address);
      const tx = contractInstance.unBlacklist(receiver.address);
      await expect(tx).to.emit(contractInstance, "UnBlacklisted").withArgs(receiver.address);
      const isBlackListed = await contractInstance.isBlacklisted(receiver.address);
      expect(isBlackListed).to.equal(false);
    });

    it("should fail: blacklisted", async function () {
      const [_owner, receiver] = await ethers.getSigners();
      const { contractInstance } = await deployAccessList(name);

      await contractInstance.blacklist(receiver.address);
      const tx = contractInstance.connect(receiver).testMe();
      await expect(tx).to.be.revertedWith(`BlackListError`).withArgs(receiver.address);
    });

    it("should pass", async function () {
      const [_owner, receiver] = await ethers.getSigners();
      const { contractInstance } = await deployAccessList(name);

      const result = await contractInstance.connect(receiver).testMe();
      expect(result).to.equal(true);
    });
  });

  shouldSupportsInterface(name)(InterfaceId.IERC165, InterfaceId.IAccessControl);
});
