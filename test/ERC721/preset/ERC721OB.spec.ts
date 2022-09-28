import { expect, use } from "chai";
import { solidity } from "ethereum-waffle";

import { shouldERC721Burnable } from "../shared/burnable/basic/burn";
import { shouldERC721Ownable } from "../shared/ownable";
import { shouldERC721Base } from "../shared/base/basic";
import { deployErc721Base } from "../shared/fixtures";

use(solidity);

describe("ERC721OB", function () {
  const name = "ERC721OB";

  shouldERC721Base(name);
  shouldERC721Ownable(name);
  shouldERC721Burnable(name);

  describe("supportsInterface", function () {
    it("should support all interfaces", async function () {
      const { contractInstance } = await deployErc721Base(name);

      const supportsIERC721 = await contractInstance.supportsInterface("0x80ac58cd");
      expect(supportsIERC721).to.equal(true);
      const supportsIERC721Metadata = await contractInstance.supportsInterface("0x5b5e139f");
      expect(supportsIERC721Metadata).to.equal(true);
      const supportsIERC165 = await contractInstance.supportsInterface("0x01ffc9a7");
      expect(supportsIERC165).to.equal(true);
      const supportsInvalidInterface = await contractInstance.supportsInterface("0xffffffff");
      expect(supportsInvalidInterface).to.equal(false);
    });
  });
});
