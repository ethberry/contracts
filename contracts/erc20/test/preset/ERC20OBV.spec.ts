import { InterfaceId } from "@gemunion/contracts-constants";
import { shouldBehaveLikeOwnable, shouldSupportsInterface } from "@gemunion/contracts-mocha";

import { shouldBehaveLikeERC20, shouldBehaveLikeERC20Burnable, shouldBehaveLikeERC20Permit } from "../../src";
import { deployERC20 } from "../../src/fixtures";
import { shouldBehaveLikeERC20Vote } from "../../src/vote";

describe("ERC20OBV", function () {
  const factory = () => deployERC20(this.title);

  shouldBehaveLikeOwnable(factory);

  shouldBehaveLikeERC20(factory);
  shouldBehaveLikeERC20Burnable(factory);
  shouldBehaveLikeERC20Permit(factory);
  shouldBehaveLikeERC20Vote(factory);

  shouldSupportsInterface(factory)([
    InterfaceId.IERC165,
    InterfaceId.IERC20,
    InterfaceId.IERC20Metadata,
    InterfaceId.IERC1363,
    InterfaceId.IVotes,
    InterfaceId.IERC5267,
    InterfaceId.IERC6372,
  ]);
});
