import { use } from "chai";
import { solidity } from "ethereum-waffle";

import { DEFAULT_ADMIN_ROLE, InterfaceId, MINTER_ROLE } from "../../constants";
import { shouldERC20Base } from "../shared/base";
import { shouldERC20Burnable } from "../shared/burnable";
import { shouldERC20Accessible } from "../shared/accessible";
import { shouldSupportsInterface } from "../../shared/supportInterface";

use(solidity);

describe("ERC20AB", function () {
  const name = "ERC20AB";

  shouldERC20Base(name);
  shouldERC20Accessible(name)(DEFAULT_ADMIN_ROLE, MINTER_ROLE);
  shouldERC20Burnable(name);

  shouldSupportsInterface(name)(
    InterfaceId.IERC165,
    InterfaceId.IAccessControl,
    InterfaceId.IERC20,
    InterfaceId.IERC20Metadata,
  );
});
