import { use } from "chai";
import { solidity } from "ethereum-waffle";

import { DEFAULT_ADMIN_ROLE, InterfaceId, MINTER_ROLE } from "@gemunion/contracts-test-constants";

import { shouldERC20Base } from "../shared/base";
import { shouldERC20Accessible } from "../shared/accessible";
import { shouldERC20Flash } from "../shared/flash";
import { shouldSupportsInterface } from "../shared/supportInterface";

use(solidity);

describe("ERC20AF", function () {
  const name = "ERC20AF";

  shouldERC20Base(name);
  shouldERC20Accessible(name)(DEFAULT_ADMIN_ROLE, MINTER_ROLE);
  shouldERC20Flash(name);

  shouldSupportsInterface(name)(
    InterfaceId.IERC165,
    InterfaceId.IAccessControl,
    InterfaceId.IERC20,
    InterfaceId.IERC20Metadata,
  );
});
