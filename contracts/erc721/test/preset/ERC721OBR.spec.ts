import { InterfaceId } from "@ethberry/contracts-constants";
import { shouldBehaveLikeOwnable } from "@ethberry/contracts-access";
import { shouldSupportsInterface } from "@ethberry/contracts-utils";

import { shouldBehaveLikeERC721, shouldBehaveLikeERC721Burnable, shouldBehaveLikeERC721Royalty } from "../../src";
import { deployERC721 } from "../../src/fixtures";

describe("ERC721OBR", function () {
  const factory = () => deployERC721(this.title);

  shouldBehaveLikeOwnable(factory);

  shouldBehaveLikeERC721(factory);
  shouldBehaveLikeERC721Burnable(factory);
  shouldBehaveLikeERC721Royalty(factory);

  shouldSupportsInterface(factory)([
    InterfaceId.IERC165,
    InterfaceId.IERC721,
    InterfaceId.IERC721Metadata,
    InterfaceId.IRoyalty,
  ]);
});
