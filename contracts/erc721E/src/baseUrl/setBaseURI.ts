import { expect } from "chai";
import { ethers } from "hardhat";

import type { IERC721EnumOptions } from "../shared/defaultMint";
import { defaultMintERC721 } from "../shared/defaultMint";

export function shouldSetBaseURI(factory: () => Promise<any>, options: IERC721EnumOptions = {}) {
  const { mint = defaultMintERC721, tokenId: defaultTokenId = 0n } = options;
  describe("setBaseURI", function () {
    it("should set token uri", async function () {
      const newURI = "http://example.com/";
      const [owner] = await ethers.getSigners();
      const contractInstance = await factory();

      await mint(contractInstance, owner, owner);
      const tx = contractInstance.setBaseURI(newURI);

      await expect(tx).to.emit(contractInstance, "BaseURIUpdate").withArgs(newURI);

      const uri = await contractInstance.tokenURI(defaultTokenId);
      expect(uri).to.equal(`${newURI}/${contractInstance.target.toLowerCase()}/${defaultTokenId}`);
    });
  });
}
