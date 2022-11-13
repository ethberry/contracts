import { DEFAULT_ADMIN_ROLE, InterfaceId, MINTER_ROLE } from "@gemunion/contracts-test-constants";

import { shouldERC721Burnable } from "../shared/burnable/enumerable/burn";
import { shouldERC721Capped } from "../shared/capped/enumerable/capped";
import { shouldERC721Pause } from "../shared/pausable/enumerable/pausable";
import { shouldERC721Accessible } from "../shared/accessible";
import { shouldERC721Base } from "../shared/base/enumerable";
import { shouldERC721Enumerable } from "../shared/enumerable";
import { shouldSupportsInterface } from "../shared/supportInterface";

describe("ERC721ABCEP", function () {
  const name = "ERC721ABCEP";

  shouldERC721Base(name);
  shouldERC721Accessible(name)(DEFAULT_ADMIN_ROLE, MINTER_ROLE);
  shouldERC721Burnable(name);
  shouldERC721Capped(name);
  shouldERC721Enumerable(name);
  shouldERC721Pause(name);

  shouldSupportsInterface(name)(
    InterfaceId.IERC165,
    InterfaceId.IAccessControl,
    InterfaceId.IERC721,
    InterfaceId.IERC721Metadata,
    InterfaceId.IERC721Enumerable,
  );
});
