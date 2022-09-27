import { expect } from "chai";
import { deployErc20Base } from "../fixtures";
import { ethers } from "hardhat";

export function shouldHaveOwner(name: string) {
  describe("owner", function () {
    it("Should set the right roles to deployer", async function () {
      const [owner] = await ethers.getSigners();
      const { contractInstance } = await deployErc20Base(name);

      const account = await contractInstance.owner();
      expect(account).to.equal(owner.address);
    });
  });
}
