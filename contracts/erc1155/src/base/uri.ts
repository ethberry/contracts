import { expect } from "chai";

import { baseTokenURI } from "@ethberry/contracts-constants";

export function shouldURI(factory: () => Promise<any>) {
  describe("uri", function () {
    it("should get default token URI", async function () {
      const contractInstance = await factory();

      const uri = await contractInstance.uri(0);
      expect(uri).to.equal(baseTokenURI);
    });
  });
}
