import { expect } from "chai";
import { ethers } from "hardhat";

import { DEFAULT_ADMIN_ROLE } from "@gemunion/contracts-constants";

import type { IAccessControlOptions } from "../shared/interfaces";

export function shouldBehaveLikeWhiteList(factory: () => Promise<any>, options: IAccessControlOptions = {}) {
  const { adminRole = DEFAULT_ADMIN_ROLE } = options;

  describe("White list", function () {
    it("should check white list", async function () {
      const [_owner, _receiver, stranger] = await ethers.getSigners();
      const contractInstance = await factory();

      // stranger is used to test erc20/erc721 tokens
      const isWhitelisted = await contractInstance.isWhitelisted(stranger);
      expect(isWhitelisted).to.equal(false);
    });

    it("should add to white list", async function () {
      const [_owner, receiver] = await ethers.getSigners();
      const contractInstance = await factory();

      const tx = contractInstance.whitelist(receiver);
      await expect(tx).to.emit(contractInstance, "Whitelisted").withArgs(receiver);
      const isWhitelisted = await contractInstance.isWhitelisted(receiver);
      expect(isWhitelisted).to.equal(true);
    });

    it("should delete from white list", async function () {
      const [_owner, receiver] = await ethers.getSigners();
      const contractInstance = await factory();

      await contractInstance.whitelist(receiver);
      const tx = contractInstance.unWhitelist(receiver);
      await expect(tx).to.emit(contractInstance, "UnWhitelisted").withArgs(receiver);
      const isWhiteListed = await contractInstance.isWhitelisted(receiver);
      expect(isWhiteListed).to.equal(false);
    });

    it("should fail: AccessControlUnauthorizedAccount", async function () {
      const [_owner, receiver] = await ethers.getSigners();
      const contractInstance = await factory();

      const tx = contractInstance.connect(receiver).whitelist(receiver);

      await expect(tx)
        .to.be.revertedWithCustomError(contractInstance, "AccessControlUnauthorizedAccount")
        .withArgs(receiver, adminRole);
    });
  });
}
