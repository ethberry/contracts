import { use } from "chai";
import { solidity } from "ethereum-waffle";

import { InterfaceId } from "@gemunion/contracts-constants";
import { shouldBehaveLikeOwnable, shouldSupportsInterface } from "@gemunion/contracts-mocha";

import { shouldBehaveLikeERC721, shouldBehaveLikeERC721Burnable, shouldBehaveLikeERC721Royalty } from "../../src/basic";
import { deployERC721 } from "../../src/fixtures";

use(solidity);

describe("ERC721OBR", function () {
  const factory = () => deployERC721(this.title);

  shouldBehaveLikeOwnable(factory);

  shouldBehaveLikeERC721(factory);
  shouldBehaveLikeERC721Burnable(factory);
  shouldBehaveLikeERC721Royalty(factory);

  shouldSupportsInterface(factory)(
    InterfaceId.IERC165,
    InterfaceId.IERC721,
    InterfaceId.IERC721Metadata,
    InterfaceId.IRoyalty,
  );
});
