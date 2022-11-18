import { use } from "chai";
import { solidity } from "ethereum-waffle";

import {
  DEFAULT_ADMIN_ROLE,
  InterfaceId,
  MINTER_ROLE,
  PAUSER_ROLE,
  SNAPSHOT_ROLE,
} from "@gemunion/contracts-constants";
import { shouldBeAccessible, shouldSupportsInterface } from "@gemunion/contracts-mocha";

import {
  deployErc20Base,
  shouldERC20Base,
  shouldERC20Burnable,
  shouldERC20Capped,
  shouldERC20Pause,
  shouldSnapshot,
} from "../../src";

use(solidity);

describe("ERC20ABCSP", function () {
  const factory = () => deployErc20Base(this.title);

  shouldBeAccessible(factory)(DEFAULT_ADMIN_ROLE, MINTER_ROLE, PAUSER_ROLE, SNAPSHOT_ROLE);

  shouldERC20Base(factory);
  shouldERC20Burnable(factory);
  shouldERC20Capped(factory);
  shouldSnapshot(factory);
  shouldERC20Pause(factory);

  shouldSupportsInterface(factory)(
    InterfaceId.IERC165,
    InterfaceId.IAccessControl,
    InterfaceId.IERC20,
    InterfaceId.IERC20Metadata,
  );
});
