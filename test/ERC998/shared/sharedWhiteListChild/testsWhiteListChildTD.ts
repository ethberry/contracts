import { shouldSafeTransferFrom } from "../safeTransferFrom";
import { shouldSafeTransferChild } from "../safeTransferChild";
import { shouldTransferChild } from "../transferChild";
import { shouldChildExists } from "../childExists";
import { shouldChildContractsFor } from "../childContractsFor";

export function testsWhiteListChildTD() {
  describe("using WhiteListChild", function () {
    beforeEach(async function () {
      await this.erc721Instance.whiteListChild(this.erc721InstanceMock.address, 0);
      await this.erc721Instance.whiteListChild(this.erc721Instance.address, 0);
    });

    shouldSafeTransferFrom();
    shouldSafeTransferChild();
    shouldTransferChild();
    shouldChildExists();
    shouldChildContractsFor();
  });
}
