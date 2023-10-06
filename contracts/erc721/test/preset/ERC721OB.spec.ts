import { InterfaceId } from "@gemunion/contracts-constants";
import { shouldBehaveLikeOwnable } from "@gemunion/contracts-access";
import { shouldSupportsInterface } from "@gemunion/contracts-utils";

import { shouldBehaveLikeERC721, shouldBehaveLikeERC721Burnable } from "../../src";
import { deployERC721 } from "../../src/fixtures";

describe("ERC721OB", function () {
  const factory = () => deployERC721(this.title);

  shouldBehaveLikeOwnable(factory);

  shouldBehaveLikeERC721(factory);
  shouldBehaveLikeERC721Burnable(factory);

  shouldSupportsInterface(factory)([InterfaceId.IERC165, InterfaceId.IERC721, InterfaceId.IERC721Metadata]);
});
