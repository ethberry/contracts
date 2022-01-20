import { expect } from "chai";

import { DEFAULT_ADMIN_ROLE, MINTER_ROLE } from "../../constants";

export function shouldConstructor() {
  describe("constructor", function () {
    it("Should set the right roles to deployer", async function () {
      const isAdmin = await this.erc721Instance.hasRole(DEFAULT_ADMIN_ROLE, this.owner.address);
      expect(isAdmin).to.equal(true);
      const isMinter = await this.erc721Instance.hasRole(MINTER_ROLE, this.owner.address);
      expect(isMinter).to.equal(true);
    });
  });
}
