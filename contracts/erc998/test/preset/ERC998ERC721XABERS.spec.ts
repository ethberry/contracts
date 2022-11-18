import { use } from "chai";
import { solidity } from "ethereum-waffle";

import { DEFAULT_ADMIN_ROLE, InterfaceId, MINTER_ROLE } from "@gemunion/contracts-constants";
import { shouldBeAccessible, shouldSupportsInterface } from "@gemunion/contracts-mocha";
import {
  shouldERC721Base,
  shouldERC721Burnable,
  shouldERC721Enumerable,
  shouldERC721Royalty,
  shouldERC721Storage,
} from "@gemunion/contracts-erc721";

import { shouldERC998Base } from "../../src/basic";
import { shouldERC998BaseEnumerable } from "../../src/enumerable";
import { deployErc998Base } from "../../src/fixtures";

use(solidity);

describe("ERC998ERC721XABERS", function () {
  const factory = () => deployErc998Base(this.title);

  shouldERC721Base(factory);
  shouldBeAccessible(factory)(DEFAULT_ADMIN_ROLE, MINTER_ROLE);
  shouldERC721Burnable(factory);
  shouldERC721Enumerable(factory);
  shouldERC721Royalty(factory);
  shouldERC721Storage(factory);

  shouldERC998Base(factory);
  shouldERC998BaseEnumerable(factory);

  shouldSupportsInterface(factory)(
    InterfaceId.IERC165,
    InterfaceId.IAccessControl,
    InterfaceId.IERC721,
    InterfaceId.IERC721Metadata,
    InterfaceId.IERC721Enumerable,
    InterfaceId.IERC998TD,
    InterfaceId.IERC998TDEnumerable,
    InterfaceId.IRoyalty,
  );
});
