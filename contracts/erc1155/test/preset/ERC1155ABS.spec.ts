import { use } from "chai";
import { solidity } from "ethereum-waffle";

import { DEFAULT_ADMIN_ROLE, InterfaceId, MINTER_ROLE } from "@gemunion/contracts-test-constants";

import { shouldERC1155Accessible } from "../shared/accessible";
import { shouldERC1155Base } from "../shared/base";
import { shouldERC1155Supply } from "../shared/supply";
import { shouldERC1155Burnable } from "../shared/burnable";
import { shouldSupportsInterface } from "../shared/supportInterface";

use(solidity);

describe("ERC1155ABS", function () {
  const name = "ERC1155ABS";

  shouldERC1155Base(name);
  shouldERC1155Accessible(name)(DEFAULT_ADMIN_ROLE, MINTER_ROLE);
  shouldERC1155Burnable(name);
  shouldERC1155Supply(name);

  shouldSupportsInterface(name)(
    InterfaceId.IERC165,
    InterfaceId.IAccessControl,
    InterfaceId.IERC1155,
    InterfaceId.IERC1155Metadata,
  );
});
