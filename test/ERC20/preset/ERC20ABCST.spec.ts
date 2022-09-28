import { use } from "chai";
import { solidity } from "ethereum-waffle";

import { DEFAULT_ADMIN_ROLE, InterfaceId, MINTER_ROLE, SNAPSHOT_ROLE } from "../../constants";
import { shouldSnapshot } from "../shared/snapshot";
import { shouldERC20Permit } from "../shared/permit";
import { shouldERC20Base } from "../shared/base";
import { shouldERC20Burnable } from "../shared/burnable";
import { shouldERC20Accessible } from "../shared/accessible";
import { shouldERC20Capped } from "../shared/capped";
import { shouldSupportsInterface } from "../../shared/supportInterface";

use(solidity);

describe("ERC20ABCST", function () {
  const name = "ERC20ABCST";

  shouldERC20Base(name);
  shouldERC20Accessible(name)(DEFAULT_ADMIN_ROLE, MINTER_ROLE, SNAPSHOT_ROLE);
  shouldERC20Burnable(name);
  shouldERC20Capped(name);
  shouldSnapshot(name);
  shouldERC20Permit(name);

  shouldSupportsInterface(name)(
    InterfaceId.IERC165,
    InterfaceId.IAccessControl,
    InterfaceId.IERC20,
    InterfaceId.IERC20Metadata,
  );
});
