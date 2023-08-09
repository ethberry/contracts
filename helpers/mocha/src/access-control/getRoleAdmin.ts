import { expect } from "chai";

import { DEFAULT_ADMIN_ROLE } from "@gemunion/contracts-constants";

import { IAccessControlOptions } from "../shared/interfaces";

export function shouldGetRoleAdmin(factory: () => Promise<any>, options: IAccessControlOptions = {}) {
  const { adminRole = DEFAULT_ADMIN_ROLE } = options;

  return (...roles: Array<string>) => {
    describe("getRoleAdmin", function () {
      roles.forEach(role => {
        it(`Should get role admin for ${role}`, async function () {
          const contractInstance = await factory();

          const roleAdmin = await contractInstance.getRoleAdmin(role);
          expect(roleAdmin).to.equal(adminRole);
        });
      });
    });
  };
}
