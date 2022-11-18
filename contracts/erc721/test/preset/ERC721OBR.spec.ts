import { use } from "chai";
import { solidity } from "ethereum-waffle";

import { InterfaceId } from "@gemunion/contracts-constants";
import { shouldBeOwnable, shouldSupportsInterface } from "@gemunion/contracts-mocha";

import { shouldERC721Burnable } from "../../src/basic/burnable/burn";
import { shouldERC721Base } from "../../src/basic/base";
import { shouldERC721Royalty } from "../../src/basic/royalty";
import { deployErc721Base } from "../../src/fixtures";

use(solidity);

describe("ERC721OBR", function () {
  const factory = () => deployErc721Base(this.title);

  shouldBeOwnable(factory);

  shouldERC721Base(factory);
  shouldERC721Burnable(factory);
  shouldERC721Royalty(factory);

  shouldSupportsInterface(factory)(
    InterfaceId.IERC165,
    InterfaceId.IERC721,
    InterfaceId.IERC721Metadata,
    InterfaceId.IRoyalty,
  );
});
