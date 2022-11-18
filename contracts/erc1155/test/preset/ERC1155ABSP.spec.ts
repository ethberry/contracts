import { DEFAULT_ADMIN_ROLE, InterfaceId, MINTER_ROLE, PAUSER_ROLE } from "@gemunion/contracts-constants";
import { shouldBeAccessible, shouldSupportsInterface } from "@gemunion/contracts-mocha";

import { shouldERC1155Pause } from "../../src/pause";
import { shouldERC1155Base } from "../../src/base";
import { shouldERC1155Burnable } from "../../src/burnable";
import { shouldERC1155Supply } from "../../src/supply";
import { deployErc1155Base } from "../../src/fixtures";

describe("ERC1155ABSP", function () {
  const factory = () => deployErc1155Base(this.title);

  shouldERC1155Base(factory);
  shouldBeAccessible(factory)(DEFAULT_ADMIN_ROLE, MINTER_ROLE, PAUSER_ROLE);
  shouldERC1155Burnable(factory);
  shouldERC1155Supply(factory);
  shouldERC1155Pause(factory);

  shouldSupportsInterface(factory)(
    InterfaceId.IERC165,
    InterfaceId.IAccessControl,
    InterfaceId.IERC1155,
    InterfaceId.IERC1155Metadata,
  );
});
