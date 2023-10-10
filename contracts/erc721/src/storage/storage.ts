import { expect } from "chai";
import { ethers } from "hardhat";

import { tokenId } from "@gemunion/contracts-constants";

import type { IERC721Options } from "../shared/defaultMint";
import { defaultMintERC721 } from "../shared/defaultMint";

export function shouldBehaveLikeERC721UriStorage(factory: () => Promise<any>, options: IERC721Options = {}) {
  const { mint = defaultMintERC721 } = options;

  describe("tokenURI", function () {
    it("should get default token URI", async function () {
      const [owner] = await ethers.getSigners();
      const contractInstance = await factory();

      await mint(contractInstance, owner, owner.address, tokenId);
      const uri = await contractInstance.tokenURI(tokenId);
      expect(uri).to.equal("");
    });

    it("should override token URI", async function () {
      const [owner] = await ethers.getSigners();
      const contractInstance = await factory();

      const newURI = "newURI";
      await mint(contractInstance, owner, owner.address, tokenId);
      await contractInstance.setTokenURI(tokenId, newURI);
      const uri = await contractInstance.tokenURI(tokenId);
      expect(uri).to.equal(newURI);
    });

    it("should fail: ERC721NonexistentToken", async function () {
      const contractInstance = await factory();

      const uri = contractInstance.tokenURI(tokenId);
      await expect(uri).to.be.revertedWithCustomError(contractInstance, "ERC721NonexistentToken").withArgs(tokenId);
    });
  });
}
