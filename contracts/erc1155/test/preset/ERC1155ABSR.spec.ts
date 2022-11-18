import { use } from "chai";
import { solidity } from "ethereum-waffle";

import { DEFAULT_ADMIN_ROLE, InterfaceId, MINTER_ROLE } from "@gemunion/contracts-constants";
import { shouldBeAccessible, shouldSupportsInterface } from "@gemunion/contracts-mocha";

import { shouldERC1155Base } from "../../src/base";
import { shouldERC1155Supply } from "../../src/supply";
import { shouldERC1155Burnable } from "../../src/burnable";
import { shouldERC1155Royalty } from "../../src/royalty";
import { deployErc1155Base } from "../../src/fixtures";

use(solidity);

describe("ERC1155ABSR", function () {
  const factory = () => deployErc1155Base(this.title);

  shouldERC1155Base(factory);
  shouldBeAccessible(factory)(DEFAULT_ADMIN_ROLE, MINTER_ROLE);
  shouldERC1155Burnable(factory);
  shouldERC1155Supply(factory);
  shouldERC1155Royalty(factory);

  shouldSupportsInterface(factory)(
    InterfaceId.IERC165,
    InterfaceId.IAccessControl,
    InterfaceId.IERC1155,
    InterfaceId.IERC1155Metadata,
    InterfaceId.IRoyalty,
  );
});
