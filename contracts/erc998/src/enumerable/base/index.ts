import { Contract } from "ethers";

import { shouldChildContractByIndex } from "./childContractByIndex";
import { shouldChildTokenByIndex } from "./childTokenByIndex";
import { shouldTotalChildContracts } from "./totalChildContracts";
import { shouldTotalChildTokens } from "./totalChildTokens";

export function shouldBehaveLikeERC998Enumerable(factory: () => Promise<Contract>) {
  shouldChildContractByIndex(factory);
  shouldChildTokenByIndex(factory);
  shouldTotalChildContracts(factory);
  shouldTotalChildTokens(factory);
}
