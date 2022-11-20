import { use } from "chai";
import { solidity } from "ethereum-waffle";

import { DEFAULT_ADMIN_ROLE, InterfaceId, MINTER_ROLE, SNAPSHOT_ROLE } from "@gemunion/contracts-constants";
import { shouldBeAccessible, shouldSupportsInterface } from "@gemunion/contracts-mocha";

import { shouldBase, shouldBurnable, shouldCapped, shouldPermit, shouldSnapshot } from "../../src";
import { deployErc20Base } from "../../src/fixtures";

use(solidity);

describe("ERC20ABCST", function () {
  const factory = () => deployErc20Base(this.title);

  shouldBeAccessible(factory)(DEFAULT_ADMIN_ROLE, MINTER_ROLE, SNAPSHOT_ROLE);

  shouldBase(factory);
  shouldBurnable(factory);
  shouldCapped(factory);
  shouldSnapshot(factory);
  shouldPermit(factory);

  shouldSupportsInterface(factory)(
    InterfaceId.IERC165,
    InterfaceId.IAccessControl,
    InterfaceId.IERC20,
    InterfaceId.IERC20Metadata,
  );
});
