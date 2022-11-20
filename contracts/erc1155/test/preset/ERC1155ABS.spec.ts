import { use } from "chai";
import { solidity } from "ethereum-waffle";

import { DEFAULT_ADMIN_ROLE, InterfaceId, MINTER_ROLE } from "@gemunion/contracts-constants";
import { shouldBeAccessible, shouldSupportsInterface } from "@gemunion/contracts-mocha";

import { shouldBase, shouldBurnable, shouldSupply } from "../../src";
import { deployErc1155Base } from "../fixtures";

use(solidity);

describe("ERC1155ABS", function () {
  const factory = () => deployErc1155Base(this.title);

  shouldBeAccessible(factory)(DEFAULT_ADMIN_ROLE, MINTER_ROLE);

  shouldBase(factory);
  shouldBurnable(factory);
  shouldSupply(factory);

  shouldSupportsInterface(factory)(
    InterfaceId.IERC165,
    InterfaceId.IAccessControl,
    InterfaceId.IERC1155,
    InterfaceId.IERC1155Metadata,
  );
});
