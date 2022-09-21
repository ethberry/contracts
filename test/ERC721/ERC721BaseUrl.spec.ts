import { expect, use } from "chai";
import { solidity } from "ethereum-waffle";
import { ethers } from "hardhat";

import { baseTokenURI, royalty, tokenId, tokenName, tokenSymbol } from "../constants";

use(solidity);

describe("ERC721BaseUrl", function () {
  beforeEach(async function () {
    [this.owner] = await ethers.getSigners();

    const erc721Factory = await ethers.getContractFactory("ERC721BaseUrlTest");
    this.erc721Instance = await erc721Factory.deploy(tokenName, tokenSymbol, royalty, baseTokenURI);

    this.contractInstance = this.erc721Instance;
  });

  describe("tokenURI", function () {
    it("should get token uri", async function () {
      await this.contractInstance.mint(this.owner.address, tokenId);
      const uri = await this.erc721Instance.tokenURI(tokenId);
      expect(uri).to.equal(`${baseTokenURI}/${this.erc721Instance.address.toLowerCase()}/${tokenId}`);
    });

    // setTokenURI is not supported

    it("should fail: URI query for nonexistent token", async function () {
      const uri = this.contractInstance.tokenURI(tokenId);
      await expect(uri).to.be.revertedWith("ERC721: invalid token ID");
    });
  });

  describe("setBaseURI", function () {
    it("should set token uri", async function () {
      const newURI = "http://example.com/";
      await this.contractInstance.mint(this.owner.address, tokenId);
      await this.contractInstance.setBaseURI(newURI);
      const uri = await this.contractInstance.tokenURI(tokenId);
      expect(uri).to.equal(`${newURI}/${this.contractInstance.address.toLowerCase()}/${tokenId}`);
    });
  });
});
