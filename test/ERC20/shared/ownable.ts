import { shouldHaveOwner } from "../../shared/ownable/owner";
import { shouldTransferOwnership } from "../../shared/ownable/transferOwnership";
import { shouldRenounceOwnership } from "../../shared/ownable/renounceOwnership";

export function shouldERC20Ownable() {
  shouldHaveOwner();
  shouldTransferOwnership();
  shouldRenounceOwnership();
}
