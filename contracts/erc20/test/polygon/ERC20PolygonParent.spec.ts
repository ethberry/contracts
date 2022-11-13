import { use } from "chai";
import { solidity } from "ethereum-waffle";

import { DEFAULT_ADMIN_ROLE, PREDICATE_ROLE } from "@gemunion/contracts-test-constants";

import { shouldERC20Accessible } from "../shared/accessible";

use(solidity);

describe("ERC20PolygonParentMock", function () {
  const name = "ERC20PolygonParentMock";

  shouldERC20Accessible(name)(DEFAULT_ADMIN_ROLE, PREDICATE_ROLE);
});
