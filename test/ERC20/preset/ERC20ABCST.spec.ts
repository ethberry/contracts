import { expect, use } from "chai";
import { solidity } from "ethereum-waffle";

import { DEFAULT_ADMIN_ROLE, MINTER_ROLE, SNAPSHOT_ROLE } from "../../constants";
import { shouldSnapshot } from "../shared/snapshot";
import { shouldERC20Permit } from "../shared/permit";
import { shouldERC20Base } from "../shared/base";
import { shouldERC20Burnable } from "../shared/burnable";
import { shouldERC20Accessible } from "../shared/accessible";
import { shouldERC20Capped } from "../shared/capped";
import { deployErc20Base } from "../shared/fixtures";

use(solidity);

describe("ERC20ABCST", function () {
  const name = "ERC20ABCST";

  shouldERC20Base(name);
  shouldERC20Accessible(name)(DEFAULT_ADMIN_ROLE, MINTER_ROLE, SNAPSHOT_ROLE);
  shouldERC20Burnable(name);
  shouldERC20Capped(name);
  shouldSnapshot(name);
  shouldERC20Permit(name);

  describe("supportsInterface", function () {
    it("should support all interfaces", async function () {
      const { contractInstance } = await deployErc20Base(name);

      const supportsIERC20 = await contractInstance.supportsInterface("0x36372b07");
      expect(supportsIERC20).to.equal(true);
      const supportsIERC20Metadata = await contractInstance.supportsInterface("0xa219a025");
      expect(supportsIERC20Metadata).to.equal(true);
      const supportsIERC165 = await contractInstance.supportsInterface("0x01ffc9a7");
      expect(supportsIERC165).to.equal(true);
      const supportsIAccessControl = await contractInstance.supportsInterface("0x7965db0b");
      expect(supportsIAccessControl).to.equal(true);
      const supportsInvalidInterface = await contractInstance.supportsInterface("0xffffffff");
      expect(supportsInvalidInterface).to.equal(false);
    });
  });
});
