import { DEFAULT_ADMIN_ROLE, InterfaceId, MINTER_ROLE } from "@gemunion/contracts-constants";
import { shouldBehaveLikeAccessControl, shouldSupportsInterface } from "@gemunion/contracts-mocha";

import {
  shouldBehaveLikeERC721,
  shouldBehaveLikeERC721Burnable,
  shouldBehaveLikeERC721Enumerable,
  shouldBehaveLikeERC721Royalty,
  shouldBehaveLikeERC721UriStorage,
} from "../../src";
import { deployERC721 } from "../../src/fixtures";
import { shouldBehaveLikeERC721Rentable } from "../../src/user";

describe("ERC721ABERSU", function () {
  const factory = () => deployERC721(this.title);

  shouldBehaveLikeAccessControl(factory)(DEFAULT_ADMIN_ROLE, MINTER_ROLE);

  shouldBehaveLikeERC721(factory);
  shouldBehaveLikeERC721Burnable(factory);
  shouldBehaveLikeERC721Enumerable(factory);
  shouldBehaveLikeERC721Royalty(factory);
  shouldBehaveLikeERC721UriStorage(factory);
  shouldBehaveLikeERC721Rentable(factory);

  shouldSupportsInterface(factory)(
    InterfaceId.IERC165,
    InterfaceId.IAccessControl,
    InterfaceId.IERC721,
    InterfaceId.IERC721Metadata,
    InterfaceId.IERC721Enumerable,
    InterfaceId.IRoyalty,
  );
});
