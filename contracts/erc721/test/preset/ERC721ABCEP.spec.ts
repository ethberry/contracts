import { DEFAULT_ADMIN_ROLE, InterfaceId, MINTER_ROLE } from "@gemunion/contracts-constants";
import { shouldBeAccessible, shouldSupportsInterface } from "@gemunion/contracts-mocha";

import { shouldBurnable } from "../../src/enumerable/burnable/burn";
import { shouldCapped } from "../../src/enumerable/capped/capped";
import { shouldPause } from "../../src/enumerable/pausable/pausable";
import { shouldBase } from "../../src/enumerable/base";
import { shouldEnumerable } from "../../src/enumerable/enumerable";
import { deployErc721Base } from "../../src/fixtures";

describe("ERC721ABCEP", function () {
  const factory = () => deployErc721Base(this.title);

  shouldBeAccessible(factory)(DEFAULT_ADMIN_ROLE, MINTER_ROLE);

  shouldBase(factory);
  shouldBurnable(factory);
  shouldCapped(factory);
  shouldEnumerable(factory);
  shouldPause(factory);

  shouldSupportsInterface(factory)(
    InterfaceId.IERC165,
    InterfaceId.IAccessControl,
    InterfaceId.IERC721,
    InterfaceId.IERC721Metadata,
    InterfaceId.IERC721Enumerable,
  );
});
