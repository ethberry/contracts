import { expect } from "chai";

import { baseTokenURI, tokenId } from "@gemunion/contracts-constants";

export function shouldCustomURI(factory: () => Promise<any>) {
  describe("uri", function () {
    it("should get token uri", async function () {
      const contractInstance = await factory();
      const address = await contractInstance.getAddress();

      const uri = await contractInstance.uri(tokenId);
      expect(uri).to.equal(`${baseTokenURI}/${address.toLowerCase()}/{id}`);
    });
  });
}
