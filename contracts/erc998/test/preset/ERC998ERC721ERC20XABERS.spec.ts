import { use } from "chai";
import { solidity } from "ethereum-waffle";

import { DEFAULT_ADMIN_ROLE, InterfaceId, MINTER_ROLE } from "@gemunion/contracts-constants";
import { shouldBehaveLikeAccessControl, shouldSupportsInterface } from "@gemunion/contracts-mocha";

import { shouldBehaveLikeERC998, shouldBehaveLikeERC998ERC20 } from "../../src/basic";
import { shouldBehaveLikeERC998ERC20Enumerable } from "../../src";
import { deployERC998 } from "../../src/fixtures";

use(solidity);

describe("ERC998ERC721ERC20XABERS", function () {
  const factory = () => deployERC998(this.title);

  shouldBehaveLikeAccessControl(factory)(DEFAULT_ADMIN_ROLE, MINTER_ROLE);

  shouldBehaveLikeERC998(factory);
  shouldBehaveLikeERC998ERC20(factory);
  shouldBehaveLikeERC998ERC20Enumerable(factory);

  shouldSupportsInterface(factory)(
    InterfaceId.IERC165,
    InterfaceId.IAccessControl,
    InterfaceId.IERC721,
    InterfaceId.IERC721Metadata,
    InterfaceId.IERC721Enumerable,
    InterfaceId.IERC998TD,
    InterfaceId.IERC998TDERC20,
    InterfaceId.IERC998TDERC20Enumerable,
    InterfaceId.IRoyalty,
  );
});
