import { ethers } from "hardhat";

async function main() {
  const contractAddress = "0x5FbDB2315678afecb367f032d93F642f64180aa3"; // Replace with your deployed contract address
  const Outpass = await ethers.getContractFactory("Outpass");
  const outpass = Outpass.attach(contractAddress);

  // Example: Request an outpass
  const tx = await outpass.requestOutpass(
    "John Doe",
    "A123",
    "Reason for leaving",
    Math.floor(Date.now() / 1000) + 3600 // 1 hour from now
  );
  await tx.wait();

  console.log("Outpass request sent!");

  // Example: Get a student's outpass
  const studentOutpass = await outpass.getStudentOutpass("A123");
  console.log("Student's outpass:", studentOutpass);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
