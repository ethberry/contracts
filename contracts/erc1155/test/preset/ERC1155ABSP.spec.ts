import { DEFAULT_ADMIN_ROLE, InterfaceId, MINTER_ROLE, PAUSER_ROLE } from "@gemunion/contracts-constants";
import { shouldBeAccessible, shouldSupportsInterface } from "@gemunion/contracts-mocha";

import { shouldPause } from "../../src/pause";
import { shouldBase } from "../../src/base";
import { shouldBurnable } from "../../src/burnable";
import { shouldSupply } from "../../src/supply";
import { deployErc1155Base } from "../../src/fixtures";

describe("ERC1155ABSP", function () {
  const factory = () => deployErc1155Base(this.title);

  shouldBeAccessible(factory)(DEFAULT_ADMIN_ROLE, MINTER_ROLE, PAUSER_ROLE);

  shouldBase(factory);
  shouldBurnable(factory);
  shouldSupply(factory);
  shouldPause(factory);

  shouldSupportsInterface(factory)(
    InterfaceId.IERC165,
    InterfaceId.IAccessControl,
    InterfaceId.IERC1155,
    InterfaceId.IERC1155Metadata,
  );
});
