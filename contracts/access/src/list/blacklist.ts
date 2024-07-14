import { expect } from "chai";
import { ethers } from "hardhat";

import { DEFAULT_ADMIN_ROLE } from "@gemunion/contracts-constants";

import type { IAccessControlOptions } from "../shared/interfaces";

export function shouldBehaveLikeBlackList(factory: () => Promise<any>, options: IAccessControlOptions = {}) {
  describe("Black list", function () {
    const { adminRole = DEFAULT_ADMIN_ROLE } = options;

    it("should check black list", async function () {
      const [_owner, receiver] = await ethers.getSigners();
      const contractInstance = await factory();

      const isBlackListed = await contractInstance.isBlacklisted(receiver);
      expect(isBlackListed).to.equal(false);
    });

    it("should add to black list", async function () {
      const [_owner, receiver] = await ethers.getSigners();
      const contractInstance = await factory();

      const tx = contractInstance.blacklist(receiver);
      await expect(tx).to.emit(contractInstance, "Blacklisted").withArgs(receiver);
      const isBlackListed = await contractInstance.isBlacklisted(receiver);
      expect(isBlackListed).to.equal(true);
    });

    it("should delete from black list", async function () {
      const [_owner, receiver] = await ethers.getSigners();
      const contractInstance = await factory();

      await contractInstance.blacklist(receiver);
      const tx = contractInstance.unBlacklist(receiver);
      await expect(tx).to.emit(contractInstance, "UnBlacklisted").withArgs(receiver);
      const isBlackListed = await contractInstance.isBlacklisted(receiver);
      expect(isBlackListed).to.equal(false);
    });

    it("should fail: AccessControlUnauthorizedAccount", async function () {
      const [_owner, receiver] = await ethers.getSigners();
      const contractInstance = await factory();

      const tx = contractInstance.connect(receiver).blacklist(receiver);
      await expect(tx)
        .to.be.revertedWithCustomError(contractInstance, "AccessControlUnauthorizedAccount")
        .withArgs(receiver, adminRole);
    });
  });
}
