import { use } from "chai";
import { solidity } from "ethereum-waffle";

import { shouldERC20Base } from "../shared/base";
import { shouldERC20Burnable } from "../shared/burnable";
import { shouldERC20Ownable } from "../shared/ownable";
import { shouldERC20Capped } from "../shared/capped";
import { shouldSupportsInterface } from "../shared/supportInterface";
import { InterfaceId } from "../constants";

use(solidity);

describe("ERC20OBC", function () {
  const name = "ERC20OBC";

  shouldERC20Base(name);
  shouldERC20Ownable(name);
  shouldERC20Burnable(name);
  shouldERC20Capped(name);

  shouldSupportsInterface(name)(InterfaceId.IERC165, InterfaceId.IERC20, InterfaceId.IERC20Metadata);
});
