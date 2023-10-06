import { DEFAULT_ADMIN_ROLE, InterfaceId, MINTER_ROLE } from "@gemunion/contracts-constants";
import { shouldBehaveLikeAccessControl } from "@gemunion/contracts-access";
import { shouldSupportsInterface } from "@gemunion/contracts-utils";

import { shouldBehaveLikeERC1155, shouldBehaveLikeERC1155Burnable, shouldBehaveLikeERC1155Capped } from "../../src";
import { deployErc1155Base } from "../../src/fixtures";

describe("ERC1155ABC", function () {
  const factory = () => deployErc1155Base(this.title);

  shouldBehaveLikeAccessControl(factory)(DEFAULT_ADMIN_ROLE, MINTER_ROLE);

  shouldBehaveLikeERC1155(factory);
  shouldBehaveLikeERC1155Burnable(factory);
  shouldBehaveLikeERC1155Capped(factory);

  shouldSupportsInterface(factory)([
    InterfaceId.IERC165,
    InterfaceId.IAccessControl,
    InterfaceId.IERC1155,
    InterfaceId.IERC1155Metadata,
  ]);
});
