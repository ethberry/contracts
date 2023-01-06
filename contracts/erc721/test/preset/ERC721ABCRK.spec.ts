import { use } from "chai";
import { solidity } from "ethereum-waffle";

import { DEFAULT_ADMIN_ROLE, InterfaceId, MINTER_ROLE, tokenInitialAmount } from "@gemunion/contracts-constants";
import { shouldBehaveLikeAccessControl, shouldSupportsInterface } from "@gemunion/contracts-mocha";

import {
  shouldBehaveLikeERC721,
  shouldBehaveLikeERC721Burnable,
  shouldBehaveLikeERC721Capped,
  shouldBehaveLikeERC721Consecutive,
  shouldBehaveLikeERC721Royalty,
} from "../../src";
import { deployERC721 } from "../../src/fixtures";

use(solidity);

describe("ERC721ABCRK", function () {
  const factory = () => deployERC721(this.title);

  shouldBehaveLikeAccessControl(factory)(DEFAULT_ADMIN_ROLE, MINTER_ROLE);

  shouldBehaveLikeERC721(factory, { initialBalance: tokenInitialAmount });
  shouldBehaveLikeERC721Burnable(factory, { initialBalance: tokenInitialAmount });
  shouldBehaveLikeERC721Capped(factory, { initialBalance: tokenInitialAmount });
  shouldBehaveLikeERC721Royalty(factory, { initialBalance: tokenInitialAmount });
  shouldBehaveLikeERC721Consecutive(factory, { initialBalance: tokenInitialAmount });

  shouldSupportsInterface(factory)(
    InterfaceId.IERC165,
    InterfaceId.IAccessControl,
    InterfaceId.IERC721,
    InterfaceId.IERC721Metadata,
    InterfaceId.IRoyalty,
  );
});
