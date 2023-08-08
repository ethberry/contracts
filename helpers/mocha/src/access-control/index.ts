import "@nomicfoundation/hardhat-toolbox";

import { shouldHaveRole } from "./hasRoles";
import { shouldGetRoleAdmin } from "./getRoleAdmin";
import { shouldGrantRole } from "./grantRole";
import { shouldRevokeRole } from "./revokeRole";
import { shouldRenounceRole } from "./renounceRole";

export function shouldBehaveLikeAccessControl(factory: () => Promise<any>) {
  return (...roles: Array<string>) => {
    shouldHaveRole(factory)(...roles);
    shouldGetRoleAdmin(factory)(...roles);
    shouldGrantRole(factory);
    shouldRevokeRole(factory);
    shouldRenounceRole(factory);
  };
}

export { shouldHaveRole, shouldGetRoleAdmin, shouldGrantRole, shouldRevokeRole, shouldRenounceRole };
