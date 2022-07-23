import { expect, use } from "chai";
import { solidity } from "ethereum-waffle";
import { ethers } from "hardhat";
import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";

import { baseTokenURI, royalty, tokenId, tokenName, tokenSymbol } from "../constants";

use(solidity);

describe("ERC721BaseUrl", function () {
  let owner: SignerWithAddress;

  beforeEach(async function () {
    [owner] = await ethers.getSigners();

    const erc721Factory = await ethers.getContractFactory("ERC721BaseUrlTest");
    this.erc721Instance = await erc721Factory.deploy(tokenName, tokenSymbol, royalty, baseTokenURI);
  });

  describe("tokenURI", function () {
    it("should get token uri", async function () {
      await this.erc721Instance.mint(owner.address, tokenId);
      const uri = await this.erc721Instance.tokenURI(tokenId);
      expect(uri).to.equal(`${baseTokenURI}/${this.erc721Instance.address.toLowerCase()}/${tokenId}`);
    });

    it("should fail: URI query for nonexistent token", async function () {
      const uri = this.erc721Instance.tokenURI(tokenId);
      // https://github.com/TrueFiEng/Waffle/issues/761
      // await expect(uri).to.be.revertedWith("ERC721: invalid token ID");
      await expect(uri).to.be.reverted;
    });
  });

  describe("setBaseURI", function () {
    it("should set token uri", async function () {
      const newURI = "http://example.com/";
      await this.erc721Instance.mint(owner.address, tokenId);
      await this.erc721Instance.setBaseURI(newURI);
      const uri = await this.erc721Instance.tokenURI(tokenId);
      expect(uri).to.equal(`${newURI}/${this.erc721Instance.address.toLowerCase()}/${tokenId}`);
    });
  });
});
