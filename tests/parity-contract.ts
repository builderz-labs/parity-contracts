import { setupTestEnvironment, TestEnvironment } from "./setup-environment";
import * as issuanceTests from "./issuance-tests";
import * as parityStakingTests from "./parity-staking-test";
import { setup, SetupOptions } from "../clients/js/src";

describe("parity-contract", () => {
  let env: TestEnvironment;

  before(async () => {
    env = await setupTestEnvironment();
    // Define setup options
    const setupOptions: SetupOptions = {
      baseMintDecimals: 6,
      baseMintSymbol: "pUSD",
      baseMintName: "Parity USD",
      baseMintUri: "https://example.com/pusd",
      xMintSymbol: "xSOLD",
      xMintName: "Staked SOLD",
      xMintUri: "https://example.com/xsold",
      quoteMint: env.quoteMint, // Use the created quote mint
      exchangeRate: 1000000, // 1:1 ratio with 6 decimals
      stakingInitialExchangeRate: 1000000, // 1:1 ratio with 6 decimals
      emergencyFundBasisPoints: 1200,
      xMintDecimals: 6,
      limitPerSlot: 100000000000, // 100,000 with 6 decimals
      allowList: [env.umi.identity.publicKey.toString()],
      withdrawExecutionWindow: 3600,
      withdrawTimeLock: 0,
      intervalAprRate: 1000166517567, // Approximately 5% APR
      secondsPerInterval: 28800, // 8 hours
      mintFeeBps: 50,
      redeemFeeBps: 50,
      depositCapParityStaking: 2000000000, // 2,000 with 6 decimals
    };

    const txBuilder = await setup(env.umi, setupOptions);

    await txBuilder.sendAndConfirm(env.umi)
  });

  describe("parity-issuance", () => {
    it.only("runs issuance tests", () => {
      console.log("Running issuance tests with env:", !!env);
      issuanceTests.runIssuanceTests(env);
    });
  });

  describe("Parity-staking", () => {
    it.only("runs staking tests", () => {
      console.log("Running staking tests with env:", !!env);
      parityStakingTests.runParityStakingTests(env);
    });
  });
});