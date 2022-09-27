import { shouldHaveOwner } from "../../shared/ownable/owner";
import { shouldTransferOwnership } from "../../shared/ownable/transferOwnership";
import { shouldRenounceOwnership } from "../../shared/ownable/renounceOwnership";

export function shouldERC721Ownable() {
  shouldHaveOwner();
  shouldTransferOwnership();
  shouldRenounceOwnership();
}
