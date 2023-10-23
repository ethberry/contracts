import { shouldGetTotalShares } from "./totalShares";
import { shouldGetTotalReleased } from "./totalReleased";
import { shouldRelease } from "./release";
import { shouldReceive } from "./receive";
import { shouldGetPayee } from "./payee";
import { shouldGetReleasable } from "./releasable";
import { shouldGetReleased } from "./released";

export function shouldBehaveLikePaymentSplitter(factory: () => Promise<any>) {
  shouldGetTotalShares(factory);
  shouldGetReleasable(factory);
  shouldGetTotalReleased(factory);
  shouldReceive(factory);
  shouldRelease(factory);
  shouldGetPayee(factory);
  shouldGetReleased(factory);
}
