import { DEFAULT_ADMIN_ROLE, InterfaceId, MINTER_ROLE } from "@gemunion/contracts-constants";
import { shouldBeAccessible, shouldSupportsInterface } from "@gemunion/contracts-mocha";

import { shouldERC1155Base } from "../shared/base";
import { shouldERC1155Burnable } from "../shared/burnable";
import { shouldERC1155Supply } from "../shared/supply";
import { shouldERC1155Capped } from "../shared/capped";
import { deployErc1155Base } from "../shared/fixtures";

describe("ERC1155ABSC", function () {
  const factory = () => deployErc1155Base(this.title);

  shouldERC1155Base(factory);
  shouldBeAccessible(factory)(DEFAULT_ADMIN_ROLE, MINTER_ROLE);
  shouldERC1155Burnable(factory);
  shouldERC1155Supply(factory);
  shouldERC1155Capped(factory);

  shouldSupportsInterface(factory)(
    InterfaceId.IERC165,
    InterfaceId.IAccessControl,
    InterfaceId.IERC1155,
    InterfaceId.IERC1155Metadata,
  );
});
