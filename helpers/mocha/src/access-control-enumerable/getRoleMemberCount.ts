import { expect } from "chai";
// import { Contract } from "ethers";

import { DEFAULT_ADMIN_ROLE } from "@gemunion/contracts-constants";

export function shouldGetRoleMemberCount(factory: () => Promise<any>) {
  describe("getRoleMemberCount", function () {
    it("Should get role member count", async function () {
      const contractInstance = await factory();

      const count = await contractInstance.getRoleMemberCount(DEFAULT_ADMIN_ROLE);
      expect(count).to.equal(1);
    });
  });
}
