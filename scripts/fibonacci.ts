import { ethers } from "hardhat";

async function main() {
  const factory = await ethers.getContractFactory("Fibonacci");
  const instanse = await factory.deploy();

  const fib = await instanse.fibonacci(10); // 55
  console.info(fib.toString());
}

main()
  .then(() => process.exit(0))
  .catch(error => {
    console.error(error);
    process.exit(1);
  });
