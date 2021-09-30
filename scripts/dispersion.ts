import "@nomiclabs/hardhat-ethers";
import { ethers, upgrades } from "hardhat";

import { Dispersion } from "../typechain";
import { mapSeries } from "./utils/mapSeries";

async function main() {
  const contract = await ethers.getContractFactory("Dispersion");

  const dispersionInstance = (await upgrades.deployProxy(contract)) as Dispersion;

  const result = await mapSeries(
    new Array(1e4).fill(null).map(() => {
      return () => dispersionInstance.getDispersion(Math.floor(Math.random() * 1e6).toString());
    }),
  );

  const dispersion = result.reduce((memo, e) => {
    const index = e.toString();
    if (!memo[index]) {
      memo[index] = 0;
    }
    memo[index]++;
    return memo;
  }, {} as Record<string, number>);

  console.info(dispersion);
}

main()
  .then(() => process.exit(0))
  .catch(error => {
    console.error(error);
    process.exit(1);
  });
