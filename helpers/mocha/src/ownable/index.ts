import { Contract } from "ethers";

import { shouldHaveOwner } from "./owner";
import { shouldTransferOwnership } from "./transferOwnership";
import { shouldRenounceOwnership } from "./renounceOwnership";

export function shouldBeOwnable(factory: () => Promise<Contract>) {
  shouldHaveOwner(factory);
  shouldTransferOwnership(factory);
  shouldRenounceOwnership(factory);
}
