import { use } from "chai";
import { solidity } from "ethereum-waffle";

import { InterfaceId } from "@gemunion/contracts-test-constants";

import { shouldERC1155Ownable } from "../shared/ownable";
import { shouldERC1155Base } from "../shared/base";
import { shouldERC1155Royalty } from "../shared/royalty";
import { shouldSupportsInterface } from "../shared/supportInterface";

use(solidity);

describe("ERC1155OBR", function () {
  const name = "ERC1155OBR";

  shouldERC1155Base(name);
  shouldERC1155Ownable(name);
  shouldERC1155Royalty(name);

  shouldSupportsInterface(name)(
    InterfaceId.IERC165,
    InterfaceId.IERC1155,
    InterfaceId.IERC1155Metadata,
    InterfaceId.IRoyalty,
  );
});
