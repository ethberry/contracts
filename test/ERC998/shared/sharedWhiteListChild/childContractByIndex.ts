import { expect } from "chai";

export function shouldChildContractByIndex() {
  describe("childContractByIndex", function () {
    it("should get child contract by index", async function () {
      await this.erc998Instance.whiteListChild(this.erc721Instance.address);
      await this.erc998Instance.setMaxChild(0);
      await this.erc721Instance.mint(this.owner.address);
      await this.erc998Instance.mint(this.owner.address); // this is edge case
      await this.erc998Instance.mint(this.owner.address);

      const tx1 = this.erc721Instance["safeTransferFrom(address,address,uint256,bytes)"](
        this.owner.address,
        this.erc998Instance.address,
        0, // erc721 tokenId
        "0x0000000000000000000000000000000000000000000000000000000000000001", // erc998 tokenId
      );
      await expect(tx1).to.not.be.reverted;

      const address = await this.erc998Instance.childContractByIndex(1, 0);
      expect(address).to.equal(this.erc721Instance.address);
    });
  });
}