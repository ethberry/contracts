import { expect } from "chai";

import { InterfaceId } from "@ethberry/contracts-constants";

export function shouldSupportsInterface(factory: () => Promise<any>) {
  return (supportedInterfaces: Array<string> = [], unsupportedInterfaces: Array<string> = []) => {
    describe("supportsInterface", function () {
      if (supportedInterfaces.length) {
        supportedInterfaces.forEach(iface => {
          it(`Should support ${iface}`, async function () {
            const contractInstance = await factory();

            const isSupported = await contractInstance.supportsInterface(iface);
            expect(isSupported).to.equal(true);
          });
        });
      }

      if (unsupportedInterfaces.length) {
        unsupportedInterfaces.forEach(iface => {
          it(`Should not support ${iface}`, async function () {
            const contractInstance = await factory();

            const isSupported = await contractInstance.supportsInterface(iface);
            expect(isSupported).to.equal(false);
          });
        });
      }

      it(`Should not support ${InterfaceId.Invalid}`, async function () {
        const contractInstance = await factory();

        const isSupported = await contractInstance.supportsInterface(InterfaceId.Invalid);
        expect(isSupported).to.equal(false);
      });
    });
  };
}
