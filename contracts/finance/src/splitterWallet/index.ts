import { shouldReceive } from "./receive";

export function shouldBehaveLikeSplitterWallet(factory: () => Promise<any>) {
  shouldReceive(factory);
}
