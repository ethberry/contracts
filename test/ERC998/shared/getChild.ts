import { expect } from "chai";

export function shouldGetChild() {
  describe("getChild", function () {
    it("should get child", async function () {
      await this.erc721Instance.mint(this.owner.address);
      await this.erc721Instance.approve(this.erc998Instance.address, 0);
      await this.erc998Instance.mint(this.owner.address); // this is edge case
      await this.erc998Instance.mint(this.owner.address);

      const tx1 = this.erc998Instance.getChild(this.owner.address, 1, this.erc721Instance.address, 0);
      await expect(tx1).to.emit(this.erc998Instance, "ReceivedChild").withArgs(this.owner.address, 1, this.erc721Instance.address, 0);
      await expect(tx1).to.emit(this.erc721Instance, "Transfer").withArgs(this.owner.address, this.erc998Instance.address, 0);
    });
  });
}