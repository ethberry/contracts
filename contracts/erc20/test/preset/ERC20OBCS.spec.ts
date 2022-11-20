import { use } from "chai";
import { solidity } from "ethereum-waffle";

import { InterfaceId } from "@gemunion/contracts-constants";
import { shouldBeOwnable, shouldSupportsInterface } from "@gemunion/contracts-mocha";

import { deployErc20Base, shouldBase, shouldBurnable, shouldCapped, shouldSnapshot } from "../../src";

use(solidity);

describe("ERC20OBCS", function () {
  const factory = () => deployErc20Base(this.title);

  shouldBeOwnable(factory);

  shouldBase(factory);
  shouldBurnable(factory);
  shouldCapped(factory);
  shouldSnapshot(factory);

  shouldSupportsInterface(factory)(InterfaceId.IERC165, InterfaceId.IERC20, InterfaceId.IERC20Metadata);
});
