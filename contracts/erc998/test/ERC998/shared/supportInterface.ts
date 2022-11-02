import { expect } from "chai";

import { InterfaceId } from "../../constants";
import { deployErc998Base } from "../../ERC721/shared/fixtures";

export function shouldSupportsInterface(name: string) {
  return (...interfaces: Array<string>) => {
    describe("supportsInterface", function () {
      interfaces.forEach(iface => {
        it(`Should support ${iface}`, async function () {
          const { contractInstance } = await deployErc998Base(name);

          const isSupported = await contractInstance.supportsInterface(iface);
          expect(isSupported).to.equal(true);
        });
      });

      it(`Should not support ${InterfaceId.Invalid}`, async function () {
        const { contractInstance } = await deployErc998Base(name);

        const isSupported = await contractInstance.supportsInterface(InterfaceId.Invalid);
        expect(isSupported).to.equal(false);
      });
    });
  };
}