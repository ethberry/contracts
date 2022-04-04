import { expect } from "chai";

export function shouldHaveRole(...roles: Array<string>) {
  describe("hasRole", function () {
    roles.forEach(role => {
      it(`Should set ${role} to deployer`, async function () {
        const isAdmin = await this.contractInstance.hasRole(role, this.owner.address);
        expect(isAdmin).to.equal(true);
      });
    });
  });
}