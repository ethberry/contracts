import { use } from "chai";
import { solidity } from "ethereum-waffle";

import { DEFAULT_ADMIN_ROLE, InterfaceId, MINTER_ROLE } from "../../constants";
import { shouldERC721Burnable } from "../shared/burnable/basic/burn";
import { shouldERC721Storage } from "../shared/storage/basic/storage";
import { shouldERC721Capped } from "../shared/capped/basic/capped";
import { shouldERC721Accessible } from "../shared/accessible";
import { shouldERC721Base } from "../shared/base/basic";
import { shouldERC721Royalty } from "../shared/royalty/basic";
import { shouldSupportsInterface } from "../../shared/supportInterface";

use(solidity);

describe("ERC721ABCRS", function () {
  const name = "ERC721ABCRS";

  shouldERC721Base(name);
  shouldERC721Accessible(name)(DEFAULT_ADMIN_ROLE, MINTER_ROLE);
  shouldERC721Burnable(name);
  shouldERC721Capped(name);
  shouldERC721Royalty(name);
  shouldERC721Storage(name);

  shouldSupportsInterface(name)(
    InterfaceId.IERC165,
    InterfaceId.IAccessControl,
    InterfaceId.IERC721,
    InterfaceId.IERC721Metadata,
    InterfaceId.IRoyalty,
  );
});
