import { use } from "chai";
import { solidity } from "ethereum-waffle";

import { DEFAULT_ADMIN_ROLE, InterfaceId, MINTER_ROLE } from "@gemunion/contracts-constants";
import { shouldBeAccessible, shouldSupportsInterface } from "@gemunion/contracts-mocha";

import { shouldERC721Burnable } from "../shared/burnable/basic/burn";
import { shouldERC721Storage } from "../shared/storage/basic/storage";
import { shouldERC721Base } from "../shared/base/basic";
import { shouldERC721Royalty } from "../shared/royalty/basic";
import { shouldERC721User } from "../shared/user/basic";
import { deployErc721Base } from "../shared/fixtures";

use(solidity);

describe("ERC721ABRSU", function () {
  const factory = () => deployErc721Base(this.title);

  shouldBeAccessible(factory)(DEFAULT_ADMIN_ROLE, MINTER_ROLE);
  shouldERC721Base(factory);
  shouldERC721Burnable(factory);
  shouldERC721Royalty(factory);
  shouldERC721Storage(factory);
  shouldERC721User(factory);

  shouldSupportsInterface(factory)(
    InterfaceId.IERC165,
    InterfaceId.IAccessControl,
    InterfaceId.IERC721,
    InterfaceId.IERC721Metadata,
    InterfaceId.IRoyalty,
  );
});
