import { expect } from "chai";

import { baseTokenURI } from "../../constants";

export function shouldGetTokenURI() {
  describe("tokenURI", function () {
    it("should get default token URI", async function () {
      await this.erc998Instance.mint(this.owner.address);
      const uri = await this.erc998Instance.tokenURI(0);
      expect(uri).to.equal(`${baseTokenURI}0`);
    });

    it("should override token URI", async function () {
      await this.erc998Instance.mint(this.owner.address);
      await this.erc998Instance.setTokenURI(0, "newURI");
      const uri = await this.erc998Instance.tokenURI(0);
      expect(uri).to.equal(`${baseTokenURI}newURI`);
    });
  });
}
