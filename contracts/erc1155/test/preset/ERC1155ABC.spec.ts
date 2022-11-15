import { use } from "chai";
import { solidity } from "ethereum-waffle";

import { DEFAULT_ADMIN_ROLE, InterfaceId, MINTER_ROLE } from "@gemunion/contracts-constants";
import { shouldBeAccessible, shouldSupportsInterface } from "@gemunion/contracts-mocha";

import { shouldERC1155Base } from "../shared/base";
import { shouldERC1155Capped } from "../shared/capped";
import { shouldERC1155Burnable } from "../shared/burnable";
import { deployErc1155Base } from "../shared/fixtures";

use(solidity);

describe("ERC1155ABC", function () {
  const factory = () => deployErc1155Base(this.title);

  shouldERC1155Base(factory);
  shouldBeAccessible(factory)(DEFAULT_ADMIN_ROLE, MINTER_ROLE);
  shouldERC1155Burnable(factory);
  shouldERC1155Capped(factory);

  shouldSupportsInterface(factory)(
    InterfaceId.IERC165,
    InterfaceId.IAccessControl,
    InterfaceId.IERC1155,
    InterfaceId.IERC1155Metadata,
  );
});
