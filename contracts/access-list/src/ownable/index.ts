import { shouldHaveOwner } from "./owner";
import { shouldTransferOwnership } from "./transferOwnership";
import { shouldRenounceOwnership } from "./renounceOwnership";

export function shouldBehaveLikeOwnable(factory: () => Promise<any>) {
  shouldHaveOwner(factory);
  shouldTransferOwnership(factory);
  shouldRenounceOwnership(factory);
}
