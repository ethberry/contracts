import { expect } from "chai";
import { ethers } from "hardhat";
import { ZeroAddress } from "ethers";

import { amount, tokenId } from "@ethberry/contracts-constants";

import type { IERC1155Options } from "../shared/defaultMint";
import { defaultMintBatchERC1155 } from "../shared/defaultMint";

export function shouldBurnBatch(factory: () => Promise<any>, options: IERC1155Options = {}) {
  const { mintBatch = defaultMintBatchERC1155 } = options;

  describe("burnBatch", function () {
    it("should burn own tokens", async function () {
      const [owner] = await ethers.getSigners();
      const contractInstance = await factory();

      const tokenId1 = tokenId + 1n;
      await mintBatch(contractInstance, owner, owner, [tokenId, tokenId1], [amount, amount], "0x");
      const tx = contractInstance.burnBatch(owner, [tokenId, tokenId1], [amount, amount]);

      await expect(tx)
        .to.emit(contractInstance, "TransferBatch")
        .withArgs(owner, owner, ZeroAddress, [tokenId, tokenId1], [amount, amount]);

      const balanceOfOwner = await contractInstance.balanceOf(owner, tokenId);
      expect(balanceOfOwner).to.equal(0);

      const balanceOfOwner1 = await contractInstance.balanceOf(owner, tokenId1);
      expect(balanceOfOwner1).to.equal(0);
    });

    it("should burn approved tokens", async function () {
      const [owner, receiver] = await ethers.getSigners();
      const contractInstance = await factory();

      const tokenId1 = tokenId + 1n;
      await mintBatch(contractInstance, owner, owner, [tokenId, tokenId1], [amount, amount], "0x");
      await contractInstance.setApprovalForAll(receiver, true);

      const tx = contractInstance.connect(receiver).burnBatch(owner, [tokenId, tokenId1], [amount, amount]);

      await expect(tx)
        .to.emit(contractInstance, "TransferBatch")
        .withArgs(receiver, owner, ZeroAddress, [tokenId, tokenId1], [amount, amount]);

      const balanceOfOwner = await contractInstance.balanceOf(owner, tokenId);
      expect(balanceOfOwner).to.equal(0);

      const balanceOfOwner1 = await contractInstance.balanceOf(owner, tokenId1);
      expect(balanceOfOwner1).to.equal(0);
    });

    it("should fail: ERC1155MissingApprovalForAll", async function () {
      const [owner, receiver] = await ethers.getSigners();
      const contractInstance = await factory();

      const tokenId1 = tokenId + 1n;
      await mintBatch(contractInstance, owner, owner, [tokenId, tokenId1], [amount, amount], "0x");
      const tx = contractInstance.connect(receiver).burnBatch(owner, [tokenId, tokenId1], [amount, amount]);

      await expect(tx)
        .to.be.revertedWithCustomError(contractInstance, "ERC1155MissingApprovalForAll")
        .withArgs(receiver, owner);
    });

    it("should fail: ERC1155InvalidArrayLength", async function () {
      const [owner] = await ethers.getSigners();
      const contractInstance = await factory();

      const tokenId1 = tokenId + 1n;
      await mintBatch(contractInstance, owner, owner, [tokenId, tokenId1], [amount, amount], "0x");
      const tx = contractInstance.burnBatch(owner, [tokenId, tokenId1], [amount]);

      await expect(tx).to.be.revertedWithCustomError(contractInstance, "ERC1155InvalidArrayLength").withArgs(2, 1);
    });

    it("should fail: ERC1155InsufficientBalance (totalSupply)", async function () {
      const [owner, receiver] = await ethers.getSigners();
      const contractInstance = await factory();

      await mintBatch(contractInstance, owner, receiver, [tokenId], [amount], "0x");

      const tx = contractInstance.burnBatch(owner, [tokenId], [amount]);
      await expect(tx)
        .to.be.revertedWithCustomError(contractInstance, "ERC1155InsufficientBalance")
        .withArgs(owner, 0, amount, tokenId);
    });

    it("should fail: ERC1155InsufficientBalance (balance)", async function () {
      const [owner, receiver] = await ethers.getSigners();
      const contractInstance = await factory();

      await mintBatch(contractInstance, owner, receiver, [tokenId], [amount], "0x");

      const tx = contractInstance.burnBatch(owner, [tokenId], [amount]);
      await expect(tx)
        .to.be.revertedWithCustomError(contractInstance, "ERC1155InsufficientBalance")
        .withArgs(owner, 0, amount, tokenId);
    });
  });
}
