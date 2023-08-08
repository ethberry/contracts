import { DEFAULT_ADMIN_ROLE, InterfaceId, MINTER_ROLE } from "@gemunion/contracts-constants";
import { shouldBehaveLikeAccessControlDefaultAdminRules, shouldSupportsInterface } from "@gemunion/contracts-mocha";

import { shouldBehaveLikeERC20, shouldBehaveLikeERC20Burnable } from "../../src";
import { deployERC20 } from "../../src/fixtures";

describe("ERC20DB", function () {
  const factory = () => deployERC20(this.title);

  shouldBehaveLikeAccessControlDefaultAdminRules(factory)(DEFAULT_ADMIN_ROLE, MINTER_ROLE);

  shouldBehaveLikeERC20(factory);
  shouldBehaveLikeERC20Burnable(factory);

  shouldSupportsInterface(factory)([
    InterfaceId.IERC165,
    InterfaceId.IAccessControl,
    InterfaceId.IERC20,
    InterfaceId.IERC20Metadata,
    InterfaceId.IERC1363,
  ]);
});
