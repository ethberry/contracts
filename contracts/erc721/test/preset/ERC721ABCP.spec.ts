import { DEFAULT_ADMIN_ROLE, InterfaceId, MINTER_ROLE, PAUSER_ROLE } from "@ethberry/contracts-constants";
import { shouldBehaveLikeAccessControl } from "@ethberry/contracts-access";
import { shouldSupportsInterface } from "@ethberry/contracts-utils";

import {
  shouldBehaveLikeERC721,
  shouldBehaveLikeERC721Burnable,
  shouldBehaveLikeERC721Capped,
  shouldBehaveLikeERC721Pausable,
} from "../../src";
import { deployERC721 } from "../../src/fixtures";

describe("ERC721ABCP", function () {
  const factory = () => deployERC721(this.title);

  shouldBehaveLikeAccessControl(factory)(DEFAULT_ADMIN_ROLE, MINTER_ROLE, PAUSER_ROLE);

  shouldBehaveLikeERC721(factory);
  shouldBehaveLikeERC721Burnable(factory);
  shouldBehaveLikeERC721Capped(factory);
  shouldBehaveLikeERC721Pausable(factory);

  shouldSupportsInterface(factory)([
    InterfaceId.IERC165,
    InterfaceId.IAccessControl,
    InterfaceId.IERC721,
    InterfaceId.IERC721Metadata,
  ]);
});
