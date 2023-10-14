import { expect } from "chai";
import { ethers } from "hardhat";

export function shouldHaveRole(factory: () => Promise<any>) {
  return (...roles: Array<string>) => {
    describe("hasRole", function () {
      roles.forEach(role => {
        it(`Should have ${role} on deployer`, async function () {
          const [owner] = await ethers.getSigners();
          const contractInstance = await factory();

          const hasRole = await contractInstance.hasRole(role, owner);
          expect(hasRole).to.equal(true);
        });
      });
    });
  };
}
