import { expect } from "chai";

import { baseTokenURI } from "../../../constants";

export function shouldURI() {
  describe("uri", function () {
    it("should get default token URI", async function () {
      const uri = await this.erc1155Instance.uri(0);
      expect(uri).to.equal(baseTokenURI);
    });
  });
}
