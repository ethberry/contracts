import { shouldSupportsInterface } from "@gemunion/contracts-utils";
import { InterfaceId } from "@gemunion/contracts-constants";

import { deployPaymentSplitter } from "../src/fixture";
import { shouldBehaveLikeSplitterWallet } from "../src";

describe("SplitterWallet", function () {
  const factory = () => deployPaymentSplitter(this.title);

  shouldBehaveLikeSplitterWallet(factory);

  shouldSupportsInterface(factory)([InterfaceId.IERC165, InterfaceId.IERC1363Receiver, InterfaceId.IERC1363Spender]);
});
