import { expect } from "chai";
import { ethers } from "hardhat";

export function shouldGetPayee(factory: () => Promise<any>) {
  describe("totalShares", function () {
    it("should get total shares", async function () {
      const [owner] = await ethers.getSigners();
      const contractInstance = await factory();

      const totalShares = await contractInstance.payee(0);
      expect(totalShares).to.equal(owner);
    });
  });
}
