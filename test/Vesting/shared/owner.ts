import { expect } from "chai";
import { ethers } from "hardhat";
import { deployVestingFixture } from "./fixture";

export function shouldHaveOwner(name: string) {
  describe("owner", function () {
    it("Should set the right roles to deployer", async function () {
      const [_owner, receiver] = await ethers.getSigners();
      const { contractInstance } = await deployVestingFixture(name);

      const owner = await contractInstance.owner();
      expect(owner).to.equal(receiver.address);
    });
  });
}
