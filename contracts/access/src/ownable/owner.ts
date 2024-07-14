import { expect } from "chai";
import { ethers } from "hardhat";

export function shouldHaveOwner(factory: () => Promise<any>) {
  describe("owner", function () {
    it("Should set the right roles to deployer", async function () {
      const [owner] = await ethers.getSigners();
      const contractInstance = await factory();

      const account = await contractInstance.owner();
      expect(account).to.equal(owner);
    });
  });
}
