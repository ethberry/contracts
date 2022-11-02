import { expect } from "chai";

import { deployErc998Base } from "../../../ERC721/shared/fixtures";
import { DEFAULT_ADMIN_ROLE } from "../../../constants";

export function shouldGetRoleAdmin(name: string) {
  return (...roles: Array<string>) => {
    describe("getRoleAdmin", function () {
      roles.forEach(role => {
        it(`Should get role admin for ${role}`, async function () {
          const { contractInstance } = await deployErc998Base(name);

          const roleAdmin = await contractInstance.getRoleAdmin(role);
          expect(roleAdmin).to.equal(DEFAULT_ADMIN_ROLE);
        });
      });
    });
  };
}
