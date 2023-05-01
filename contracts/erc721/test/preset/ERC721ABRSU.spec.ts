import { DEFAULT_ADMIN_ROLE, InterfaceId, MINTER_ROLE } from "@gemunion/contracts-constants";
import { shouldBehaveLikeAccessControl, shouldSupportsInterface } from "@gemunion/contracts-mocha";

import {
  shouldBehaveLikeERC721,
  shouldBehaveLikeERC721Burnable,
  shouldBehaveLikeERC721Royalty,
  shouldBehaveLikeERC721UriStorage,
  shouldBehaveLikeERC721Rentable,
} from "../../src";
import { deployERC721 } from "../../src/fixtures";

describe("ERC721ABRSU", function () {
  const factory = () => deployERC721(this.title);

  shouldBehaveLikeAccessControl(factory)(DEFAULT_ADMIN_ROLE, MINTER_ROLE);
  shouldBehaveLikeERC721(factory);
  shouldBehaveLikeERC721Burnable(factory);
  shouldBehaveLikeERC721Royalty(factory);
  shouldBehaveLikeERC721UriStorage(factory);
  shouldBehaveLikeERC721Rentable(factory);

  shouldSupportsInterface(factory)([
    InterfaceId.IERC165,
    InterfaceId.IAccessControl,
    InterfaceId.IERC721,
    InterfaceId.IERC721Metadata,
    InterfaceId.IRoyalty,
  ]);
});
