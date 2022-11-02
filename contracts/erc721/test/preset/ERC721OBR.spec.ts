import { use } from "chai";
import { solidity } from "ethereum-waffle";

import { shouldERC721Burnable } from "../shared/burnable/basic/burn";
import { shouldERC721Ownable } from "../shared/ownable";
import { shouldERC721Base } from "../shared/base/basic";
import { shouldERC721Royalty } from "../shared/royalty/basic";
import { shouldSupportsInterface } from "../shared/supportInterface";
import { InterfaceId } from "../constants";

use(solidity);

describe("ERC721OBR", function () {
  const name = "ERC721OBR";

  shouldERC721Base(name);
  shouldERC721Ownable(name);
  shouldERC721Burnable(name);
  shouldERC721Royalty(name);

  shouldSupportsInterface(name)(
    InterfaceId.IERC165,
    InterfaceId.IERC721,
    InterfaceId.IERC721Metadata,
    InterfaceId.IRoyalty,
  );
});
