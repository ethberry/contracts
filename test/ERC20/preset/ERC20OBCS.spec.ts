import { use } from "chai";
import { solidity } from "ethereum-waffle";

import { shouldSnapshot } from "../shared/snapshot";
import { shouldERC20Base } from "../shared/base";
import { shouldERC20Burnable } from "../shared/burnable";
import { shouldERC20Ownable } from "../shared/ownable";
import { shouldERC20Capped } from "../shared/capped";
import { shouldSupportsInterface } from "../../shared/supportInterface";
import { InterfaceId } from "../../constants";

use(solidity);

describe("ERC20OBCS", function () {
  const name = "ERC20OBCS";

  shouldERC20Base(name);
  shouldERC20Ownable(name);
  shouldERC20Burnable(name);
  shouldERC20Capped(name);
  shouldSnapshot(name);

  shouldSupportsInterface(name)(InterfaceId.IERC165, InterfaceId.IERC20, InterfaceId.IERC20Metadata);
});
