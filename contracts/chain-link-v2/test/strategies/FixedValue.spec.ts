import { expect } from "chai";
import { ethers } from "hardhat";

import { ERC721FixedValueRandomStrategy } from "../../typechain-types";

describe("FixedValueRandomStrategy", function () {
  let nftInstance: ERC721FixedValueRandomStrategy;

  beforeEach(async function () {
    const nft = await ethers.getContractFactory("ERC721FixedValueRandomStrategy");
    nftInstance = await nft.deploy();
  });

  describe("_setDispersion", function () {
    it("should set new sequence", async function () {
      const tx = nftInstance.setDispersion(
        ([] as Array<number>).concat(
          new Array(1).fill(5),
          new Array(3).fill(4),
          new Array(8).fill(3),
          new Array(20).fill(2),
          new Array(68).fill(1),
        ),
      );
      await expect(tx).to.not.be.reverted;
    });

    it("should fail: dispersion must have 100 elements", async function () {
      const tx = nftInstance.setDispersion(new Array(111).fill(1));
      await expect(tx).to.be.revertedWith("ERC721Random: dispersion must have 100 elements");
    });
  });

  describe("_getDispersion", function () {
    it("should get dispersion (<100)", async function () {
      await nftInstance.setDispersion(new Array(100).fill(1));
      const value = await nftInstance.getDispersion(60);
      expect(value).to.equal(1);
    });

    it("should get dispersion (>100)", async function () {
      await nftInstance.setDispersion(new Array(100).fill(1));
      const value = await nftInstance.getDispersion(12345);
      expect(value).to.equal(1);
    });

    it("should fail: dispersion is not set", async function () {
      const tx = nftInstance.getDispersion(12345);
      await expect(tx).to.be.revertedWith("ERC721Random: dispersion is not set");
    });
  });
});
