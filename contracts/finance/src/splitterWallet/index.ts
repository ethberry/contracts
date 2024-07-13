import { shouldReceive } from "./receive";
import { shouldBehaveLikePaymentSplitter } from "../paymentSplitter";

export function shouldBehaveLikeSplitterWallet(factory: () => Promise<any>) {
  shouldBehaveLikePaymentSplitter(factory);
  shouldReceive(factory);
}
