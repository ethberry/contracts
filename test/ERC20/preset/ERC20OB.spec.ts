import { use } from "chai";
import { solidity } from "ethereum-waffle";

import { shouldERC20Base } from "../shared/base";
import { shouldERC20Burnable } from "../shared/burnable";
import { shouldERC20Ownable } from "../shared/ownable";
import { shouldSupportsInterface } from "../../shared/supportInterface";
import { InterfaceId } from "../../constants";

use(solidity);

describe("ERC20OB", function () {
  const name = "ERC20OB";

  shouldERC20Base(name);
  shouldERC20Ownable(name);
  shouldERC20Burnable(name);

  shouldSupportsInterface(name)(InterfaceId.IERC165, InterfaceId.IERC20, InterfaceId.IERC20Metadata);
});
