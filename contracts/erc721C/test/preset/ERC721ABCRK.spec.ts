import { batchSize, DEFAULT_ADMIN_ROLE, InterfaceId, MINTER_ROLE } from "@gemunion/contracts-constants";
import { shouldBehaveLikeAccessControl, shouldSupportsInterface } from "@gemunion/contracts-mocha";
import {
  shouldBehaveLikeERC721,
  shouldBehaveLikeERC721Burnable,
  shouldBehaveLikeERC721Capped,
  shouldBehaveLikeERC721Royalty,
} from "@gemunion/contracts-erc721";

import { shouldBehaveLikeERC721Consecutive } from "../../src";
import { deployERC721 } from "../../src/fixtures";

describe("ERC721ABCRK", function () {
  const factory = () => deployERC721(this.title);

  shouldBehaveLikeAccessControl(factory)(DEFAULT_ADMIN_ROLE, MINTER_ROLE);

  shouldBehaveLikeERC721(factory, { batchSize });
  shouldBehaveLikeERC721Burnable(factory, { batchSize });
  shouldBehaveLikeERC721Capped(factory, { batchSize });
  shouldBehaveLikeERC721Royalty(factory, { batchSize });
  shouldBehaveLikeERC721Consecutive(factory, { batchSize });

  shouldSupportsInterface(factory)([
    InterfaceId.IERC165,
    InterfaceId.IAccessControl,
    InterfaceId.IERC721,
    InterfaceId.IERC721Metadata,
    InterfaceId.IRoyalty,
  ]);
});
