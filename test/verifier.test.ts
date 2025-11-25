import { expect } from "chai";
import { ethers } from "hardhat";
import { SecretVerifier } from "../typechain-types";

describe("SecretVerifier", function () {
  let secretVerifier: SecretVerifier;
  let ultraVerifierAddress: string;
  let owner: any;
  let user: any;

  beforeEach(async function () {
    [owner, user] = await ethers.getSigners();

    // For testing, we'll deploy a mock UltraVerifier
    // In reality, this would be the actual generated verifier
    const MockVerifier = await ethers.getContractFactory("MockUltraVerifier");
    const mockVerifier = await MockVerifier.deploy();
    await mockVerifier.waitForDeployment();
    ultraVerifierAddress = await mockVerifier.getAddress();

    // Deploy SecretVerifier
    const SecretVerifier = await ethers.getContractFactory("SecretVerifier");
    secretVerifier = await SecretVerifier.deploy(ultraVerifierAddress);
    await secretVerifier.waitForDeployment();
  });

  describe("Deployment", function () {
    it("Should set the correct verifier address", async function () {
      expect(await secretVerifier.verifier()).to.equal(ultraVerifierAddress);
    });

    it("Should revert if verifier address is zero", async function () {
      const SecretVerifier = await ethers.getContractFactory("SecretVerifier");
      await expect(
        SecretVerifier.deploy(ethers.ZeroAddress)
      ).to.be.revertedWith("Invalid verifier address");
    });
  });

  describe("Verification", function () {
    it("Should reject invalid commitment (zero)", async function () {
      const proof = "0x00"; // dummy proof
      const commitment = ethers.ZeroHash;

      await expect(
        secretVerifier.verifySecret(proof, commitment)
      ).to.be.revertedWith("Invalid commitment");
    });

    it("Should track verified commitments", async function () {
      // This test would need a real proof
      // For now, it's a placeholder showing the expected flow
      const commitment = ethers.keccak256(ethers.toUtf8Bytes("test"));
      const isVerified = await secretVerifier.isVerified(commitment);
      expect(isVerified).to.be.false;
    });

    it("Should return correct prover address", async function () {
      const commitment = ethers.keccak256(ethers.toUtf8Bytes("test"));
      const prover = await secretVerifier.getProver(commitment);
      expect(prover).to.equal(ethers.ZeroAddress);
    });

    it("Should track verification count", async function () {
      const count = await secretVerifier.getVerificationCount(owner.address);
      expect(count).to.equal(0);
    });
  });
});

// Mock UltraVerifier for testing
// This simulates the generated verifier from Noir
// In production, this would be replaced by the actual generated contract
