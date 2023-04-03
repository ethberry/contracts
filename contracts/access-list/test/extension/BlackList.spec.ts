import { DEFAULT_ADMIN_ROLE, InterfaceId } from "@gemunion/contracts-constants";
import { shouldBehaveLikeAccessControl, shouldSupportsInterface } from "@gemunion/contracts-mocha";

import { shouldBehaveLikeBlackList, shouldBehaveLikeBlackListMe } from "../../src";
import { deployAccessList } from "../fixtures";

describe("BlackListTest", function () {
  const factory = () => deployAccessList(this.title);

  shouldBehaveLikeAccessControl(factory)(DEFAULT_ADMIN_ROLE);

  shouldBehaveLikeBlackList(factory);
  shouldBehaveLikeBlackListMe(factory);

  shouldSupportsInterface(factory)(InterfaceId.IERC165, InterfaceId.IAccessControl);
});
