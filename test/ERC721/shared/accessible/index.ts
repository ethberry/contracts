import { shouldHaveRole } from "./hasRoles";
import { shouldGetRoleAdmin } from "./getRoleAdmin";
import { shouldGrantRole } from "./grantRole";
import { shouldRevokeRole } from "./revokeRole";
import { shouldRenounceRole } from "./renounceRole";

export function shouldERC721Accessible(name: string) {
  return (...roles: Array<string>) => {
    shouldHaveRole(name)(...roles);
    shouldGetRoleAdmin(name)(...roles);
    shouldGrantRole(name);
    shouldRevokeRole(name);
    shouldRenounceRole(name);
  };
}
