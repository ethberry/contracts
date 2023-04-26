import { Contract } from "ethers";

import { shouldMaxFlashLoan } from "./maxFlashLoan";
import { shouldFlashFee } from "./flashFee";
import { shouldFlashFeeReceiver } from "./flashFeeReceiveer";
import { shouldFlashLoan } from "./flashLoan";
import { shouldFlashCustom } from "./custom";
import { TMintAmountERC20Fn } from "../shared/interfaces/IERC20MintFn";
import { defaultMintAmountERC20 } from "../shared/defaultMint";

export function shouldBehaveLikeERC20FlashLoan(
  factory: () => Promise<Contract>,
  mint: TMintAmountERC20Fn = defaultMintAmountERC20,
) {
  shouldMaxFlashLoan(factory, mint);
  shouldFlashFee(factory);
  shouldFlashFeeReceiver(factory);
  shouldFlashLoan(factory, mint);
  shouldFlashCustom(factory, mint);
}

export { shouldMaxFlashLoan, shouldFlashFee, shouldFlashFeeReceiver, shouldFlashLoan, shouldFlashCustom };
