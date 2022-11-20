import { use } from "chai";
import { solidity } from "ethereum-waffle";

import { DEFAULT_ADMIN_ROLE, InterfaceId } from "@gemunion/contracts-constants";
import { shouldBeAccessible, shouldSupportsInterface } from "@gemunion/contracts-mocha";

import { shouldBlackList, shouldBlackListMe } from "../../src";
import { deployAccessList } from "../fixtures";

use(solidity);

describe("BlackListTest", function () {
  const factory = () => deployAccessList(this.title);

  shouldBeAccessible(factory)(DEFAULT_ADMIN_ROLE);

  shouldBlackList(factory);
  shouldBlackListMe(factory);

  shouldSupportsInterface(factory)(InterfaceId.IERC165, InterfaceId.IAccessControl);
});
