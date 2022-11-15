import { use } from "chai";
import { solidity } from "ethereum-waffle";

import { DEFAULT_ADMIN_ROLE, InterfaceId, MINTER_ROLE } from "@gemunion/contracts-constants";
import { shouldBeAccessible, shouldSupportsInterface } from "@gemunion/contracts-mocha";

import { shouldERC721Base } from "../../ERC721/shared/base/enumerable";
import { shouldERC721Burnable } from "../../ERC721/shared/burnable/enumerable/burn";
import { shouldERC721Enumerable } from "../../ERC721/shared/enumerable";
import { shouldERC721Royalty } from "../../ERC721/shared/royalty/enumerable";
import { shouldERC721Storage } from "../../ERC721/shared/storage/enumerable/storage";
import { shouldERC998Base } from "../shared/base/basic";
import { deployErc998Base } from "../../ERC721/shared/fixtures";

use(solidity);

describe("ERC998ERC721ABERS", function () {
  const factory = () => deployErc998Base(this.title);

  shouldERC721Base(factory);
  shouldBeAccessible(factory)(DEFAULT_ADMIN_ROLE, MINTER_ROLE);
  shouldERC721Burnable(factory);
  shouldERC721Enumerable(factory);
  shouldERC721Royalty(factory);
  shouldERC721Storage(factory);

  shouldERC998Base(factory);

  shouldSupportsInterface(factory)(
    InterfaceId.IERC165,
    InterfaceId.IAccessControl,
    InterfaceId.IERC721,
    InterfaceId.IERC721Metadata,
    InterfaceId.IERC721Enumerable,
    InterfaceId.IERC998TD,
    InterfaceId.IRoyalty,
  );
});
