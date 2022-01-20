import { expect } from "chai";

export const baseTokenURI = "http://localhost/";

export function shouldTokenURI() {
  describe("tokenURI", function () {
    it("should get default token URI", async function () {
      await this.erc721Instance.mint(this.owner.address, 0);
      const uri = await this.erc721Instance.tokenURI(0);
      expect(uri).to.equal(`${baseTokenURI}0`);
    });

    it("should override token URI", async function () {
      await this.erc721Instance.mint(this.owner.address, 0);
      await this.erc721Instance.setTokenURI(0, "newURI");
      const uri = await this.erc721Instance.tokenURI(0);
      expect(uri).to.equal(`${baseTokenURI}newURI`);
    });
  });
}
