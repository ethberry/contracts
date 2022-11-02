import { shouldMaxFlashLoan } from "./maxFlashLoan";
import { shouldFlashFee } from "./flashFee";
import { shouldFlashFeeReceiver } from "./flashFeeReceiveer";
import { shouldFlashLoan } from "./flashLoan";
import { shouldFlashCustom } from "./custom";

export function shouldERC20Flash(name: string) {
  shouldMaxFlashLoan(name);
  shouldFlashFee(name);
  shouldFlashFeeReceiver(name);
  shouldFlashLoan(name);
  shouldFlashCustom(name);
}
