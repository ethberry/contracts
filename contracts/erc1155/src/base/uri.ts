import { expect } from "chai";
import { Contract } from "ethers";

import { baseTokenURI } from "@gemunion/contracts-constants";

export function shouldURI(factory: () => Promise<Contract>) {
  describe("uri", function () {
    it("should get default token URI", async function () {
      const contractInstance = await factory();

      const uri = await contractInstance.uri(0);
      expect(uri).to.equal(baseTokenURI);
    });
  });
}
