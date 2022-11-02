import { use } from "chai";
import { solidity } from "ethereum-waffle";

import { DEFAULT_ADMIN_ROLE, InterfaceId, MINTER_ROLE } from "../constants";
import { shouldERC721Burnable } from "../shared/burnable/enumerable/burn";
import { shouldERC721Capped } from "../shared/capped/enumerable/capped";
import { shouldERC721Accessible } from "../shared/accessible";
import { shouldERC721Base } from "../shared/base/enumerable";
import { shouldERC721Enumerable } from "../shared/enumerable";
import { shouldSupportsInterface } from "../shared/supportInterface";

use(solidity);

describe("ERC721ABCE", function () {
  const name = "ERC721ABCE";

  shouldERC721Base(name);
  shouldERC721Accessible(name)(DEFAULT_ADMIN_ROLE, MINTER_ROLE);
  shouldERC721Burnable(name);
  shouldERC721Capped(name);
  shouldERC721Enumerable(name);

  shouldSupportsInterface(name)(
    InterfaceId.IERC165,
    InterfaceId.IAccessControl,
    InterfaceId.IERC721,
    InterfaceId.IERC721Metadata,
    InterfaceId.IERC721Enumerable,
  );
});