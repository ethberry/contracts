import { deployContract, shouldSupportsInterface } from "@ethberry/contracts-utils";
import { InterfaceId } from "@ethberry/contracts-constants";

import { shouldReceiveErc20 } from "./shared/erc20";
import { shouldReceiveErc1363 } from "./shared/erc1363";

describe("CoinHolderMock", function () {
  const factory = () => deployContract(this.title);

  shouldReceiveErc20(factory);
  shouldReceiveErc1363(factory);

  shouldSupportsInterface(factory)([InterfaceId.IERC165, InterfaceId.IERC1363Spender, InterfaceId.IERC1363Receiver]);
});
