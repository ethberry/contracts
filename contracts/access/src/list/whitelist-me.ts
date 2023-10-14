import { expect } from "chai";
import { ethers } from "hardhat";

export function shouldBehaveLikeWhiteListMe(factory: () => Promise<any>) {
  describe("White list me", function () {
    it("should fail: tests method", async function () {
      const [_owner, receiver] = await ethers.getSigners();
      const contractInstance = await factory();

      const tx = contractInstance.connect(receiver).testMe();
      await expect(tx).to.be.revertedWithCustomError(contractInstance, "WhiteListError").withArgs(receiver.address);
    });

    it("should pass", async function () {
      const [_owner, receiver] = await ethers.getSigners();
      const contractInstance = await factory();

      await contractInstance.whitelist(receiver);
      const result = await contractInstance.connect(receiver).testMe();
      expect(result).to.equal(true);
    });
  });
}
