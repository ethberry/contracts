import { shouldHaveOwner } from "./owner";
import { shouldTransferOwnership } from "./transferOwnership";
import { shouldRenounceOwnership } from "./renounceOwnership";

export function shouldERC20Ownable(name: string) {
  shouldHaveOwner(name);
  shouldTransferOwnership(name);
  shouldRenounceOwnership(name);
}
