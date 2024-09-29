import { deployContract, shouldSupportsInterface } from "@ethberry/contracts-utils";
import { InterfaceId } from "@ethberry/contracts-constants";

import { shouldReceiveErc721 } from "./shared/erc721";
import { shouldReceiveErc1155 } from "./shared/erc1155";

describe("SemiNftHolderMock", function () {
  const factory = () => deployContract(this.title);

  shouldReceiveErc721(factory);
  shouldReceiveErc1155(factory);

  shouldSupportsInterface(factory)([InterfaceId.IERC165, InterfaceId.IERC721Receiver, InterfaceId.IERC1155Receiver]);
});
