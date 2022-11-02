import { shouldChildContractByIndex } from "./childContractByIndex";
import { shouldChildTokenByIndex } from "./childTokenByIndex";
import { shouldTotalChildContracts } from "./totalChildContracts";
import { shouldTotalChildTokens } from "./totalChildTokens";

export function shouldERC998BaseEnumerable(name: string) {
  shouldChildContractByIndex(name);
  shouldChildTokenByIndex(name);
  shouldTotalChildContracts(name);
  shouldTotalChildTokens(name);
}
