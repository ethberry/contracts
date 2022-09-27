import { expect } from "chai";
import { DEFAULT_ADMIN_ROLE, MINTER_ROLE, PAUSER_ROLE } from "../../constants";
import { shouldERC1155Pause } from "../shared/pause";
import { shouldERC1155Base } from "../shared/base";
import { shouldERC1155Accessible } from "../shared/accessible";
import { shouldERC1155Burnable } from "../shared/burnable";
import { shouldERC1155Supply } from "../shared/supply";
import { deployErc1155Base } from "../shared/fixtures";

describe("ERC1155ABSP", function () {
  const name = "ERC1155ABSP";

  shouldERC1155Base(name);
  shouldERC1155Accessible(name)(DEFAULT_ADMIN_ROLE, MINTER_ROLE, PAUSER_ROLE);
  shouldERC1155Burnable(name);
  shouldERC1155Supply(name);
  shouldERC1155Pause(name);

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