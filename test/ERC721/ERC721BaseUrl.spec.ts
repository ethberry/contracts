import { expect } from "chai";
import { ethers } from "hardhat";
import { ContractFactory } from "ethers";
import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";

import { ERC721BaseUrlTest } from "../../typechain-types";
import { baseTokenURI, tokenId, tokenName, tokenSymbol, royalty } from "../constants";

describe("ERC721BaseUrl", function () {
  let erc721: ContractFactory;
  let erc721Instance: ERC721BaseUrlTest;
  let owner: SignerWithAddress;

  beforeEach(async function () {
    erc721 = await ethers.getContractFactory("ERC721BaseUrlTest");
    [owner] = await ethers.getSigners();

    erc721Instance = (await erc721.deploy(tokenName, tokenSymbol, royalty, baseTokenURI)) as ERC721BaseUrlTest;
  });

  describe("tokenURI", function () {
    it("should get token uri", async function () {
      await erc721Instance.mint(owner.address, tokenId);
      const uri = await erc721Instance.tokenURI(tokenId);
      expect(uri).to.equal(`${baseTokenURI}${erc721Instance.address.toLowerCase()}/${tokenId}`);
    });

    it("should fail: URI query for nonexistent token", async function () {
      const uri = erc721Instance.tokenURI(tokenId);
      await expect(uri).to.be.revertedWith("ERC721Metadata: URI query for nonexistent token");
    });
  });

  describe("setBaseURI", function () {
    it("should set token uri", async function () {
      const newURI = "http://example.com/";
      await erc721Instance.mint(owner.address, tokenId);
      await erc721Instance.setBaseURI(newURI);
      const uri = await erc721Instance.tokenURI(tokenId);
      expect(uri).to.equal(`${newURI}${erc721Instance.address.toLowerCase()}/${tokenId}`);
    });
  });
});
