import { expect } from "chai";
import { ethers } from "hardhat";

import { tokenId } from "@gemunion/contracts-constants";

import type { IERC721Options } from "../shared/defaultMint";
import { defaultMintERC721 } from "../shared/defaultMint";

export function shouldSetBaseURI(factory: () => Promise<any>, options: IERC721Options = {}) {
  const { mint = defaultMintERC721, batchSize = 0n } = options;
  describe("setBaseURI", function () {
    it("should set token uri", async function () {
      const newURI = "http://example.com/";
      const [owner] = await ethers.getSigners();
      const contractInstance = await factory();

      await mint(contractInstance, owner, owner, batchSize + tokenId);
      const tx = contractInstance.setBaseURI(newURI);

      await expect(tx).to.emit(contractInstance, "BaseURIUpdate").withArgs(newURI);

      const uri = await contractInstance.tokenURI(batchSize + tokenId);
      expect(uri).to.equal(`${newURI}/${contractInstance.target.toLowerCase()}/${batchSize + tokenId}`);
    });
  });
}
