import { DEFAULT_ADMIN_ROLE, InterfaceId } from "@gemunion/contracts-constants";
import { shouldBeAccessible, shouldSupportsInterface } from "@gemunion/contracts-mocha";

import { deployAccessList, shouldWhiteList, shouldWhiteListMe } from "../../src";

describe("WhiteListTest", function () {
  const factory = () => deployAccessList(this.title);

  shouldBeAccessible(factory)(DEFAULT_ADMIN_ROLE);

  shouldWhiteList(factory);
  shouldWhiteListMe(factory);

  shouldSupportsInterface(factory)(InterfaceId.IERC165, InterfaceId.IAccessControl);
});
