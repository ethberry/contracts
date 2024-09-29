import { deployContract, shouldSupportsInterface } from "@ethberry/contracts-utils";
import { InterfaceId } from "@ethberry/contracts-constants";

import { shouldReceiveErc20 } from "./shared/erc20";
import { shouldReceiveErc1363 } from "./shared/erc1363";
import { shouldReceiveErc721 } from "./shared/erc721";
import { shouldReceiveErc1155 } from "./shared/erc1155";

describe("AllTypesHolderMock", function () {
  const factory = () => deployContract(this.title);

  shouldReceiveErc20(factory);
  shouldReceiveErc1363(factory);
  shouldReceiveErc721(factory);
  shouldReceiveErc1155(factory);

  shouldSupportsInterface(factory)([
    InterfaceId.IERC165,
    InterfaceId.IERC1363Spender,
    InterfaceId.IERC1363Receiver,
    InterfaceId.IERC721Receiver,
    InterfaceId.IERC1155Receiver,
  ]);
});
