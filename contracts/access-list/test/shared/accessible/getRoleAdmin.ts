import { expect } from "chai";
import { DEFAULT_ADMIN_ROLE } from "../../constants";
import { deployAccessList } from "../fixtures";

export function shouldGetRoleAdmin(name: string) {
  return (...roles: Array<string>) => {
    describe("getRoleAdmin", function () {
      roles.forEach(role => {
        it(`Should get role admin for ${role}`, async function () {
          const { contractInstance } = await deployAccessList(name);

          const roleAdmin = await contractInstance.getRoleAdmin(role);
          expect(roleAdmin).to.equal(DEFAULT_ADMIN_ROLE);
        });
      });
    });
  };
}
