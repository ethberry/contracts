import { DEFAULT_ADMIN_ROLE, PREDICATE_ROLE } from "@gemunion/contracts-constants";
import { shouldBeAccessible } from "@gemunion/contracts-mocha";
import { shouldBase } from "@gemunion/contracts-erc20";

import { deployErc20Base } from "../../src/fixtures";

describe("ERC20PolygonParentTest", function () {
  const factory = () => deployErc20Base(this.title);

  shouldBeAccessible(factory)(DEFAULT_ADMIN_ROLE, PREDICATE_ROLE);

  shouldBase(factory, { MINTER_ROLE: PREDICATE_ROLE });
});