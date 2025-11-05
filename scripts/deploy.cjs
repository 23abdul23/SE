const { ethers } = require("hardhat");

async function main() {
  const Outpass = await ethers.getContractFactory("Outpass");
  const outpass = await Outpass.deploy();

  await outpass.waitForDeployment();

  console.log("Outpass deployed to:", outpass.target);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
