import { use } from "chai";
import { solidity } from "ethereum-waffle";

import { InterfaceId } from "@gemunion/contracts-constants";
import { shouldSupportsInterface, shouldBeOwnable } from "@gemunion/contracts-mocha";

import { shouldERC20Base } from "../../src/base";
import { shouldERC20Burnable } from "../../src/burnable";
import { deployErc20Base } from "../../src/fixtures";

use(solidity);

describe("ERC20OB", function () {
  const factory = () => deployErc20Base(this.title);

  shouldBeOwnable(factory);

  shouldERC20Base(factory);
  shouldERC20Burnable(factory);

  shouldSupportsInterface(factory)(InterfaceId.IERC165, InterfaceId.IERC20, InterfaceId.IERC20Metadata);
});
