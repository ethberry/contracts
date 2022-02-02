import { shouldSafeTransferFrom } from "../safeTransferFrom";
import { shouldSafeTransferChild } from "../safeTransferChild";
import { shouldTransferChild } from "../transferChild";
import { shouldChildExists } from "../childExists";
import { shouldTotalChildContracts } from "../totalChildContracts";
import { shouldChildContractByIndex } from "../childContractByIndex";
import { shouldTotalChildTokens } from "../totalChildTokens";
import { shouldChildTokenByIndex } from "../childTokenByIndex";
import { shouldChildContractsFor } from "../childContractsFor";


export function testsUsingWhiteListChild() {
  describe("using WhiteListChild", function () {
    beforeEach(async function () {
      await this.erc721Instance.whiteListChild(this.erc721InstanceMock.address);
      await this.erc721Instance.setMaxChild(0);
      await this.erc721Instance.whiteListChild(this.erc721Instance.address);
      await this.erc721Instance.setMaxChild(0);
    });

    shouldSafeTransferFrom();
    shouldSafeTransferChild();
    shouldTransferChild();
    shouldChildExists();
    shouldTotalChildContracts();
    shouldChildContractByIndex();
    shouldTotalChildTokens();
    shouldChildTokenByIndex();
    shouldChildContractsFor();
  });
}