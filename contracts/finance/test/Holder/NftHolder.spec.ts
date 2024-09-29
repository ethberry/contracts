import { deployContract, shouldSupportsInterface } from "@ethberry/contracts-utils";
import { InterfaceId } from "@ethberry/contracts-constants";

import { shouldReceiveErc721 } from "./shared/erc721";

describe("NftHolderMock", function () {
  const factory = () => deployContract(this.title);

  shouldReceiveErc721(factory);

  shouldSupportsInterface(factory)([InterfaceId.IERC165, InterfaceId.IERC721Receiver]);
});
