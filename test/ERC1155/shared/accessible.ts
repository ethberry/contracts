import { shouldHaveRole } from "../../shared/accessControl/hasRoles";
import { shouldGetRoleAdmin } from "../../shared/accessControl/getRoleAdmin";
import { shouldGrantRole } from "../../shared/accessControl/grantRole";
import { shouldRevokeRole } from "../../shared/accessControl/revokeRole";
import { shouldRenounceRole } from "../../shared/accessControl/renounceRole";

export function shouldERC1155Acessible(...roles: Array<string>) {
  shouldHaveRole(...roles);
  shouldGetRoleAdmin(...roles);
  shouldGrantRole();
  shouldRevokeRole();
  shouldRenounceRole();
}
