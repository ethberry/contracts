import { expect } from "chai";
import { ethers } from "hardhat";

import { METADATA_ROLE } from "@gemunion/contracts-constants";

import { defaultMintERC721, IERC721EnumOptions } from "../shared/defaultMint";

export function shouldDeleteRecord(factory: () => Promise<any>, options: IERC721EnumOptions = {}) {
  const { mint = defaultMintERC721, tokenId: defaultTokenId = 0n } = options;

  describe("deleteRecord", function () {
    it("should delete record", async function () {
      const [owner] = await ethers.getSigners();

      const contractInstance = await factory();

      await mint(contractInstance, owner, owner.address);

      const tx = contractInstance.deleteRecord(defaultTokenId);
      await expect(tx).to.not.be.reverted;
    });

    it("should delete record (empty)", async function () {
      const contractInstance = await factory();

      const tx = contractInstance.deleteRecord(0);
      await expect(tx).to.be.revertedWith("GC: record not found");
    });

    it("should fail: account is missing role", async function () {
      const [_owner, receiver] = await ethers.getSigners();
      const contractInstance = await factory();

      const tx = contractInstance.connect(receiver).deleteRecord(0);
      await expect(tx).to.be.revertedWith(
        `AccessControl: account ${receiver.address.toLowerCase()} is missing role ${METADATA_ROLE}`,
      );
    });
  });
}
