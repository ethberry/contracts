import { Contract } from "ethers";

import type { IERC20Options } from "../shared/defaultMint";
import { shouldMaxFlashLoan } from "./maxFlashLoan";
import { shouldFlashFee } from "./flashFee";
import { shouldFlashFeeReceiver } from "./flashFeeReceiveer";
import { shouldFlashLoan } from "./flashLoan";
import { shouldFlashCustom } from "./custom";

export function shouldBehaveLikeERC20FlashLoan(factory: () => Promise<Contract>, options?: IERC20Options) {
  shouldMaxFlashLoan(factory, options);
  shouldFlashFee(factory);
  shouldFlashFeeReceiver(factory);
  shouldFlashLoan(factory, options);
  shouldFlashCustom(factory, options);
}

export { shouldMaxFlashLoan, shouldFlashFee, shouldFlashFeeReceiver, shouldFlashLoan, shouldFlashCustom };
