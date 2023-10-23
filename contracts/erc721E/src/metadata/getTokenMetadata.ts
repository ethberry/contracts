import { expect } from "chai";
import { ethers } from "hardhat";

import { defaultMintERC721, IERC721EnumOptions, TERC721MetadataOptions } from "../shared/defaultMint";

export function shouldGetTokenMetadata(
  factory: () => Promise<any>,
  options: IERC721EnumOptions = {},
  metadata: TERC721MetadataOptions = [],
) {
  const { mint = defaultMintERC721, tokenId: defaultTokenId = 0n } = options;

  describe("getTokenMetadata", function () {
    it("should get metadata", async function () {
      const [owner] = await ethers.getSigners();

      const contractInstance = await factory();

      await mint(contractInstance, owner, owner);

      const tokenMetadata = await contractInstance.getTokenMetadata(defaultTokenId);

      expect(tokenMetadata.length).to.equal(metadata.length);
      for (const [i, { key, value }] of metadata.entries()) {
        expect(tokenMetadata[i].key).to.equal(key);
        expect(tokenMetadata[i].value).to.equal(value);
      }
    });

    it("should get metadata (empty)", async function () {
      const contractInstance = await factory();

      const metadata = await contractInstance.getTokenMetadata(defaultTokenId);
      expect(metadata.length).to.equal(0);
    });
  });
}
