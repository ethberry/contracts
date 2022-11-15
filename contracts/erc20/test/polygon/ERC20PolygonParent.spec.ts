import { use } from "chai";
import { solidity } from "ethereum-waffle";

import { DEFAULT_ADMIN_ROLE, PREDICATE_ROLE } from "@gemunion/contracts-constants";
import { shouldBeAccessible } from "@gemunion/contracts-mocha";

import { deployErc20Base } from "../shared/fixtures";

use(solidity);

describe("ERC20PolygonParentMock", function () {
  const factory = () => deployErc20Base(this.title);

  shouldBeAccessible(factory)(DEFAULT_ADMIN_ROLE, PREDICATE_ROLE);
});
