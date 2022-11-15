import { use } from "chai";
import { solidity } from "ethereum-waffle";

import { InterfaceId } from "@gemunion/contracts-constants";
import { shouldBeOwnable, shouldSupportsInterface } from "@gemunion/contracts-mocha";

import { shouldERC721Burnable } from "../shared/burnable/basic/burn";
import { shouldERC721Base } from "../shared/base/basic";
import { shouldERC721Royalty } from "../shared/royalty/basic";
import { deployErc721Base } from "../shared/fixtures";

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
