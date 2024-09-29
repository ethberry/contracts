import { InterfaceId } from "@ethberry/contracts-constants";
import { shouldBehaveLikeOwnable } from "@ethberry/contracts-access";
import { shouldSupportsInterface } from "@ethberry/contracts-utils";

import { shouldBehaveLikeERC1155, shouldBehaveLikeERC1155Burnable } from "../../src";
import { deployErc1155Base } from "../../src/fixtures";

describe("ERC1155OB", function () {
  const factory = () => deployErc1155Base(this.title);

  shouldBehaveLikeOwnable(factory);

  shouldBehaveLikeERC1155(factory);
  shouldBehaveLikeERC1155Burnable(factory);

  shouldSupportsInterface(factory)([InterfaceId.IERC165, InterfaceId.IERC1155, InterfaceId.IERC1155Metadata]);
});
