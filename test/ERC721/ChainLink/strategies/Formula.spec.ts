import { expect } from "chai";
import { ethers } from "hardhat";

import { ERC721FormulaRandomStrategy } from "../../../../typechain-types";

describe("FormulaRandomStrategy", function () {
  let nftInstance: ERC721FormulaRandomStrategy;

  beforeEach(async function () {
    const nft = await ethers.getContractFactory("ERC721FormulaRandomStrategy");
    nftInstance = await nft.deploy();
  });

  describe("_getDispersion", function () {
    it("should get dispersion (<100)", async function () {
      const value = await nftInstance.getDispersion(60);
      expect(value).to.equal(1);
    });

    it("should get dispersion (>100)", async function () {
      const value = await nftInstance.getDispersion(12345);
      expect(value).to.equal(1);
    });
  });
});
