import { Contract, utils } from "ethers";

import { VRFCoordinatorMock } from "../../typechain-types";

// this works not only on ERC721 but also on Lottery
export async function randomRequest(rndInstance: Contract, vrfInstance: VRFCoordinatorMock) {
  const eventFilter = rndInstance.filters.RandomRequest();
  const events = await rndInstance.queryFilter(eventFilter);
  if (events && events.length) {
    events.map(async (event, i) => {
      if (events[i].args) {
        await vrfInstance.callBackWithRandomness(
          // @ts-ignore
          events[i].args[0],
          utils.randomBytes(32),
          rndInstance.address,
        );
      }
    });
  }
}
