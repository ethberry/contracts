import { use } from "chai";
import { solidity } from "ethereum-waffle";

import { DEFAULT_ADMIN_ROLE, InterfaceId, MINTER_ROLE } from "@gemunion/contracts-constants";
import { shouldBeAccessible, shouldSupportsInterface } from "@gemunion/contracts-mocha";

import { shouldBurnable } from "../../src/basic/burnable/burn";
import { shouldStorage } from "../../src/basic/storage/storage";
import { shouldBase } from "../../src/basic/base";
import { shouldRoyalty } from "../../src/basic/royalty";
import { shouldUser } from "../../src/basic/user";
import { deployErc721Base } from "../../src/fixtures";

use(solidity);

describe("ERC721ABRSU", function () {
  const factory = () => deployErc721Base(this.title);

  shouldBeAccessible(factory)(DEFAULT_ADMIN_ROLE, MINTER_ROLE);
  shouldBase(factory);
  shouldBurnable(factory);
  shouldRoyalty(factory);
  shouldStorage(factory);
  shouldUser(factory);

  shouldSupportsInterface(factory)(
    InterfaceId.IERC165,
    InterfaceId.IAccessControl,
    InterfaceId.IERC721,
    InterfaceId.IERC721Metadata,
    InterfaceId.IRoyalty,
  );
});
