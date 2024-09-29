import { expect } from "chai";
import { ethers } from "hardhat";

import { baseTokenURI } from "@ethberry/contracts-constants";

import type { IERC721EnumOptions } from "../shared/defaultMint";
import { defaultMintERC721 } from "../shared/defaultMint";

export function shouldTokenURI(factory: () => Promise<any>, options: IERC721EnumOptions = {}) {
  const { mint = defaultMintERC721, tokenId: defaultTokenId = 0n } = options;
  describe("tokenURI", function () {
    it("should get token uri", async function () {
      const [owner] = await ethers.getSigners();
      const contractInstance = await factory();

      await mint(contractInstance, owner, owner);
      const uri = await contractInstance.tokenURI(defaultTokenId);
      expect(uri).to.equal(`${baseTokenURI}/${contractInstance.target.toLowerCase()}/${defaultTokenId}`);
    });

    // setTokenURI is not supported

    it("should fail: URI query for nonexistent token", async function () {
      const contractInstance = await factory();

      const uri = contractInstance.tokenURI(defaultTokenId);
      await expect(uri)
        .to.be.revertedWithCustomError(contractInstance, "ERC721NonexistentToken")
        .withArgs(defaultTokenId);
    });
  });
}
