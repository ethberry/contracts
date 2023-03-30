import { expect } from "chai";
import { ethers } from "hardhat";
import { Contract } from "ethers";

export function shouldBehaveLikeBlackListMe(factory: () => Promise<Contract>) {
  describe("Black list me", function () {
    it("should fail: blacklisted", async function () {
      const [_owner, receiver] = await ethers.getSigners();
      const contractInstance = await factory();

      await contractInstance.blacklist(receiver.address);
      const tx = contractInstance.connect(receiver).testMe();
      await expect(tx).to.be.revertedWithCustomError(contractInstance, `BlackListError`).withArgs(receiver.address);
    });

    it("should pass", async function () {
      const [_owner, receiver] = await ethers.getSigners();
      const contractInstance = await factory();

      const result = await contractInstance.connect(receiver).testMe();
      expect(result).to.equal(true);
    });
  });
}
