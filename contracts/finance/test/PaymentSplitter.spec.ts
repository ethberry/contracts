import { shouldSupportsInterface } from "@gemunion/contracts-utils";
import { InterfaceId } from "@gemunion/contracts-constants";

import { shouldBehaveLikePaymentSplitter } from "../src";
import { deployPaymentSplitter } from "../src/fixture";

describe("SplitterWallet", function () {
  const factory = () => deployPaymentSplitter(this.title);

  shouldBehaveLikePaymentSplitter(factory);

  shouldSupportsInterface(factory)([InterfaceId.IERC165, InterfaceId.IERC1363Receiver, InterfaceId.IERC1363Spender]);
});
