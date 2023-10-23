import { expect } from "chai";

export function shouldGetTotalShares(factory: () => Promise<any>) {
  describe("totalShares", function () {
    it("should get total shares", async function () {
      const contractInstance = await factory();

      const totalShares = await contractInstance.totalShares();
      expect(totalShares).to.equal(100);
    });
  });
}
