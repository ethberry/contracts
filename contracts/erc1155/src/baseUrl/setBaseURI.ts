import { expect } from "chai";
import { ethers } from "hardhat";

import { amount, tokenId } from "@ethberry/contracts-constants";

import type { IERC1155Options } from "../shared/defaultMint";
import { defaultMintERC1155 } from "../shared/defaultMint";

export function shouldSetBaseURI(factory: () => Promise<any>, options: IERC1155Options = {}) {
  const { mint = defaultMintERC1155 } = options;

  describe("setBaseURI", function () {
    it("should set token uri", async function () {
      const newURI = "http://example.com/";
      const [owner] = await ethers.getSigners();
      const contractInstance = await factory();

      await mint(contractInstance, owner, owner, tokenId, amount, "0x");
      const tx = contractInstance.setBaseURI(newURI);

      await expect(tx).to.emit(contractInstance, "BaseURIUpdate").withArgs(newURI);

      const uri = await contractInstance.uri(tokenId);
      expect(uri).to.equal(`${newURI}/${contractInstance.target.toLowerCase()}/{id}`);
    });
  });
}
