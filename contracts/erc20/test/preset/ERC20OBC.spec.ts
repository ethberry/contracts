import { use } from "chai";
import { solidity } from "ethereum-waffle";

import { InterfaceId } from "@gemunion/contracts-constants";
import { shouldBeOwnable, shouldSupportsInterface } from "@gemunion/contracts-mocha";

import { shouldBase, shouldBurnable, shouldCapped } from "../../src";
import { deployErc20Base } from "../fixtures";

use(solidity);

describe("ERC20OBC", function () {
  const factory = () => deployErc20Base(this.title);

  shouldBeOwnable(factory);

  shouldBase(factory);
  shouldBurnable(factory);
  shouldCapped(factory);

  shouldSupportsInterface(factory)(InterfaceId.IERC165, InterfaceId.IERC20, InterfaceId.IERC20Metadata);
});
