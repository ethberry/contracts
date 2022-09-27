import { expect } from "chai";

export function shouldERC721Enumerable() {
  describe("tokenOfOwnerByIndex", function () {
    it("should match the token number of the owner", async function () {
      await this.erc721Instance.mint(this.owner.address);
      const tx = this.erc721Instance["safeTransferFrom(address,address,uint256)"](
        this.owner.address,
        this.erc721ReceiverInstance.address,
        0,
      );

      await expect(tx)
        .to.emit(this.erc721Instance, "Transfer")
        .withArgs(this.owner.address, this.erc721ReceiverInstance.address, 0);

      const balanceOfOwner = await this.erc721Instance.balanceOf(this.owner.address);
      expect(balanceOfOwner).to.equal(0);

      const balanceOfReceiver = await this.erc721Instance.balanceOf(this.erc721ReceiverInstance.address);
      expect(balanceOfReceiver).to.equal(1);

      const item = await this.erc721Instance.tokenOfOwnerByIndex(this.erc721ReceiverInstance.address, 0);
      expect(item).to.equal(0); // 0 is nft index
    });
  });
}
