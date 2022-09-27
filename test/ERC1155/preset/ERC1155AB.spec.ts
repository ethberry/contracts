import { expect, use } from "chai";
import { solidity } from "ethereum-waffle";

import { DEFAULT_ADMIN_ROLE, MINTER_ROLE } from "../../constants";
import { shouldERC1155Accessible } from "../shared/accessible";
import { shouldERC1155Base } from "../shared/base";
import { shouldERC1155Burnable } from "../shared/burnable";
import { deployErc1155Base } from "../shared/fixtures";

use(solidity);

describe("ERC1155AB", function () {
  const name = "ERC1155AB";

  shouldERC1155Base(name);
  shouldERC1155Accessible(name)(DEFAULT_ADMIN_ROLE, MINTER_ROLE);
  shouldERC1155Burnable(name);

  describe("supportsInterface", function () {
    it("should support all interfaces", async function () {
      const { contractInstance } = await deployErc1155Base(name);

      const supportsIERC1155 = await contractInstance.supportsInterface("0xd9b67a26");
      expect(supportsIERC1155).to.equal(true);
      const supportsIERC1155MetadataURI = await contractInstance.supportsInterface("0x0e89341c");
      expect(supportsIERC1155MetadataURI).to.equal(true);
      const supportsIERC165 = await contractInstance.supportsInterface("0x01ffc9a7");
      expect(supportsIERC165).to.equal(true);
      const supportsIAccessControl = await contractInstance.supportsInterface("0x7965db0b");
      expect(supportsIAccessControl).to.equal(true);
      const supportsInvalidInterface = await contractInstance.supportsInterface("0xffffffff");
      expect(supportsInvalidInterface).to.equal(false);
    });
  });
});
