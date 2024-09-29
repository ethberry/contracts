import { DEFAULT_ADMIN_ROLE, InterfaceId } from "@ethberry/contracts-constants";
import { shouldSupportsInterface } from "@ethberry/contracts-utils";

import { shouldBehaveLikeAccessControl, shouldBehaveLikeWhiteList, shouldBehaveLikeWhiteListMe } from "../../src";
import { deployAccessList } from "../fixtures";

describe("WhiteListTest", function () {
  const factory = () => deployAccessList(this.title);

  shouldBehaveLikeAccessControl(factory)(DEFAULT_ADMIN_ROLE);

  shouldBehaveLikeWhiteList(factory);
  shouldBehaveLikeWhiteListMe(factory);

  shouldSupportsInterface(factory)([InterfaceId.IERC165, InterfaceId.IAccessControl, InterfaceId.IWhiteList]);
});
