import { expect } from "chai";
import { ethers } from "hardhat";
import { ContractFactory } from "ethers";
import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";

import { ERC721BaseUrlTest } from "../../typechain-types";
import { baseTokenURI, tokenId, tokenName, tokenSymbol } from "../constants";

describe("ERC721BaseUrl", function () {
  let erc721: ContractFactory;
  let erc721Instance: ERC721BaseUrlTest;
  let owner: SignerWithAddress;

  beforeEach(async function () {
    erc721 = await ethers.getContractFactory("ERC721BaseUrlTest");
    [owner] = await ethers.getSigners();

    erc721Instance = (await erc721.deploy(tokenName, tokenSymbol, baseTokenURI)) as ERC721BaseUrlTest;
  });

  describe("tokenURI", function () {
    it("should get token uri", async function () {
      const uri1 = erc721Instance.tokenURI(tokenId);
      await expect(uri1).to.be.revertedWith("ERC721Metadata: URI query for nonexistent token");

      await erc721Instance.mint(owner.address, tokenId);
      const uri2 = await erc721Instance.tokenURI(tokenId);
      expect(uri2).to.equal(`${baseTokenURI}${erc721Instance.address.toLowerCase()}/${tokenId}`);
    });
  });
});
