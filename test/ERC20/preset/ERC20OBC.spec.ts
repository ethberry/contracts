import { expect, use } from "chai";
import { solidity } from "ethereum-waffle";
import { shouldERC20Base } from "../shared/base";
import { shouldERC20Burnable } from "../shared/burnable";
import { shouldERC20Ownable } from "../shared/ownable";
import { shouldERC20Capped } from "../shared/capped";
import { deployErc20Base } from "../shared/fixtures";

use(solidity);

describe("ERC20OBC", function () {
  const name = "ERC20OBC";

  shouldERC20Base(name);
  shouldERC20Ownable(name);
  shouldERC20Burnable(name);
  shouldERC20Capped(name);

  describe("supportsInterface", function () {
    it("should support all interfaces", async function () {
      const { contractInstance } = await deployErc20Base(name);

      const supportsIERC20 = await contractInstance.supportsInterface("0x36372b07");
      expect(supportsIERC20).to.equal(true);
      const supportsIERC20Metadata = await contractInstance.supportsInterface("0xa219a025");
      expect(supportsIERC20Metadata).to.equal(true);
      const supportsIERC165 = await contractInstance.supportsInterface("0x01ffc9a7");
      expect(supportsIERC165).to.equal(true);
      const supportsInvalidInterface = await contractInstance.supportsInterface("0xffffffff");
      expect(supportsInvalidInterface).to.equal(false);
    });
  });
});
