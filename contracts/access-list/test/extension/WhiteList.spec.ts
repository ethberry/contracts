import { DEFAULT_ADMIN_ROLE, InterfaceId } from "@gemunion/contracts-constants";
import { shouldBehaveLikeAccessControl, shouldSupportsInterface } from "@gemunion/contracts-mocha";

import { shouldBehaveLikeWhiteList, shouldBehaveLikeWhiteListMe } from "../../src";
import { deployAccessList } from "../fixtures";

describe("WhiteListTest", function () {
  const factory = () => deployAccessList(this.title);

  shouldBehaveLikeAccessControl(factory)(DEFAULT_ADMIN_ROLE);

  shouldBehaveLikeWhiteList(factory);
  shouldBehaveLikeWhiteListMe(factory);

  shouldSupportsInterface(factory)(InterfaceId.IERC165, InterfaceId.IAccessControl);
});
