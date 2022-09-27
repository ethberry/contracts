import { expect } from "chai";

import { baseTokenURI } from "../../../constants";
import { deployErc1155Base } from "../fixtures";

export function shouldURI(name: string) {
  describe("uri", function () {
    it("should get default token URI", async function () {
      const { contractInstance } = await deployErc1155Base(name);

      const uri = await contractInstance.uri(0);
      expect(uri).to.equal(baseTokenURI);
    });
  });
}
