import { Contract } from "ethers";

import { shouldBehaveLikeERC721BERS } from "./erc721";
import { shouldSafeTransferChild } from "./safeTransferChild";
import { shouldChildContractsFor } from "./childContractsFor";
import { shouldChildExists } from "./childExists";
import { shouldSafeTransferFrom } from "./safeTransferFrom";
import { shouldTransferChild } from "./transferChild";

export function shouldBehaveLikeERC998(factory: () => Promise<Contract>) {
  shouldBehaveLikeERC721BERS(factory);
  shouldSafeTransferChild(factory);
  shouldTransferChild(factory);
  shouldChildContractsFor(factory);
  shouldChildExists(factory);
  shouldSafeTransferFrom(factory);
}
