import { expect } from "chai";

export function shouldCheckClockMode(factory: () => Promise<any>) {
  describe("CLOCK_MODE", function () {
    it("should return CLOCK_MODE", async function () {
      const contractInstance: any = await factory();

      const mode = await contractInstance.CLOCK_MODE();
      expect(mode).to.equal("mode=blocknumber&from=default");
    });
  });
}
