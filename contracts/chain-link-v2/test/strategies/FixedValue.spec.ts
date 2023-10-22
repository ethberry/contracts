import { expect } from "chai";

import { deployERC721 } from "../../src/fixture";

describe("FixedValueRandomStrategyTest", function () {
  const factory = () => deployERC721(this.title);

  describe("_setDispersion", function () {
    it("should set new sequence", async function () {
      const contractInstance = await factory();
      const tx = contractInstance.setDispersion(
        ([] as Array<number>).concat(
          new Array(1).fill(5),
          new Array(3).fill(4),
          new Array(8).fill(3),
          new Array(20).fill(2),
          new Array(68).fill(1),
        ),
      );
      await expect(tx).to.not.be.reverted;
    });

    it("should fail: SequenceLength", async function () {
      const contractInstance = await factory();
      const tx = contractInstance.setDispersion(new Array(111).fill(1));
      await expect(tx).to.be.revertedWithCustomError(contractInstance, "SequenceLength").withArgs(111);
    });
  });

  describe("_getDispersion", function () {
    it("should get dispersion (<100)", async function () {
      const contractInstance = await factory();
      await contractInstance.setDispersion(new Array(100).fill(1));
      const value = await contractInstance.getDispersion(60);
      expect(value).to.equal(1);
    });

    it("should get dispersion (>100)", async function () {
      const contractInstance = await factory();
      await contractInstance.setDispersion(new Array(100).fill(1));
      const value = await contractInstance.getDispersion(12345);
      expect(value).to.equal(1);
    });

    it("should fail: SequenceNotSet", async function () {
      const contractInstance = await factory();
      const tx = contractInstance.getDispersion(12345);
      await expect(tx).to.be.revertedWithCustomError(contractInstance, "SequenceNotSet");
    });
  });
});
