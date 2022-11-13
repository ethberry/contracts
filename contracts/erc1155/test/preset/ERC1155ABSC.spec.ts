import { DEFAULT_ADMIN_ROLE, InterfaceId, MINTER_ROLE } from "@gemunion/contracts-test-constants";

import { shouldERC1155Base } from "../shared/base";
import { shouldERC1155Accessible } from "../shared/accessible";
import { shouldERC1155Burnable } from "../shared/burnable";
import { shouldERC1155Supply } from "../shared/supply";
import { shouldERC1155Capped } from "../shared/capped";
import { shouldSupportsInterface } from "../shared/supportInterface";

describe("ERC1155ABSC", function () {
  const name = "ERC1155ABSC";

  shouldERC1155Base(name);
  shouldERC1155Accessible(name)(DEFAULT_ADMIN_ROLE, MINTER_ROLE);
  shouldERC1155Burnable(name);
  shouldERC1155Supply(name);
  shouldERC1155Capped(name);

  shouldSupportsInterface(name)(
    InterfaceId.IERC165,
    InterfaceId.IAccessControl,
    InterfaceId.IERC1155,
    InterfaceId.IERC1155Metadata,
  );
});
