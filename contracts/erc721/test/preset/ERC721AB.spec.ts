import { use } from "chai";
import { solidity } from "ethereum-waffle";

import { DEFAULT_ADMIN_ROLE, InterfaceId, MINTER_ROLE } from "../constants";
import { shouldERC721Burnable } from "../shared/burnable/basic/burn";
import { shouldERC721Accessible } from "../shared/accessible";
import { shouldERC721Base } from "../shared/base/basic";
import { shouldSupportsInterface } from "../shared/supportInterface";

use(solidity);

describe("ERC721AB", function () {
  const name = "ERC721AB";

  shouldERC721Base(name);
  shouldERC721Accessible(name)(DEFAULT_ADMIN_ROLE, MINTER_ROLE);
  shouldERC721Burnable(name);

  shouldSupportsInterface(name)(
    InterfaceId.IERC165,
    InterfaceId.IAccessControl,
    InterfaceId.IERC721,
    InterfaceId.IERC721Metadata,
  );
});
