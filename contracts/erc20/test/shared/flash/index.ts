import { Contract } from "ethers";

import { shouldMaxFlashLoan } from "./maxFlashLoan";
import { shouldFlashFee } from "./flashFee";
import { shouldFlashFeeReceiver } from "./flashFeeReceiveer";
import { shouldFlashLoan } from "./flashLoan";
import { shouldFlashCustom } from "./custom";

export function shouldERC20Flash(factory: () => Promise<Contract>) {
  shouldMaxFlashLoan(factory);
  shouldFlashFee(factory);
  shouldFlashFeeReceiver(factory);
  shouldFlashLoan(factory);
  shouldFlashCustom(factory);
}
