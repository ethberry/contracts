import "@nomicfoundation/hardhat-toolbox";

import { shouldHaveRole } from "./hasRoles";
import { shouldGetRoleAdmin } from "./getRoleAdmin";
import { shouldGrantRole } from "./grantRole";
import { shouldRevokeRole } from "./revokeRole";
import { shouldRenounceRole } from "./renounceRole";
import type { IAccessControlOptions } from "../shared/interfaces";

export function shouldBehaveLikeAccessControl(factory: () => Promise<any>, options?: IAccessControlOptions) {
  return (...roles: Array<string>) => {
    shouldHaveRole(factory)(...roles);
    shouldGetRoleAdmin(factory, options)(...roles);
    shouldGrantRole(factory, options);
    shouldRevokeRole(factory, options);
    shouldRenounceRole(factory, options);
  };
}

export { shouldHaveRole, shouldGetRoleAdmin, shouldGrantRole, shouldRevokeRole, shouldRenounceRole };
