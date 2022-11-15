import "@nomiclabs/hardhat-waffle";
import { Contract } from "ethers";

import { shouldHaveRole } from "./hasRoles";
import { shouldGetRoleAdmin } from "./getRoleAdmin";
import { shouldGrantRole } from "./grantRole";
import { shouldRevokeRole } from "./revokeRole";
import { shouldRenounceRole } from "./renounceRole";

export function shouldBeAccessible(factory: () => Promise<Contract>) {
  return (...roles: Array<string>) => {
    shouldHaveRole(factory)(...roles);
    shouldGetRoleAdmin(factory)(...roles);
    shouldGrantRole(factory);
    shouldRevokeRole(factory);
    shouldRenounceRole(factory);
  };
}
