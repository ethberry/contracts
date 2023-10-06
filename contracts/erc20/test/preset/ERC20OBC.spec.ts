import { InterfaceId } from "@gemunion/contracts-constants";
import { shouldBehaveLikeOwnable } from "@gemunion/contracts-access";
import { shouldSupportsInterface } from "@gemunion/contracts-utils";

import { shouldBehaveLikeERC20, shouldBehaveLikeERC20Burnable, shouldBehaveLikeERC20Capped } from "../../src";
import { deployERC20 } from "../../src/fixtures";

describe("ERC20OBC", function () {
  const factory = () => deployERC20(this.title);

  shouldBehaveLikeOwnable(factory);

  shouldBehaveLikeERC20(factory);
  shouldBehaveLikeERC20Burnable(factory);
  shouldBehaveLikeERC20Capped(factory);

  shouldSupportsInterface(factory)([
    InterfaceId.IERC165,
    InterfaceId.IERC20,
    InterfaceId.IERC20Metadata,
    InterfaceId.IERC1363,
  ]);
});
