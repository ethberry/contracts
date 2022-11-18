import { use } from "chai";
import { solidity } from "ethereum-waffle";

import { DEFAULT_ADMIN_ROLE, InterfaceId, MINTER_ROLE } from "@gemunion/contracts-constants";
import { shouldBeAccessible, shouldSupportsInterface } from "@gemunion/contracts-mocha";

import { shouldERC721Burnable } from "../../src/basic/burnable/burn";
import { shouldERC721Capped } from "../../src/basic/capped/capped";
import { shouldERC721Base } from "../../src/basic/base";
import { shouldERC721Royalty } from "../../src/basic/royalty";
import { deployErc721Base } from "../../src/fixtures";

use(solidity);

describe("ERC721ABCR", function () {
  const factory = () => deployErc721Base(this.title);

  shouldBeAccessible(factory)(DEFAULT_ADMIN_ROLE, MINTER_ROLE);

  shouldERC721Base(factory);
  shouldERC721Burnable(factory);
  shouldERC721Capped(factory);
  shouldERC721Royalty(factory);

  shouldSupportsInterface(factory)(
    InterfaceId.IERC165,
    InterfaceId.IAccessControl,
    InterfaceId.IERC721,
    InterfaceId.IERC721Metadata,
    InterfaceId.IRoyalty,
  );
});
