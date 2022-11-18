import { use } from "chai";
import { solidity } from "ethereum-waffle";

import { InterfaceId } from "@gemunion/contracts-constants";
import { shouldBeOwnable, shouldSupportsInterface } from "@gemunion/contracts-mocha";

import { deployErc20Base, shouldERC20Base, shouldERC20Burnable, shouldERC20Capped } from "../../src";

use(solidity);

describe("ERC20OBC", function () {
  const factory = () => deployErc20Base(this.title);

  shouldBeOwnable(factory);

  shouldERC20Base(factory);
  shouldERC20Burnable(factory);
  shouldERC20Capped(factory);

  shouldSupportsInterface(factory)(InterfaceId.IERC165, InterfaceId.IERC20, InterfaceId.IERC20Metadata);
});
