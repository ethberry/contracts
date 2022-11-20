import { use } from "chai";
import { solidity } from "ethereum-waffle";

import { DEFAULT_ADMIN_ROLE, InterfaceId, MINTER_ROLE } from "@gemunion/contracts-constants";
import { shouldBeAccessible, shouldSupportsInterface } from "@gemunion/contracts-mocha";

import { shouldBurnable } from "../../src/enumerable/burnable/burn";
import { shouldBase } from "../../src/enumerable/base";
import { shouldRoyalty } from "../../src/enumerable/royalty";
import { shouldStorage } from "../../src/enumerable/storage/storage";
import { shouldEnumerable } from "../../src/enumerable/enumerable";
import { deployErc721Base } from "../../src/fixtures";

use(solidity);

describe("ERC721ABERS", function () {
  const factory = () => deployErc721Base(this.title);

  shouldBeAccessible(factory)(DEFAULT_ADMIN_ROLE, MINTER_ROLE);

  shouldBase(factory);
  shouldBurnable(factory);
  shouldEnumerable(factory);
  shouldRoyalty(factory);
  shouldStorage(factory);

  shouldSupportsInterface(factory)(
    InterfaceId.IERC165,
    InterfaceId.IAccessControl,
    InterfaceId.IERC721,
    InterfaceId.IERC721Metadata,
    InterfaceId.IERC721Enumerable,
    InterfaceId.IRoyalty,
  );
});
