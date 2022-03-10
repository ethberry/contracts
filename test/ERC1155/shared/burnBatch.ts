import { expect } from "chai";
import { ethers } from "hardhat";
import { amount, tokenId } from "../../constants";

export function shouldBurnBatch() {
  describe("burnBatch", function () {
    it("should burn own tokens", async function () {
      const tokenId1 = tokenId + 1;
      await this.erc1155Instance
        .connect(this.owner)
        .mintBatch(this.owner.address, [tokenId, tokenId1], [amount, amount], "0x");
      const tx = this.erc1155Instance
        .connect(this.owner)
        .burnBatch(this.owner.address, [tokenId, tokenId1], [amount, amount]);

      await expect(tx)
        .to.emit(this.erc1155Instance, "TransferBatch")
        .withArgs(
          this.owner.address,
          this.owner.address,
          ethers.constants.AddressZero,
          [tokenId, tokenId1],
          [amount, amount],
        );

      const balanceOfOwner = await this.erc1155Instance.balanceOf(this.owner.address, tokenId);
      expect(balanceOfOwner).to.equal(0);

      const balanceOfOwner1 = await this.erc1155Instance.balanceOf(this.owner.address, tokenId1);
      expect(balanceOfOwner1).to.equal(0);
    });

    it("should burn approved tokens", async function () {
      const tokenId1 = tokenId + 1;
      await this.erc1155Instance
        .connect(this.owner)
        .mintBatch(this.owner.address, [tokenId, tokenId1], [amount, amount], "0x");
      await this.erc1155Instance.connect(this.owner).setApprovalForAll(this.receiver.address, true);

      const tx = this.erc1155Instance
        .connect(this.receiver)
        .burnBatch(this.owner.address, [tokenId, tokenId1], [amount, amount]);

      await expect(tx)
        .to.emit(this.erc1155Instance, "TransferBatch")
        .withArgs(
          this.receiver.address,
          this.owner.address,
          ethers.constants.AddressZero,
          [tokenId, tokenId1],
          [amount, amount],
        );

      const balanceOfOwner = await this.erc1155Instance.balanceOf(this.owner.address, tokenId);
      expect(balanceOfOwner).to.equal(0);

      const balanceOfOwner1 = await this.erc1155Instance.balanceOf(this.owner.address, tokenId1);
      expect(balanceOfOwner1).to.equal(0);
    });

    it("should fail: not an owner", async function () {
      const tokenId1 = tokenId + 1;
      await this.erc1155Instance
        .connect(this.owner)
        .mintBatch(this.owner.address, [tokenId, tokenId1], [amount, amount], "0x");
      const tx = this.erc1155Instance
        .connect(this.receiver)
        .burnBatch(this.owner.address, [tokenId, tokenId1], [amount, amount]);

      await expect(tx).to.be.revertedWith(`ERC1155: caller is not owner nor approved`);
    });

    it("should fail: ids and amounts length mismatch", async function () {
      const tokenId1 = tokenId + 1;
      await this.erc1155Instance
        .connect(this.owner)
        .mintBatch(this.owner.address, [tokenId, tokenId1], [amount, amount], "0x");
      const tx = this.erc1155Instance.connect(this.owner).burnBatch(this.owner.address, [tokenId, tokenId1], [amount]);

      await expect(tx).to.be.revertedWith(`ERC1155: ids and amounts length mismatch`);
    });

    it("should fail: burn amount exceeds balance", async function () {
      const tokenId1 = tokenId + 1;
      await this.erc1155Instance
        .connect(this.owner)
        .mintBatch(this.owner.address, [tokenId, tokenId1], [amount, amount], "0x");

      const tempAmount = amount + 10;

      const tx = this.erc1155Instance
        .connect(this.owner)
        .burnBatch(this.owner.address, [tokenId, tokenId1], [amount, tempAmount]);
      await expect(tx).to.be.revertedWith(`ERC1155: burn amount exceeds balance`);
    });
  });
}
