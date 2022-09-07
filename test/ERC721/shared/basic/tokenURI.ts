import { expect } from "chai";
import { tokenId } from "../../../constants";

export function shouldGetTokenURI() {
  describe("tokenURI", function () {
    it("should get default token URI", async function () {
      await this.contractInstance.mint(this.owner.address, 0);
      const uri = await this.erc721Instance.tokenURI(0);
      expect(uri).to.equal("");
    });

    it("should override token URI", async function () {
      const newURI = "newURI";
      await this.contractInstance.mint(this.owner.address, 0);
      await this.contractInstance.setTokenURI(0, newURI);
      const uri = await this.erc721Instance.tokenURI(0);
      expect(uri).to.equal(newURI);
    });

    it("should fail: URI query for nonexistent token", async function () {
      const uri = this.contractInstance.tokenURI(tokenId);
      await expect(uri).to.be.revertedWith("ERC721: invalid token ID");
    });
  });
}
