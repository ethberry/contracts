import { expect } from "chai";

export function shouldGetChild() {
  describe("getChild", function () {
    it("should get child", async function () {
      await this.erc721InstanceMock.mint(this.owner.address);
      await this.erc721InstanceMock.approve(this.erc721Instance.address, 0);
      await this.erc721Instance.mint(this.owner.address); // this is edge case
      await this.erc721Instance.mint(this.owner.address);

      const tx1 = this.erc721Instance.getChild(this.owner.address, 1, this.erc721InstanceMock.address, 0);
      await expect(tx1)
        .to.emit(this.erc721Instance, "ReceivedChild")
        .withArgs(this.owner.address, 1, this.erc721InstanceMock.address, 0);
      await expect(tx1)
        .to.emit(this.erc721InstanceMock, "Transfer")
        .withArgs(this.owner.address, this.erc721Instance.address, 0);
    });
  });
}
