import { expect } from "chai";
import { ethers } from "hardhat";

import { baseTokenURI, tokenId } from "@gemunion/contracts-constants";

import type { IERC721Options } from "../shared/defaultMint";
import { defaultMintERC721 } from "../shared/defaultMint";

export function shouldTokenURI(factory: () => Promise<any>, options: IERC721Options = {}) {
  const { mint = defaultMintERC721, batchSize = 0n } = options;
  describe("tokenURI", function () {
    it("should get token uri", async function () {
      const [owner] = await ethers.getSigners();
      const contractInstance = await factory();

      await mint(contractInstance, owner, owner, batchSize + tokenId);
      const uri = await contractInstance.tokenURI(batchSize + tokenId);
      expect(uri).to.equal(`${baseTokenURI}/${contractInstance.target.toLowerCase()}/${batchSize + tokenId}`);
    });

    // setTokenURI is not supported

    it("should fail: URI query for nonexistent token", async function () {
      const contractInstance = await factory();

      const uri = contractInstance.tokenURI(batchSize + tokenId);
      await expect(uri)
        .to.be.revertedWithCustomError(contractInstance, "ERC721NonexistentToken")
        .withArgs(batchSize + tokenId);
    });
  });
}
