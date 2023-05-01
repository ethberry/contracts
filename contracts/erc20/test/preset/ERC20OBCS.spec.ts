import { InterfaceId } from "@gemunion/contracts-constants";
import { shouldBehaveLikeOwnable, shouldSupportsInterface } from "@gemunion/contracts-mocha";

import {
  shouldBehaveLikeERC20,
  shouldBehaveLikeERC20Burnable,
  shouldBehaveLikeERC20Capped,
  shouldBehaveLikeERC20Snapshot,
} from "../../src";
import { deployERC20 } from "../../src/fixtures";

describe("ERC20OBCS", function () {
  const factory = () => deployERC20(this.title);

  shouldBehaveLikeOwnable(factory);

  shouldBehaveLikeERC20(factory);
  shouldBehaveLikeERC20Burnable(factory);
  shouldBehaveLikeERC20Capped(factory);
  shouldBehaveLikeERC20Snapshot(factory);

  shouldSupportsInterface(factory)([
    InterfaceId.IERC165,
    InterfaceId.IERC20,
    InterfaceId.IERC20Metadata,
    InterfaceId.IERC1363,
  ]);
});
