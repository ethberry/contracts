import { use } from "chai";
import { solidity } from "ethereum-waffle";

import { InterfaceId } from "@gemunion/contracts-constants";
import { shouldBeOwnable, shouldSupportsInterface } from "@gemunion/contracts-mocha";

import { shouldBase, shouldBurnable } from "../../src";
import { deployErc1155Base } from "../../src/fixtures";

use(solidity);

describe("ERC1155OB", function () {
  const factory = () => deployErc1155Base(this.title);

  shouldBeOwnable(factory);

  shouldBase(factory);
  shouldBurnable(factory);

  shouldSupportsInterface(factory)(InterfaceId.IERC165, InterfaceId.IERC1155, InterfaceId.IERC1155Metadata);
});
