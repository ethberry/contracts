import { DEFAULT_ADMIN_ROLE, InterfaceId, MINTER_ROLE, PAUSER_ROLE } from "@gemunion/contracts-constants";
import { shouldBeAccessible, shouldSupportsInterface } from "@gemunion/contracts-mocha";

import { shouldERC721Burnable } from "../../src/basic/burnable/burn";
import { shouldERC721Capped } from "../../src/basic/capped/capped";
import { shouldERC721Pause } from "../../src/basic/pausable/pausable";
import { shouldERC721Base } from "../../src/basic/base";
import { deployErc721Base } from "../../src/fixtures";

describe("ERC721ABCP", function () {
  const factory = () => deployErc721Base(this.title);

  shouldERC721Base(factory);
  shouldBeAccessible(factory)(DEFAULT_ADMIN_ROLE, MINTER_ROLE, PAUSER_ROLE);
  shouldERC721Burnable(factory);
  shouldERC721Capped(factory);
  shouldERC721Pause(factory);

  shouldSupportsInterface(factory)(
    InterfaceId.IERC165,
    InterfaceId.IAccessControl,
    InterfaceId.IERC721,
    InterfaceId.IERC721Metadata,
  );
});
