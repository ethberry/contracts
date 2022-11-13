import { expect } from "chai";
import { ethers } from "hardhat";

import { DEFAULT_ADMIN_ROLE, InterfaceId } from "@gemunion/contracts-test-constants";

import { shouldSupportsInterface } from "../shared/supportInterface";
import { shouldBeAccessible } from "../shared/accessible";
import { deployAccessList } from "../shared/fixtures";

describe("WhiteList", function () {
  const name = "WhiteListTest";

  shouldBeAccessible(name)(DEFAULT_ADMIN_ROLE);

  describe("White list", function () {
    it("should fail: account is missing role", async function () {
      const [_owner, receiver] = await ethers.getSigners();
      const { contractInstance } = await deployAccessList(name);

      const tx = contractInstance.connect(receiver).whitelist(receiver.address);
      await expect(tx).to.be.revertedWith(
        `AccessControl: account ${receiver.address.toLowerCase()} is missing role ${DEFAULT_ADMIN_ROLE}`,
      );
    });

    it("should check white list", async function () {
      const [_owner, receiver] = await ethers.getSigners();
      const { contractInstance } = await deployAccessList(name);

      const isWhitelisted = await contractInstance.isWhitelisted(receiver.address);
      expect(isWhitelisted).to.equal(false);
    });

    it("should add to white list", async function () {
      const [_owner, receiver] = await ethers.getSigners();
      const { contractInstance } = await deployAccessList(name);

      const tx = contractInstance.whitelist(receiver.address);
      await expect(tx).to.emit(contractInstance, "Whitelisted").withArgs(receiver.address);
      const isWhitelisted = await contractInstance.isWhitelisted(receiver.address);
      expect(isWhitelisted).to.equal(true);
    });

    it("should delete from black list", async function () {
      const [_owner, receiver] = await ethers.getSigners();
      const { contractInstance } = await deployAccessList(name);

      await contractInstance.whitelist(receiver.address);
      const tx = contractInstance.unWhitelist(receiver.address);
      await expect(tx).to.emit(contractInstance, "UnWhitelisted").withArgs(receiver.address);
      const isWhiteListed = await contractInstance.isWhitelisted(receiver.address);
      expect(isWhiteListed).to.equal(false);
    });

    it("should fail: tests method", async function () {
      const [_owner, receiver] = await ethers.getSigners();
      const { contractInstance } = await deployAccessList(name);

      const tx = contractInstance.connect(receiver).testMe();
      await expect(tx).to.be.revertedWith(`WhiteListError`).withArgs(receiver.address);
    });

    it("should pass", async function () {
      const [_owner, receiver] = await ethers.getSigners();
      const { contractInstance } = await deployAccessList(name);

      await contractInstance.whitelist(receiver.address);
      const result = await contractInstance.connect(receiver).testMe();
      expect(result).to.equal(true);
    });
  });

  shouldSupportsInterface(name)(InterfaceId.IERC165, InterfaceId.IAccessControl);
});
