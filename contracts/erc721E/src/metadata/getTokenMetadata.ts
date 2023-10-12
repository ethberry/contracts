import { expect } from "chai";
import { ethers } from "hardhat";

import { TEMPLATE_ID } from "@gemunion/contracts-constants";

import { defaultMintERC721, IERC721EnumOptions } from "../shared/defaultMint";

export function shouldGetTokenMetadata(factory: () => Promise<any>, options: IERC721EnumOptions = {}) {
  const { mint = defaultMintERC721, tokenId: defaultTokenId = 0n } = options;

  describe("getTokenMetadata", function () {
    it("should get metadata", async function () {
      const [owner] = await ethers.getSigners();

      const contractInstance = await factory();

      await mint(contractInstance, owner, owner);

      const metadata = await contractInstance.getTokenMetadata(defaultTokenId);

      expect(metadata.length).to.equal(1);
      expect(metadata[0].key).to.equal(TEMPLATE_ID);
      expect(metadata[0].value).to.equal(42);
    });

    it("should get metadata (empty)", async function () {
      const contractInstance = await factory();

      const metadata = await contractInstance.getTokenMetadata(defaultTokenId);

      expect(metadata.length).to.equal(0);
    });

    it("should not get (deleted) metadata", async function () {
      const [owner] = await ethers.getSigners();

      const contractInstance = await factory();

      await mint(contractInstance, owner, owner);

      await contractInstance.deleteRecord(defaultTokenId);

      const metadata = await contractInstance.getTokenMetadata(defaultTokenId);
      expect(metadata.length).to.equal(0);
    });

    it("should get metadata (deleted by key)", async function () {
      const [owner] = await ethers.getSigners();

      const contractInstance = await factory();

      await mint(contractInstance, owner, owner);

      await contractInstance.deleteRecordField(defaultTokenId, TEMPLATE_ID);

      const metadata = await contractInstance.getTokenMetadata(defaultTokenId);

      expect(metadata.length).to.equal(0);
    });
  });
}
