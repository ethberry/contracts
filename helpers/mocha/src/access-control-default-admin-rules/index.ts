import "@nomicfoundation/hardhat-toolbox";

import { shouldGetRoleAdmin, shouldHaveRole } from "../access-control";

export function shouldBehaveLikeAccessControlDefaultAdminRules(factory: () => Promise<any>) {
  return (...roles: Array<string>) => {
    shouldHaveRole(factory)(...roles);
    shouldGetRoleAdmin(factory)(...roles);

    // TODO test rest of the methods
  };
}
