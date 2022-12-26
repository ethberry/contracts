import { use } from "chai";
import { solidity } from "ethereum-waffle";

import { DEFAULT_ADMIN_ROLE, InterfaceId, MINTER_ROLE } from "@gemunion/contracts-constants";
import { shouldBehaveLikeAccessControl, shouldSupportsInterface } from "@gemunion/contracts-mocha";

import { shouldBehaveLikeERC20, shouldBehaveLikeERC20Burnable, shouldBehaveLikeERC20Capped } from "../../src";
import { deployERC20 } from "../../src/fixtures";

use(solidity);

describe("ERC20ABC", function () {
  const factory = () => deployERC20(this.title);

  shouldBehaveLikeAccessControl(factory)(DEFAULT_ADMIN_ROLE, MINTER_ROLE);

  shouldBehaveLikeERC20(factory);
  shouldBehaveLikeERC20Burnable(factory);
  shouldBehaveLikeERC20Capped(factory);

  shouldSupportsInterface(factory)(
    InterfaceId.IERC165,
    InterfaceId.IAccessControl,
    InterfaceId.IERC20,
    InterfaceId.IERC20Metadata,
  );
});
