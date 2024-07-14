import { shouldReceive } from "./receive";
import { shouldBehaveLikePaymentSplitter } from "../PaymentSplitter";

export function shouldBehaveLikeSplitterWallet(factory: () => Promise<any>) {
  shouldBehaveLikePaymentSplitter(factory);
  shouldReceive(factory);
}
