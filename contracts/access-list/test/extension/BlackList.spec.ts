import { DEFAULT_ADMIN_ROLE, InterfaceId } from "@gemunion/contracts-constants";
import { shouldSupportsInterface } from "@gemunion/contracts-utils";

import { shouldBehaveLikeAccessControl, shouldBehaveLikeBlackList, shouldBehaveLikeBlackListMe } from "../../src";
import { deployAccessList } from "../fixtures";

describe("BlackListTest", function () {
  const factory = () => deployAccessList(this.title);

  shouldBehaveLikeAccessControl(factory)(DEFAULT_ADMIN_ROLE);

  shouldBehaveLikeBlackList(factory);
  shouldBehaveLikeBlackListMe(factory);

  shouldSupportsInterface(factory)([InterfaceId.IERC165, InterfaceId.IAccessControl]);
});
