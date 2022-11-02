import { DEFAULT_ADMIN_ROLE, InterfaceId, MINTER_ROLE, PAUSER_ROLE } from "../constants";
import { shouldERC1155Pause } from "../shared/pause";
import { shouldERC1155Base } from "../shared/base";
import { shouldERC1155Accessible } from "../shared/accessible";
import { shouldERC1155Burnable } from "../shared/burnable";
import { shouldERC1155Supply } from "../shared/supply";
import { shouldSupportsInterface } from "../shared/supportInterface";

describe("ERC1155ABSP", function () {
  const name = "ERC1155ABSP";

  shouldERC1155Base(name);
  shouldERC1155Accessible(name)(DEFAULT_ADMIN_ROLE, MINTER_ROLE, PAUSER_ROLE);
  shouldERC1155Burnable(name);
  shouldERC1155Supply(name);
  shouldERC1155Pause(name);

  shouldSupportsInterface(name)(
    InterfaceId.IERC165,
    InterfaceId.IAccessControl,
    InterfaceId.IERC1155,
    InterfaceId.IERC1155Metadata,
  );
});
