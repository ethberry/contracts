import { expect, use } from "chai";
import { solidity } from "ethereum-waffle";
import { ethers } from "hardhat";

import { baseTokenURI, royalty, tokenId, tokenName, tokenSymbol } from "../constants";

use(solidity);

export async function deployErc721Base(name: string) {
  const erc721Factory = await ethers.getContractFactory(name);
  const erc721Instance = await erc721Factory.deploy(tokenName, tokenSymbol, royalty, baseTokenURI);

  return {
    contractInstance: erc721Instance,
  };
}

describe("ERC721BaseUrl", function () {
  const name = "ERC721BaseUrlTest";

  describe("tokenURI", function () {
    it("should get token uri", async function () {
      const [owner] = await ethers.getSigners();
      const { contractInstance } = await deployErc721Base(name);

      await contractInstance.mint(owner.address, tokenId);
      const uri = await contractInstance.tokenURI(tokenId);
      expect(uri).to.equal(`${baseTokenURI}/${contractInstance.address.toLowerCase()}/${tokenId}`);
    });

    // setTokenURI is not supported

    it("should fail: URI query for nonexistent token", async function () {
      const { contractInstance } = await deployErc721Base(name);

      const uri = contractInstance.tokenURI(tokenId);
      await expect(uri).to.be.revertedWith("ERC721: invalid token ID");
    });
  });

  describe("setBaseURI", function () {
    it("should set token uri", async function () {
      const [owner] = await ethers.getSigners();
      const { contractInstance } = await deployErc721Base(name);

      const newURI = "http://example.com/";
      await contractInstance.mint(owner.address, tokenId);
      await contractInstance.setBaseURI(newURI);
      const uri = await contractInstance.tokenURI(tokenId);
      expect(uri).to.equal(`${newURI}/${contractInstance.address.toLowerCase()}/${tokenId}`);
    });
  });
});
