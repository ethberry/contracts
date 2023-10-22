import { deployContract } from "@gemunion/contracts-mocks";

import { shouldBehaveLikeMetadata } from "../src/metadata";

describe("GeneralizedCollectionTest", function () {
  const factory = () => deployContract(this.title);

  shouldBehaveLikeMetadata(factory);
});
