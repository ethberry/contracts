import { ethers } from "hardhat";
import { expect } from "chai";

export function shouldGetNumCheckpoints(factory: () => Promise<any>) {
  describe("shouldGetNumCheckpoints", function () {
    it("should get number of checkpoints", async function () {
      const [owner] = await ethers.getSigners();
      const contractInstance: any = await factory();

      const mode = await contractInstance.numCheckpoints(owner);
      expect(mode).to.equal(0);
    });
  });
}
