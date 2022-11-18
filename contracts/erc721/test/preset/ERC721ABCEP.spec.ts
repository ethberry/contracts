import { DEFAULT_ADMIN_ROLE, InterfaceId, MINTER_ROLE } from "@gemunion/contracts-constants";
import { shouldBeAccessible, shouldSupportsInterface } from "@gemunion/contracts-mocha";

import { shouldERC721Burnable } from "../../src/enumerable/burnable/burn";
import { shouldERC721Capped } from "../../src/enumerable/capped/capped";
import { shouldERC721Pause } from "../../src/enumerable/pausable/pausable";
import { shouldERC721Base } from "../../src/enumerable/base";
import { shouldERC721Enumerable } from "../../src/enumerable/enumerable";
import { deployErc721Base } from "../../src/fixtures";

describe("ERC721ABCEP", function () {
  const factory = () => deployErc721Base(this.title);

  shouldBeAccessible(factory)(DEFAULT_ADMIN_ROLE, MINTER_ROLE);

  shouldERC721Base(factory);
  shouldERC721Burnable(factory);
  shouldERC721Capped(factory);
  shouldERC721Enumerable(factory);
  shouldERC721Pause(factory);

  shouldSupportsInterface(factory)(
    InterfaceId.IERC165,
    InterfaceId.IAccessControl,
    InterfaceId.IERC721,
    InterfaceId.IERC721Metadata,
    InterfaceId.IERC721Enumerable,
  );
});
