import { expect } from "chai";
import { ethers } from "hardhat";

import { deployErc1155Base } from "../fixtures/base";

export function shouldHaveOwner(name: string) {
  describe("owner", function () {
    it("Should set the right roles to deployer", async function () {
      const [owner] = await ethers.getSigners();
      const { contractInstance } = await deployErc1155Base(name);

      const account = await contractInstance.owner();
      expect(account).to.equal(owner.address);
    });
  });
}
