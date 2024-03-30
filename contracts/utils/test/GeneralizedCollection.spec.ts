import { deployContract } from "../src";
import { shouldBehaveLikeMetadata } from "../src/metadata";

describe("GeneralizedCollectionTest", function () {
  const factory = () => deployContract(this.title);

  shouldBehaveLikeMetadata(factory);
});
