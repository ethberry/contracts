import { expect, use } from "chai";
import { solidity } from "ethereum-waffle";

import { shouldERC721Burnable } from "../shared/burnable/basic/burn";
import { shouldERC721Ownable } from "../shared/ownable";
import { shouldERC721Base } from "../shared/base/basic";
import { shouldERC721Royalty } from "../shared/royalty/basic";
import { deployErc721Base } from "../shared/fixtures";

use(solidity);

describe("ERC721OBR", function () {
  const name = "ERC721OBR";

  shouldERC721Base(name);
  shouldERC721Ownable(name);
  shouldERC721Burnable(name);
  shouldERC721Royalty(name);

  describe("supportsInterface", function () {
    it("should support all interfaces", async function () {
      const { contractInstance } = await deployErc721Base(name);

      const supportsIERC721 = await contractInstance.supportsInterface("0x80ac58cd");
      expect(supportsIERC721).to.equal(true);
      const supportsIERC721Metadata = await contractInstance.supportsInterface("0x5b5e139f");
      expect(supportsIERC721Metadata).to.equal(true);
      const supportsIERC721Royalty = await contractInstance.supportsInterface("0x2a55205a");
      expect(supportsIERC721Royalty).to.equal(true);
      const supportsIERC165 = await contractInstance.supportsInterface("0x01ffc9a7");
      expect(supportsIERC165).to.equal(true);
      const supportsInvalidInterface = await contractInstance.supportsInterface("0xffffffff");
      expect(supportsInvalidInterface).to.equal(false);
    });
  });
});
