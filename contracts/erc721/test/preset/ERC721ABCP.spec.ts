import { DEFAULT_ADMIN_ROLE, InterfaceId, MINTER_ROLE, PAUSER_ROLE } from "@gemunion/contracts-constants";
import { shouldBeAccessible, shouldSupportsInterface } from "@gemunion/contracts-mocha";

import { shouldBurnable } from "../../src/basic/burnable/burn";
import { shouldCapped } from "../../src/basic/capped/capped";
import { shouldPause } from "../../src/basic/pausable/pausable";
import { shouldBase } from "../../src/basic/base";
import { deployErc721Base } from "../../src/fixtures";

describe("ERC721ABCP", function () {
  const factory = () => deployErc721Base(this.title);

  shouldBase(factory);
  shouldBeAccessible(factory)(DEFAULT_ADMIN_ROLE, MINTER_ROLE, PAUSER_ROLE);
  shouldBurnable(factory);
  shouldCapped(factory);
  shouldPause(factory);

  shouldSupportsInterface(factory)(
    InterfaceId.IERC165,
    InterfaceId.IAccessControl,
    InterfaceId.IERC721,
    InterfaceId.IERC721Metadata,
  );
});
