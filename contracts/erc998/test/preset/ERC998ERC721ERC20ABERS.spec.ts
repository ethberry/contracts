import { use } from "chai";
import { solidity } from "ethereum-waffle";

import { DEFAULT_ADMIN_ROLE, InterfaceId, MINTER_ROLE } from "@gemunion/contracts-constants";
import { shouldBeAccessible, shouldSupportsInterface } from "@gemunion/contracts-mocha";
import { shouldBase, shouldBurnable, shouldEnumerable, shouldRoyalty, shouldStorage } from "@gemunion/contracts-erc721";

import { shouldERC998Base, shouldERC998ERC20 } from "../../src/basic";
import { deployErc998Base } from "../../src/fixtures";

use(solidity);

describe("ERC998ERC721ERC20ABERS", function () {
  const factory = () => deployErc998Base(this.title);

  shouldBeAccessible(factory)(DEFAULT_ADMIN_ROLE, MINTER_ROLE);

  shouldBase(factory);
  shouldBurnable(factory);
  shouldEnumerable(factory);
  shouldRoyalty(factory);
  shouldStorage(factory);

  shouldERC998Base(factory);
  shouldERC998ERC20(factory);

  shouldSupportsInterface(factory)(
    InterfaceId.IERC165,
    InterfaceId.IAccessControl,
    InterfaceId.IERC721,
    InterfaceId.IERC721Metadata,
    InterfaceId.IERC721Enumerable,
    InterfaceId.IERC998TD,
    InterfaceId.IERC998TDERC20,
    InterfaceId.IRoyalty,
  );
});