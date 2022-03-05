import { expect } from "chai";

export function shouldBeOwner() {
  describe("owner", function () {
    it("Should set the right roles to deployer", async function () {
      const owner = await this.erc721Instance.owner();
      expect(owner).to.equal(this.owner.address);
    });
  });
}
