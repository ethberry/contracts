import { InterfaceId } from "@gemunion/contracts-constants";
import { shouldBehaveLikeOwnable } from "@gemunion/contracts-access";
import { shouldSupportsInterface } from "@gemunion/contracts-utils";

import { shouldBehaveLikeERC1155, shouldBehaveLikeERC1155Royalty } from "../../src";
import { deployErc1155Base } from "../../src/fixtures";

describe("ERC1155OBR", function () {
  const factory = () => deployErc1155Base(this.title);

  shouldBehaveLikeOwnable(factory);

  shouldBehaveLikeERC1155(factory);
  shouldBehaveLikeERC1155Royalty(factory);

  shouldSupportsInterface(factory)([
    InterfaceId.IERC165,
    InterfaceId.IERC1155,
    InterfaceId.IERC1155Metadata,
    InterfaceId.IRoyalty,
  ]);
});
