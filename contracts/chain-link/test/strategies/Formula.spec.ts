import { expect } from "chai";

import { deployERC721 } from "../../src/fixture";

describe("ERC721FormulaRandomStrategy", function () {
  const factory = () => deployERC721(this.title);

  describe("_getDispersion", function () {
    it("should get dispersion (<100)", async function () {
      const contractInstance = await factory();
      const value = await contractInstance.getDispersion(60);
      expect(value).to.equal(1);
    });

    it("should get dispersion (>100)", async function () {
      const contractInstance = await factory();
      const value = await contractInstance.getDispersion(12345);
      expect(value).to.equal(1);
    });
  });
});
