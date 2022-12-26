import { expect } from "chai";
import { Contract } from "ethers";

import { DEFAULT_ADMIN_ROLE } from "@gemunion/contracts-constants";

export function shouldGetRoleAdmin(factory: () => Promise<Contract>) {
  return (...roles: Array<string>) => {
    describe("getRoleAdmin", function () {
      roles.forEach(role => {
        it(`Should get role admin for ${role}`, async function () {
          const contractInstance = await factory();

          const roleAdmin = await contractInstance.getRoleAdmin(role);
          expect(roleAdmin).to.equal(DEFAULT_ADMIN_ROLE);
        });
      });
    });
  };
}
