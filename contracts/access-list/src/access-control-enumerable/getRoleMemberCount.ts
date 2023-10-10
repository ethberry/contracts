import { expect } from "chai";

import { DEFAULT_ADMIN_ROLE } from "@gemunion/contracts-constants";
import type { IAccessControlOptions } from "../shared/interfaces";

export function shouldGetRoleMemberCount(factory: () => Promise<any>, options: IAccessControlOptions = {}) {
  const { adminRole = DEFAULT_ADMIN_ROLE } = options;

  describe("getRoleMemberCount", function () {
    it("Should get role member count", async function () {
      const contractInstance = await factory();

      const count = await contractInstance.getRoleMemberCount(adminRole);
      expect(count).to.equal(1);
    });
  });
}
