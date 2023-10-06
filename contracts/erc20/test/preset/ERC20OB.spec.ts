import { InterfaceId } from "@gemunion/contracts-constants";
import { shouldBehaveLikeOwnable } from "@gemunion/contracts-access";
import { shouldSupportsInterface } from "@gemunion/contracts-utils";

import { shouldBehaveLikeERC20, shouldBehaveLikeERC20Burnable } from "../../src";
import { deployERC20 } from "../../src/fixtures";

describe("ERC20OB", function () {
  const factory = () => deployERC20(this.title);

  shouldBehaveLikeOwnable(factory);

  shouldBehaveLikeERC20(factory);
  shouldBehaveLikeERC20Burnable(factory);

  shouldSupportsInterface(factory)([
    InterfaceId.IERC165,
    InterfaceId.IERC20,
    InterfaceId.IERC20Metadata,
    InterfaceId.IERC1363,
  ]);
});
