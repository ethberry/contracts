import { use } from "chai";
import { solidity } from "ethereum-waffle";

import { InterfaceId } from "@gemunion/contracts-constants";
import { shouldSupportsInterface, shouldBeOwnable } from "@gemunion/contracts-mocha";

import { shouldSnapshot } from "../shared/snapshot";
import { shouldERC20Base } from "../shared/base";
import { shouldERC20Burnable } from "../shared/burnable";
import { shouldERC20Capped } from "../shared/capped";
import { deployErc20Base } from "../shared/fixtures";

use(solidity);

describe("ERC20OBCS", function () {
  const factory = () => deployErc20Base(this.title);

  shouldBeOwnable(factory);

  shouldERC20Base(factory);
  shouldERC20Burnable(factory);
  shouldERC20Capped(factory);
  shouldSnapshot(factory);

  shouldSupportsInterface(factory)(InterfaceId.IERC165, InterfaceId.IERC20, InterfaceId.IERC20Metadata);
});
