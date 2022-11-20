import { use } from "chai";
import { solidity } from "ethereum-waffle";

import { DEFAULT_ADMIN_ROLE, InterfaceId, MINTER_ROLE } from "@gemunion/contracts-constants";
import { shouldBeAccessible, shouldSupportsInterface } from "@gemunion/contracts-mocha";
import { shouldBase, shouldBurnable, shouldEnumerable, shouldRoyalty, shouldStorage } from "@gemunion/contracts-erc721";

import { shouldERC998Base } from "../../src/basic";
import { shouldERC998BaseEnumerable } from "../../src";
import { deployErc998Base } from "../../src/fixtures";

use(solidity);

describe("ERC998ERC721XABERS", function () {
  const factory = () => deployErc998Base(this.title);

  shouldBeAccessible(factory)(DEFAULT_ADMIN_ROLE, MINTER_ROLE);

  shouldBase(factory);
  shouldBurnable(factory);
  shouldEnumerable(factory);
  shouldRoyalty(factory);
  shouldStorage(factory);

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
