import { IERC20Options } from "../shared/defaultMint";
import { shouldCheckClockMode } from "./clockMode";
import { shouldGetNumCheckpoints } from "./numCheckpoints";

export function shouldBehaveLikeERC20Vote(factory: () => Promise<any>, _options?: IERC20Options) {
  shouldCheckClockMode(factory);
  shouldGetNumCheckpoints(factory);
}

export { shouldCheckClockMode };
