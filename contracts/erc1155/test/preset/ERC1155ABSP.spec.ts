import { DEFAULT_ADMIN_ROLE, InterfaceId, MINTER_ROLE, PAUSER_ROLE } from "@gemunion/contracts-constants";
import { shouldBeAccessible, shouldSupportsInterface } from "@gemunion/contracts-mocha";

import { shouldERC1155Pause } from "../shared/pause";
import { shouldERC1155Base } from "../shared/base";
import { shouldERC1155Burnable } from "../shared/burnable";
import { shouldERC1155Supply } from "../shared/supply";
import { deployErc1155Base } from "../shared/fixtures";

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
