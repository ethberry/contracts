import { expect } from "chai";
import { ethers } from "hardhat";
import { Contract } from "ethers";

import { DEFAULT_ADMIN_ROLE } from "@gemunion/contracts-constants";

export function shouldBehaveLikeWhiteList(factory: () => Promise<Contract>) {
  describe("White list", function () {
    it("should fail: account is missing role", async function () {
      const [_owner, receiver] = await ethers.getSigners();
      const contractInstance = await factory();

      const tx = contractInstance.connect(receiver).whitelist(receiver.address);
      await expect(tx).to.be.revertedWith(
        `AccessControl: account ${receiver.address.toLowerCase()} is missing role ${DEFAULT_ADMIN_ROLE}`,
      );
    });

    it("should check white list", async function () {
      const [_owner, receiver] = await ethers.getSigners();
      const contractInstance = await factory();

      const isWhitelisted = await contractInstance.isWhitelisted(receiver.address);
      expect(isWhitelisted).to.equal(false);
    });

    it("should add to white list", async function () {
      const [_owner, receiver] = await ethers.getSigners();
      const contractInstance = await factory();

      const tx = contractInstance.whitelist(receiver.address);
      await expect(tx).to.emit(contractInstance, "Whitelisted").withArgs(receiver.address);
      const isWhitelisted = await contractInstance.isWhitelisted(receiver.address);
      expect(isWhitelisted).to.equal(true);
    });

    it("should delete from black list", async function () {
      const [_owner, receiver] = await ethers.getSigners();
      const contractInstance = await factory();

      await contractInstance.whitelist(receiver.address);
      const tx = contractInstance.unWhitelist(receiver.address);
      await expect(tx).to.emit(contractInstance, "UnWhitelisted").withArgs(receiver.address);
      const isWhiteListed = await contractInstance.isWhitelisted(receiver.address);
      expect(isWhiteListed).to.equal(false);
    });
  });
}
