import { use } from "chai";
import { solidity } from "ethereum-waffle";

import { InterfaceId } from "@gemunion/contracts-constants";
import { shouldBehaveLikeOwnable, shouldSupportsInterface } from "@gemunion/contracts-mocha";

import { shouldBehaveLikeERC20, shouldBehaveLikeERC20Burnable } from "../../src";
import { deployERC20 } from "../../src/fixtures";

use(solidity);

describe("ERC20OB", function () {
  const factory = () => deployERC20(this.title);

  shouldBehaveLikeOwnable(factory);

  shouldBehaveLikeERC20(factory);
  shouldBehaveLikeERC20Burnable(factory);

  shouldSupportsInterface(factory)(InterfaceId.IERC165, InterfaceId.IERC20, InterfaceId.IERC20Metadata);
});
