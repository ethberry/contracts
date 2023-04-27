import { DEFAULT_ADMIN_ROLE, InterfaceId, MINTER_ROLE, batchSize } from "@gemunion/contracts-constants";
import { shouldBehaveLikeAccessControl, shouldSupportsInterface } from "@gemunion/contracts-mocha";

import {
  shouldBehaveLikeERC721,
  shouldBehaveLikeERC721Burnable,
  shouldBehaveLikeERC721Capped,
  shouldBehaveLikeERC721Consecutive,
  shouldBehaveLikeERC721Royalty,
} from "../../src";
import { deployERC721 } from "../../src/fixtures";

describe("ERC721ABCRK", function () {
  const factory = () => deployERC721(this.title);

  shouldBehaveLikeAccessControl(factory)(DEFAULT_ADMIN_ROLE, MINTER_ROLE);

  shouldBehaveLikeERC721(factory, undefined, { batchSize });
  shouldBehaveLikeERC721Burnable(factory, undefined, { batchSize });
  shouldBehaveLikeERC721Capped(factory, undefined, { batchSize });
  shouldBehaveLikeERC721Royalty(factory, undefined, { batchSize });
  shouldBehaveLikeERC721Consecutive(factory, { batchSize });

  shouldSupportsInterface(factory)(
    InterfaceId.IERC165,
    InterfaceId.IAccessControl,
    InterfaceId.IERC721,
    InterfaceId.IERC721Metadata,
    InterfaceId.IRoyalty,
  );
});
