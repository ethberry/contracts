import { expect } from "chai";
import { ethers } from "hardhat";

import { deployErc998Base } from "../fixtures";

export function shouldHaveOwner(name: string) {
  describe("owner", function () {
    it("Should set the right roles to deployer", async function () {
      const [owner] = await ethers.getSigners();
      const { contractInstance } = await deployErc998Base(name);

      const account = await contractInstance.owner();
      expect(account).to.equal(owner.address);
    });
  });
}
