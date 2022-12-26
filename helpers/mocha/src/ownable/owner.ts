import { expect } from "chai";
import { ethers } from "hardhat";
import { Contract } from "ethers";

export function shouldHaveOwner(factory: () => Promise<Contract>) {
  describe("owner", function () {
    it("Should set the right roles to deployer", async function () {
      const [owner] = await ethers.getSigners();
      const contractInstance = await factory();

      const account = await contractInstance.owner();
      expect(account).to.equal(owner.address);
    });
  });
}
