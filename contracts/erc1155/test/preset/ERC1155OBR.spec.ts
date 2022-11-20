import { use } from "chai";
import { solidity } from "ethereum-waffle";

import { InterfaceId } from "@gemunion/contracts-constants";
import { shouldBeOwnable, shouldSupportsInterface } from "@gemunion/contracts-mocha";

import { shouldBase, shouldRoyalty } from "../../src";
import { deployErc1155Base } from "../fixtures";

use(solidity);

describe("ERC1155OBR", function () {
  const factory = () => deployErc1155Base(this.title);

  shouldBeOwnable(factory);

  shouldBase(factory);
  shouldRoyalty(factory);

  shouldSupportsInterface(factory)(
    InterfaceId.IERC165,
    InterfaceId.IERC1155,
    InterfaceId.IERC1155Metadata,
    InterfaceId.IRoyalty,
  );
});
