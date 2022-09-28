import { use } from "chai";
import { solidity } from "ethereum-waffle";

import { shouldERC721Burnable } from "../shared/burnable/basic/burn";
import { shouldERC721Ownable } from "../shared/ownable";
import { shouldERC721Base } from "../shared/base/basic";
import { shouldSupportsInterface } from "../../shared/supportInterface";
import { InterfaceId } from "../../constants";

use(solidity);

describe("ERC721OB", function () {
  const name = "ERC721OB";

  shouldERC721Base(name);
  shouldERC721Ownable(name);
  shouldERC721Burnable(name);

  shouldSupportsInterface(name)(InterfaceId.IERC165, InterfaceId.IERC721, InterfaceId.IERC721Metadata);
});
