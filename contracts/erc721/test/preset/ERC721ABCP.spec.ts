import { DEFAULT_ADMIN_ROLE, InterfaceId, MINTER_ROLE, PAUSER_ROLE } from "../constants";
import { shouldERC721Burnable } from "../shared/burnable/basic/burn";
import { shouldERC721Capped } from "../shared/capped/basic/capped";
import { shouldERC721Pause } from "../shared/pausable/basic/pausable";
import { shouldERC721Accessible } from "../shared/accessible";
import { shouldERC721Base } from "../shared/base/basic";
import { shouldSupportsInterface } from "../shared/supportInterface";

describe("ERC721ABCP", function () {
  const name = "ERC721ABCP";

  shouldERC721Base(name);
  shouldERC721Accessible(name)(DEFAULT_ADMIN_ROLE, MINTER_ROLE, PAUSER_ROLE);
  shouldERC721Burnable(name);
  shouldERC721Capped(name);
  shouldERC721Pause(name);

  shouldSupportsInterface(name)(
    InterfaceId.IERC165,
    InterfaceId.IAccessControl,
    InterfaceId.IERC721,
    InterfaceId.IERC721Metadata,
  );
});
