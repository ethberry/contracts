import { expect } from "chai";
import { ethers } from "hardhat";

import { deployErc998Base } from "../../fixtures";

export function shouldERC721Storage(name: string) {
  describe("tokenURI", function () {
    it("should get default token URI", async function () {
      const [owner] = await ethers.getSigners();
      const { contractInstance } = await deployErc998Base(name);

      await contractInstance.mint(owner.address);
      const uri = await contractInstance.tokenURI(0);
      expect(uri).to.equal("");
    });

    it("should override token URI", async function () {
      const [owner] = await ethers.getSigners();
      const { contractInstance } = await deployErc998Base(name);

      const newURI = "newURI";
      await contractInstance.mint(owner.address);
      await contractInstance.setTokenURI(0, newURI);
      const uri = await contractInstance.tokenURI(0);
      expect(uri).to.equal(newURI);
    });
  });
}
