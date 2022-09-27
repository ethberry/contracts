import { shouldHaveOwner } from "./owner";
import { shouldTransferOwnership } from "./transferOwnership";
import { shouldRenounceOwnership } from "./renounceOwnership";

export function shouldERC1155Ownable(name: string) {
  shouldHaveOwner(name);
  shouldTransferOwnership(name);
  shouldRenounceOwnership(name);
}
