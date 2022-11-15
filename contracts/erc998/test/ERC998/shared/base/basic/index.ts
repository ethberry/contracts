import { Contract } from "ethers";

import { shouldSafeTransferChild } from "./safeTransferChild";
import { shouldChildContractsFor } from "./childContractsFor";
import { shouldChildExists } from "./childExists";
import { shouldSafeTransferFrom } from "./safeTransferFrom";
import { shouldTransferChild } from "./transferChild";

export function shouldERC998Base(factory: () => Promise<Contract>) {
  shouldSafeTransferChild(factory);
  shouldTransferChild(factory);
  shouldChildContractsFor(factory);
  shouldChildExists(factory);
  shouldSafeTransferFrom(factory);
}
