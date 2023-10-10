import "@nomicfoundation/hardhat-toolbox";

import { shouldBehaveLikeAccessControl } from "../access-control";
import { shouldGetRoleMember } from "./getRoleMember";
import { shouldGetRoleMemberCount } from "./getRoleMemberCount";

export function shouldBehaveLikeAccessControlEnumerable(factory: () => Promise<any>) {
  return (...roles: Array<string>) => {
    shouldBehaveLikeAccessControl(factory)(...roles);
    shouldGetRoleMember(factory);
    shouldGetRoleMemberCount(factory);
  };
}

export { shouldGetRoleMember, shouldGetRoleMemberCount };
