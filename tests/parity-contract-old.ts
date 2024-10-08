// import {
//     keypairIdentity,
//     Pda,
//     PublicKey,
//     publicKey,
//     TransactionBuilder,
//     createAmount,
//     some,
//     unwrapOption,
// } from "@metaplex-foundation/umi";
// import { createUmi } from "@metaplex-foundation/umi-bundle-defaults";
// import {
//     createAssociatedToken,
//     createSplAssociatedTokenProgram,
//     createSplTokenProgram,
//     findAssociatedTokenPda,
//     safeFetchMint,
//     safeFetchToken,
//     SPL_ASSOCIATED_TOKEN_PROGRAM_ID,
// } from "@metaplex-foundation/mpl-toolbox";
// import {
//     Connection,
//     Keypair,
//     PublicKey as Web3JsPublicKey,
// } from "@solana/web3.js";
// import {
//     createParityIssuanceProgram,
//     findTokenManagerPda,
//     initializeTokenManager,
//     PARITY_ISSUANCE_PROGRAM_ID,
//     mint,
//     redeem,
//     safeFetchTokenManager,
//     getMerkleRoot,
//     getMerkleProof,
//     toggleActive,
//     updatePoolManager,
//     depositFunds,
//     withdrawFunds,
//     initializePoolManager,
//     PARITY_STAKING_PROGRAM_ID,
//     calculateExchangeRate,
//     stake,
//     unstake,
//     updateAnnualYield,
//     findPoolManagerPda,
//     updateTokenManagerAdmin,
//     safeFetchPoolManager,
//     initializeWithdrawFunds,
//     initiateUpdatePoolOwner,
//     updatePoolOwner,
//     updateManagerOwner,
//     initiateUpdateManagerOwner,
//     updateXmintMetadata,
//     updateMintMetadata,
//     addGatekeeper,
//     safeFetchGatekeeper,
//     removeGatekeeper,
//     findGatekeeperPda,
//     calculateIntervalRate,
//     mintAdmin,
//     updateTokenManagerOwner,
//     findGlobalConfigPda,
//     calculatePoints,
// } from "../clients/js/src";
// import {
//     ASSOCIATED_TOKEN_PROGRAM_ID,
//     createMint,
//     getOrCreateAssociatedTokenAccount,
//     mintTo,
//     TOKEN_PROGRAM_ID,
// } from "@solana/spl-token";
// import {
//     fromWeb3JsKeypair,
//     fromWeb3JsPublicKey,
//     toWeb3JsKeypair,
// } from "@metaplex-foundation/umi-web3js-adapters";
// import {
//     findMetadataPda,
//     safeFetchMetadata,
// } from "@metaplex-foundation/mpl-token-metadata";
// import assert from "assert";
// import chai, { assert as chaiAssert } from "chai";
// import { bs58 } from "@coral-xyz/anchor/dist/cjs/utils/bytes";
// import { calculateMaxWithdrawableAmount } from "../clients/js/src/utils/maxWithdrawable";
// import {
//     createParityStakingProgram,
//     createPtStakingProgram,
//     findUserStakePda,
//     initializeGlobalConfig,
//     initiateUpdateGlobalConfigOwner,
//     initPtStake,
//     PT_STAKING_PROGRAM_ID,
//     ptStake,
//     ptUnstake,
//     safeFetchGlobalConfig,
//     safeFetchUserStake,
//     updateGlobalConfig,
//     updateGlobalConfigOwner,
// } from "../clients/js/src/generated";

// describe.only("parity-issuance", () => {
//     let umi = createUmi("http://localhost:8899");
//     umi.programs.add(createSplAssociatedTokenProgram());
//     umi.programs.add(createSplTokenProgram());
//     umi.programs.add(createParityIssuanceProgram());
//     umi.programs.add(createPtStakingProgram());
//     umi.programs.add(createParityStakingProgram());

//     const connection = new Connection("http://localhost:8899", {
//         commitment: "finalized",
//     });

//     const keypair = Keypair.fromSecretKey(
//         Uint8Array.from(require("../keys/test-kp.json"))
//     );

//     umi.use(keypairIdentity(fromWeb3JsKeypair(keypair)));

//     // Base Mint Universal
//     let baseMint: Pda = umi.eddsa.findPda(PARITY_ISSUANCE_PROGRAM_ID, [
//         Buffer.from("mint"),
//     ]);
//     let baseMetadata: Pda = findMetadataPda(umi, { mint: baseMint[0] });
//     let userBase = findAssociatedTokenPda(umi, {
//         owner: umi.identity.publicKey,
//         mint: baseMint[0],
//     });

//     // Quote Mint Issuance
//     let quoteMint: PublicKey;
//     let userQuote: PublicKey;
//     let vaultIssuance: Pda;

//     // Test Controls
//     const baseMintDecimals = 6;
//     const quoteMintDecimals = 6;
//     const emergencyFundBasisPoints = 1200; // 12% have to stay in the vaultIssuance
//     const exchangeRate = 1 * 10 ** quoteMintDecimals; // Exchange rate is exactly how many quoteMint you will get for 1 baseMint. That's why quote mint decimals have to be considered
//     const exchangeRateDecimals = quoteMintDecimals;
//     const intervalAprRate = 1000166517567; // 1,2 ^ (1 / 1095) for 20% annual APY ^ 1 / auto-compounding intervals per year (8 hourly compounding)
//     const secondsPerInterval = 8 * 60 * 60; // 8 hours

//     const limitPerSlot = 100000 * 10 ** baseMintDecimals;

//     const withdrawExecutionWindow = 3600;
//     const withdrawTimeLock = 0;

//     const testDepositCapAmount = 2000 * 10 ** baseMintDecimals;

//     // Staking Program
//     let poolManager = findPoolManagerPda(umi)[0];
//     let tokenManager = findTokenManagerPda(umi);
//     let vaultStaking = findAssociatedTokenPda(umi, {
//         owner: poolManager,
//         mint: baseMint[0],
//     });

//     // xMint Mint and ATAs
//     let xMint: PublicKey = umi.eddsa.findPda(PARITY_STAKING_PROGRAM_ID, [
//         Buffer.from("mint"),
//     ])[0];
//     let xMetadata: Pda = findMetadataPda(umi, { mint: xMint });
//     let userX: PublicKey = findAssociatedTokenPda(umi, {
//         owner: umi.identity.publicKey,
//         mint: xMint,
//     })[0];

//     // Stake Pool Controls
//     const xMintDecimals = 6;
//     const stakeExchangeRateDecimals = xMintDecimals;
//     const initialExchangeRateParityStaking = 1 * 10 ** stakeExchangeRateDecimals;
//     const allowedWallets = [keypair.publicKey.toBase58()];

//     // Pt staking program
//     let globalConfig = findGlobalConfigPda(umi)[0];
//     let userStakePDA = findUserStakePda(umi, {
//         user: umi.identity.publicKey,
//     });
//     let vaultStakingPDA = findAssociatedTokenPda(umi, {
//         owner: globalConfig,
//         mint: baseMint[0],
//     });

//     const baselineYield = 2000; // For 20%
//     const initialExchangeRatePtStaking = 20 * 10 ** baseMintDecimals;

//     // let context: ProgramTestContext;

//     before(async () => {
//         try {
//             await umi.rpc.airdrop(
//                 umi.identity.publicKey,
//                 createAmount(100_000 * 10 ** 9, "SOL", 9),
//                 { commitment: "finalized" }
//             );

//             // context = await start([], []);

//             const quoteMintWeb3js = await createMint(
//                 connection,
//                 keypair,
//                 keypair.publicKey,
//                 keypair.publicKey,
//                 quoteMintDecimals // Decimals
//             );

//             console.log("Created USDC: ", quoteMintWeb3js.toBase58());

//             const userUsdcInfo = await getOrCreateAssociatedTokenAccount(
//                 connection,
//                 keypair,
//                 quoteMintWeb3js,
//                 keypair.publicKey,
//                 false,
//                 "confirmed",
//                 {
//                     commitment: "confirmed",
//                 },
//                 TOKEN_PROGRAM_ID,
//                 ASSOCIATED_TOKEN_PROGRAM_ID
//             );

//             await mintTo(
//                 connection,
//                 keypair,
//                 quoteMintWeb3js,
//                 userUsdcInfo.address,
//                 keypair.publicKey,
//                 100_000_000 * 10 ** quoteMintDecimals,
//                 [],
//                 {
//                     commitment: "confirmed",
//                 },
//                 TOKEN_PROGRAM_ID
//             );

//             userQuote = fromWeb3JsPublicKey(userUsdcInfo.address);
//             quoteMint = fromWeb3JsPublicKey(quoteMintWeb3js);

//             vaultIssuance = findAssociatedTokenPda(umi, {
//                 owner: tokenManager[0],
//                 mint: quoteMint,
//             });
//         } catch (error) {
//             console.log(error);
//         }
//     });

//     // Initialisations
//     it.only("Token manager is initialized!", async () => {
//         const merkleRoot = getMerkleRoot(allowedWallets);

//         let txBuilder = new TransactionBuilder();

//         txBuilder = txBuilder.add(
//             initializeTokenManager(umi, {
//                 tokenManager,
//                 owner: umi.identity,
//                 vault: vaultIssuance,
//                 metadata: baseMetadata,
//                 mint: baseMint,
//                 quoteMint: quoteMint,
//                 associatedTokenProgram: SPL_ASSOCIATED_TOKEN_PROGRAM_ID,
//                 name: "pUSD",
//                 symbol: "pUSD",
//                 uri: "https://builderz.dev/_next/image?url=%2Fimages%2Fheader-gif.gif&w=3840&q=75",
//                 decimals: baseMintDecimals,
//                 exchangeRate,
//                 emergencyFundBasisPoints,
//                 merkleRoot,
//                 admin: umi.identity.publicKey,
//                 minter: poolManager,
//                 limitPerSlot,
//                 withdrawExecutionWindow,
//                 withdrawTimeLock,
//                 mintFeeBps: 50,
//                 redeemFeeBps: 50,
//             })
//         );

//         await txBuilder.sendAndConfirm(umi);

//         const tokenManagerAcc = await safeFetchTokenManager(umi, tokenManager);
//         const baseMintAcc = await safeFetchMint(umi, baseMint);

//         const expectedMerkleRoot =
//             merkleRoot.length === 0 ? new Array(32).fill(0) : Array.from(merkleRoot);

//         assert.deepStrictEqual(
//             tokenManagerAcc.merkleRoot,
//             Uint8Array.from(expectedMerkleRoot),
//             "Merkle root in token manager account should match expected merkle root"
//         );
//         assert.equal(
//             tokenManagerAcc.mint,
//             baseMint[0],
//             "Token manager's mint should match the base mint"
//         );
//         assert.equal(
//             tokenManagerAcc.mintDecimals,
//             baseMintDecimals,
//             "Token manager's mint decimals should match base mint decimals"
//         );
//         assert.equal(
//             tokenManagerAcc.quoteMint,
//             quoteMint,
//             "Token manager's quote mint should match the provided quote mint"
//         );
//         assert.equal(
//             tokenManagerAcc.quoteMintDecimals,
//             quoteMintDecimals,
//             "Token manager's quote mint decimals should match the provided quote mint decimals"
//         );
//         assert.equal(
//             tokenManagerAcc.exchangeRate,
//             BigInt(exchangeRate),
//             "Token manager's exchange rate should match the provided exchange rate"
//         );
//         assert.equal(
//             tokenManagerAcc.emergencyFundBasisPoints,
//             emergencyFundBasisPoints,
//             "Token manager's emergency fund basis points should match the provided value"
//         );
//         assert.equal(
//             tokenManagerAcc.active,
//             true,
//             "Token manager should be active"
//         );
//         assert.equal(
//             baseMintAcc.supply,
//             0,
//             "Token manager's total supply should be zero"
//         );
//         assert.equal(
//             tokenManagerAcc.totalCollateral,
//             0,
//             "Token manager's total collateral should be zero"
//         );
//         assert.equal(
//             tokenManagerAcc.mintFeeBps,
//             50,
//             "Token manager's mint fee should be 50"
//         );
//         assert.equal(
//             tokenManagerAcc.redeemFeeBps,
//             50,
//             "Token manager's redeem fee should be 50"
//         );
//     });

//     it.only("Stake Pool is initialized!", async () => {
//         let txBuilder = new TransactionBuilder();

//         txBuilder = txBuilder.add(
//             initializePoolManager(umi, {
//                 poolManager,
//                 vault: vaultStaking,
//                 metadata: xMetadata,
//                 baseMint: baseMint,
//                 xMint,
//                 associatedTokenProgram: SPL_ASSOCIATED_TOKEN_PROGRAM_ID,
//                 name: "xSOLD",
//                 symbol: "xSOLD",
//                 uri: "https://builderz.dev/_next/image?url=%2Fimages%2Fheader-gif.gif&w=3840&q=75",
//                 decimals: xMintDecimals,
//                 initialExchangeRate: initialExchangeRateParityStaking,
//                 secondsPerInterval,
//                 intervalAprRate,
//                 owner: umi.identity,
//                 admin: umi.identity.publicKey,
//                 depositCap: testDepositCapAmount,
//             })
//         );

//         await txBuilder.sendAndConfirm(umi, { send: { skipPreflight: false } });

//         const stakePoolAcc = await safeFetchPoolManager(umi, poolManager);
//         const xMintAcc = await safeFetchMint(umi, xMint);

//         assert.equal(stakePoolAcc.baseMint, baseMint[0]);
//         assert.equal(stakePoolAcc.baseMintDecimals, baseMintDecimals);
//         assert.equal(stakePoolAcc.xMint, xMint);
//         assert.equal(stakePoolAcc.xMintDecimals, xMintDecimals);
//         assert.equal(
//             stakePoolAcc.initialExchangeRate,
//             BigInt(initialExchangeRateParityStaking)
//         );
//         assert.equal(stakePoolAcc.baseBalance, 0n);
//         assert.equal(xMintAcc.supply, 0n);
//     });

//     it.only("Global Config is initialized", async () => {

//         //Attempt initializing the global config with a wrong baseMint passed
//         let txBuilder = new TransactionBuilder();

//         txBuilder = txBuilder.add(
//             initializeGlobalConfig(umi, {
//                 globalConfig,
//                 baseMint: userQuote,
//                 vault: vaultStakingPDA,
//                 user: umi.identity,
//                 associatedTokenProgram: SPL_ASSOCIATED_TOKEN_PROGRAM_ID,
//                 admin: umi.identity.publicKey,
//                 baselineYieldBps: baselineYield,
//                 depositCap: testDepositCapAmount,
//                 initialExchangeRate: initialExchangeRatePtStaking,
//             })
//         );


//         await assert.rejects(
//             async () => {
//                 await txBuilder.sendAndConfirm(umi);
//             },
//             (err) => {
//                 return (err as Error).message.includes("An account's data contents was invalid.");
//             },
//             "Expected initializing global config failure because a wrong baseMint was passed"
//         );

//         txBuilder = new TransactionBuilder();

//         txBuilder = txBuilder.add(
//             initializeGlobalConfig(umi, {
//                 globalConfig,
//                 baseMint: baseMint,
//                 vault: vaultStakingPDA,
//                 user: umi.identity,
//                 associatedTokenProgram: SPL_ASSOCIATED_TOKEN_PROGRAM_ID,
//                 admin: umi.identity.publicKey,
//                 baselineYieldBps: baselineYield,
//                 depositCap: testDepositCapAmount,
//                 initialExchangeRate: initialExchangeRatePtStaking,
//             })
//         );

//         await txBuilder.sendAndConfirm(umi, { send: { skipPreflight: false } });

//         const globalConfigAcc = await safeFetchGlobalConfig(umi, globalConfig);

//         assert.equal(globalConfigAcc.baseMint, baseMint[0]);
//         assert.equal(globalConfigAcc.baseMintDecimals, baseMintDecimals);
//         assert.equal(globalConfigAcc.baseYieldHistory[0].baseYieldBps, baselineYield);
//         assert.equal(globalConfigAcc.admin, umi.identity.publicKey);
//         assert.equal(globalConfigAcc.depositCap, testDepositCapAmount);
//         assert.equal(
//             globalConfigAcc.exchangeRateHistory[0].exchangeRate,
//             initialExchangeRatePtStaking
//         );
//         assert.equal(globalConfigAcc.stakedSupply, 0);
//     });

//     // START: Issuance Program
//     it("pUSD can be minted for USDC", async () => {
//         const quantity = 10000 * 10 ** baseMintDecimals;

//         const proof = getMerkleProof(allowedWallets, keypair.publicKey.toBase58());

//         let txBuilder = new TransactionBuilder();

//         const userBaseAtaAcc = await safeFetchToken(umi, userBase);

//         if (!userBaseAtaAcc) {
//             txBuilder = txBuilder.add(
//                 createAssociatedToken(umi, {
//                     mint: baseMint,
//                 })
//             );
//         }

//         const _tokenManagerAcc = await safeFetchTokenManager(umi, tokenManager);
//         const _vaultAcc = await safeFetchToken(umi, vaultIssuance);
//         const _baseMintAcc = await safeFetchMint(umi, baseMint);

//         txBuilder = txBuilder.add(
//             mint(umi, {
//                 tokenManager,
//                 mint: baseMint,
//                 quoteMint: quoteMint,
//                 payerMintAta: userBase,
//                 payerQuoteMintAta: userQuote,
//                 vault: vaultIssuance,
//                 associatedTokenProgram: SPL_ASSOCIATED_TOKEN_PROGRAM_ID,
//                 quantity,
//                 proof,
//             })
//         );

//         const res = await txBuilder.sendAndConfirm(umi, {
//             send: { skipPreflight: false },
//         });
//         // console.log(bs58.encode(res.signature));

//         const tokenManagerAcc = await safeFetchTokenManager(umi, tokenManager);
//         const vaultAcc = await safeFetchToken(umi, vaultIssuance);
//         const baseMintAcc = await safeFetchMint(umi, baseMint);

//         //const mintFeeBps = _tokenManagerAcc.mintFeeBps;
//         const mintFeeBps = tokenManagerAcc.mintFeeBps;
//         const feeAmount = (BigInt(quantity) * BigInt(mintFeeBps)) / BigInt(10000);
//         const expectedMintAmount = BigInt(quantity) - feeAmount;
//         const powerDifference = quoteMintDecimals - baseMintDecimals;

//         // Adjust quantity by the power difference before converting to BigInt
//         let adjustedQuantity;
//         if (powerDifference > 0) {
//             adjustedQuantity = BigInt(quantity) * BigInt(10 ** powerDifference);
//         } else if (powerDifference < 0) {
//             adjustedQuantity = BigInt(quantity) / BigInt(10 ** -powerDifference);
//         } else {
//             adjustedQuantity = BigInt(quantity);
//         }

//         // Calculate the expected quote amount
//         const expectedQuoteAmount =
//             (adjustedQuantity * BigInt(exchangeRate)) /
//             BigInt(10 ** exchangeRateDecimals);

//         assert.equal(
//             baseMintAcc.supply,
//             _baseMintAcc.supply + expectedMintAmount,
//             "Total supply should be correct"
//         );
//         assert.equal(
//             tokenManagerAcc.totalCollateral,
//             _tokenManagerAcc.totalCollateral + expectedQuoteAmount,
//             "Total collateral should be correct"
//         );
//         assert.equal(
//             vaultAcc.amount,
//             _vaultAcc.amount + expectedQuoteAmount,
//             "Vault amount should be correct"
//         );
//     });

//     it("pUSD can be redeemed for Quote", async () => {
//         const quantity = 1000 * 10 ** baseMintDecimals;

//         const proof = getMerkleProof(allowedWallets, keypair.publicKey.toBase58());

//         let txBuilder = new TransactionBuilder();

//         const userQuoteAtaAcc = await safeFetchToken(umi, userQuote);

//         if (!userQuoteAtaAcc) {
//             txBuilder = txBuilder.add(
//                 createAssociatedToken(umi, {
//                     mint: userQuote,
//                 })
//             );
//         }

//         const _tokenManagerAcc = await safeFetchTokenManager(umi, tokenManager);
//         const _vaultAcc = await safeFetchToken(umi, vaultIssuance);
//         const _baseMintAcc = await safeFetchMint(umi, baseMint);

//         txBuilder = txBuilder.add(
//             redeem(umi, {
//                 tokenManager,
//                 mint: baseMint,
//                 quoteMint: quoteMint,
//                 payerMintAta: userBase,
//                 payerQuoteMintAta: userQuote,
//                 vault: vaultIssuance,
//                 associatedTokenProgram: SPL_ASSOCIATED_TOKEN_PROGRAM_ID,
//                 quantity,
//                 proof,
//             })
//         );

//         const res = await txBuilder.sendAndConfirm(umi, {
//             send: { skipPreflight: false },
//         });
//         // console.log(bs58.encode(res.signature));

//         const tokenManagerAcc = await safeFetchTokenManager(umi, tokenManager);
//         const vaultAcc = await safeFetchToken(umi, vaultIssuance);
//         const baseMintAcc = await safeFetchMint(umi, baseMint);

//         const expectedQuoteAmount =
//             (((BigInt(quantity) / BigInt(10 ** baseMintDecimals)) *
//                 BigInt(exchangeRate)) /
//                 BigInt(10 ** exchangeRateDecimals)) *
//             BigInt(10 ** quoteMintDecimals);
//         const redeemFeeBps = tokenManagerAcc.redeemFeeBps;
//         const feeAmount = (BigInt(quantity) * BigInt(redeemFeeBps)) / BigInt(10000);
//         const expectedQuoteAmountAfterFees = expectedQuoteAmount - feeAmount;

//         assert.equal(
//             baseMintAcc.supply,
//             _baseMintAcc.supply - BigInt(quantity),
//             "Total supply should be correct"
//         );
//         assert.equal(
//             tokenManagerAcc.totalCollateral,
//             _tokenManagerAcc.totalCollateral - expectedQuoteAmountAfterFees,
//             "Total collateral should be correct"
//         );
//         assert.equal(
//             vaultAcc.amount,
//             _vaultAcc.amount - expectedQuoteAmountAfterFees,
//             "Vault amount should be correct"
//         );
//     });

//     it("should add and remove a gatekeeper and check unpause permissions", async () => {
//         const newGatekeeper = umi.eddsa.generateKeypair();

//         await umi.rpc.airdrop(
//             newGatekeeper.publicKey,
//             createAmount(100_000 * 10 ** 9, "SOL", 9),
//             { commitment: "finalized" }
//         );

//         const gatekeeper = findGatekeeperPda(umi, {
//             wallet: newGatekeeper.publicKey,
//         });

//         // Add the new gatekeeper
//         let txBuilder = new TransactionBuilder();
//         txBuilder = txBuilder.add(
//             addGatekeeper(umi, {
//                 tokenManager,
//                 newGatekeeper: newGatekeeper.publicKey,
//                 admin: umi.identity,
//                 gatekeeper,
//             })
//         );
//         await txBuilder.sendAndConfirm(umi);

//         // Verify the gatekeeper was added
//         let gatekeeperAcc = await safeFetchGatekeeper(umi, gatekeeper);
//         assert.equal(
//             gatekeeperAcc.wallet,
//             newGatekeeper.publicKey,
//             "Gatekeeper should be added"
//         );

//         // Pause the token manager with new gatekeeper
//         umi = umi.use(keypairIdentity(newGatekeeper));
//         txBuilder = new TransactionBuilder();
//         txBuilder = txBuilder.add(
//             toggleActive(umi, { tokenManager, gatekeeper, active: false })
//         );
//         await txBuilder.sendAndConfirm(umi);

//         let tokenManagerAcc = await safeFetchTokenManager(umi, tokenManager);
//         assert.strictEqual(tokenManagerAcc.active, false);

//         // Attempt to unpause the token manager as the new gatekeeper
//         umi.use(keypairIdentity(fromWeb3JsKeypair(keypair))); // Switch back to admin
//         txBuilder = new TransactionBuilder();
//         txBuilder = txBuilder.add(
//             toggleActive(umi, { tokenManager, active: true })
//         );
//         await txBuilder.sendAndConfirm(umi);

//         tokenManagerAcc = await safeFetchTokenManager(umi, tokenManager);
//         assert.strictEqual(
//             tokenManagerAcc.active,
//             true,
//             "Token manager should be unpaused by gatekeeper"
//         );

//         // Remove the gatekeeper
//         txBuilder = new TransactionBuilder();
//         txBuilder = txBuilder.add(
//             removeGatekeeper(umi, {
//                 tokenManager,
//                 gatekeeper,
//                 admin: umi.identity,
//             })
//         );
//         await txBuilder.sendAndConfirm(umi);

//         // Verify the gatekeeper was removed
//         const gatekeeperAccAfterRemoval = await safeFetchGatekeeper(
//             umi,
//             gatekeeper
//         );
//         assert.strictEqual(
//             gatekeeperAccAfterRemoval,
//             null,
//             "Expected gatekeeper account to be null"
//         );

//         // Attempt to unpause the token manager as the removed gatekeeper
//         umi = umi.use(keypairIdentity(newGatekeeper));
//         txBuilder = new TransactionBuilder();
//         txBuilder = txBuilder.add(
//             toggleActive(umi, { tokenManager, active: false })
//         );
//         await assert.rejects(
//             async () => {
//                 await txBuilder.sendAndConfirm(umi);
//             },
//             (err) => {
//                 return (err as Error).message.includes("InvalidToggleActiveAuthority");
//             },
//             "Expected unpause to fail as the gatekeeper was removed"
//         );
//     });

//     it("should prevent minting when paused", async () => {
//         // Pause the token manager
//         umi = umi.use(keypairIdentity(fromWeb3JsKeypair(keypair))); // Switch back to admin

//         let txBuilder = new TransactionBuilder();
//         txBuilder = txBuilder.add(
//             toggleActive(umi, {
//                 tokenManager,
//                 authority: umi.identity,
//                 active: false,
//             })
//         );
//         await txBuilder.sendAndConfirm(umi);

//         let tokenManagerAcc = await safeFetchTokenManager(umi, tokenManager);
//         assert.strictEqual(tokenManagerAcc.active, false);

//         // Attempt to mint tokens
//         txBuilder = new TransactionBuilder();
//         let userBaseAtaAcc = await safeFetchToken(umi, userBase);

//         if (!userBaseAtaAcc) {
//             txBuilder = txBuilder.add(
//                 createAssociatedToken(umi, {
//                     mint: baseMint,
//                 })
//             );
//         }
//         txBuilder = txBuilder.add(
//             mint(umi, {
//                 tokenManager,
//                 mint: baseMint,
//                 quoteMint: quoteMint,
//                 payerMintAta: userBase,
//                 payerQuoteMintAta: userQuote,
//                 vault: vaultIssuance,
//                 associatedTokenProgram: SPL_ASSOCIATED_TOKEN_PROGRAM_ID,
//                 quantity: 1000,
//                 proof: getMerkleProof(allowedWallets, keypair.publicKey.toBase58()),
//             })
//         );

//         await assert.rejects(
//             async () => {
//                 await txBuilder.sendAndConfirm(umi);
//             },
//             (err) => {
//                 return (err as Error).message.includes("Mint and redemptions paused");
//             },
//             "Expected minting to fail when paused"
//         );

//         // Attempt to redeem tokens
//         txBuilder = new TransactionBuilder();
//         userBaseAtaAcc = await safeFetchToken(umi, userBase);

//         if (!userBaseAtaAcc) {
//             txBuilder = txBuilder.add(
//                 createAssociatedToken(umi, {
//                     mint: baseMint,
//                 })
//             );
//         }
//         txBuilder = txBuilder.add(
//             redeem(umi, {
//                 tokenManager,
//                 mint: baseMint,
//                 quoteMint: quoteMint,
//                 payerMintAta: userBase,
//                 payerQuoteMintAta: userQuote,
//                 vault: vaultIssuance,
//                 associatedTokenProgram: SPL_ASSOCIATED_TOKEN_PROGRAM_ID,
//                 quantity: 1000,
//                 proof: getMerkleProof(allowedWallets, keypair.publicKey.toBase58()),
//             })
//         );

//         await assert.rejects(
//             async () => {
//                 await txBuilder.sendAndConfirm(umi);
//             },
//             (err) => {
//                 return (err as Error).message.includes("Mint and redemptions paused");
//             },
//             "Expected redemption to fail when paused"
//         );

//         // Try to set the same pause status again, which should fail
//         txBuilder = new TransactionBuilder();
//         txBuilder = txBuilder.add(
//             toggleActive(umi, { tokenManager, active: false })
//         );
//         await assert.rejects(
//             async () => {
//                 await txBuilder.sendAndConfirm(umi);
//             },
//             (err) => {
//                 return (err as Error).message.includes(
//                     "Token manager status unchanged"
//                 );
//             },
//             "Expected failure due to no change in token manager status"
//         );

//         // Try unpause and test if working;
//         txBuilder = new TransactionBuilder();
//         txBuilder = txBuilder.add(
//             toggleActive(umi, { tokenManager, active: true })
//         );
//         await txBuilder.sendAndConfirm(umi);

//         tokenManagerAcc = await safeFetchTokenManager(umi, tokenManager);
//         assert.equal(tokenManagerAcc.active, true);
//     });

//     it("should enforce allowList changes", async () => {
//         const newAllowedWallets = ["BLDRZQiqt4ESPz12L9mt4XTBjeEfjoBopGPDMA36KtuZ"];

//         let tokenManagerAcc = await safeFetchTokenManager(umi, tokenManager);
//         const originalMerkleRoot = tokenManagerAcc.merkleRoot;
//         const newMerkleRoot = getMerkleRoot(newAllowedWallets);

//         // Update the allowList to a new set of wallets
//         let txBuilder = new TransactionBuilder();
//         txBuilder = txBuilder.add(
//             updateTokenManagerAdmin(umi, {
//                 tokenManager,
//                 newMerkleRoot: some(newMerkleRoot),
//                 newLimitPerSlot: null,
                
//                 admin: umi.identity,
//             })
//         );
//         await txBuilder.sendAndConfirm(umi);

//         tokenManagerAcc = await safeFetchTokenManager(umi, tokenManager);
//         assert.deepStrictEqual(
//             new Uint8Array(tokenManagerAcc.merkleRoot),
//             new Uint8Array(newMerkleRoot)
//         );

//         // Attempt to mint with the original wallet, which is no longer allowed
//         txBuilder = new TransactionBuilder();
//         let proof = getMerkleProof(allowedWallets, keypair.publicKey.toBase58());
//         txBuilder = txBuilder.add(
//             mint(umi, {
//                 tokenManager,
//                 mint: baseMint,
//                 quoteMint: quoteMint,
//                 payerMintAta: userBase,
//                 payerQuoteMintAta: userQuote,
//                 vault: vaultIssuance,
//                 associatedTokenProgram: SPL_ASSOCIATED_TOKEN_PROGRAM_ID,
//                 quantity: 1000,
//                 proof,
//             })
//         );

//         await assert.rejects(
//             async () => {
//                 await txBuilder.sendAndConfirm(umi);
//             },
//             (err) => {
//                 return (err as Error).message.includes(
//                     "Address not found in allowed list"
//                 );
//             },
//             "Expected minting to fail with old wallet not in the new allowList"
//         );

//         txBuilder = new TransactionBuilder();
//         txBuilder = txBuilder.add(
//             redeem(umi, {
//                 tokenManager,
//                 mint: baseMint,
//                 quoteMint: quoteMint,
//                 payerMintAta: userBase,
//                 payerQuoteMintAta: userQuote,
//                 vault: vaultIssuance,
//                 associatedTokenProgram: SPL_ASSOCIATED_TOKEN_PROGRAM_ID,
//                 quantity: 1000,
//                 proof,
//             })
//         );

//         await assert.rejects(
//             async () => {
//                 await txBuilder.sendAndConfirm(umi);
//             },
//             (err) => {
//                 return (err as Error).message.includes(
//                     "Address not found in allowed list"
//                 );
//             },
//             "Expected redemptions to fail with old wallet not in the new allowList"
//         );

//         // Restore the original allowList
//         txBuilder = new TransactionBuilder();
//         txBuilder = txBuilder.add(
//             updateTokenManagerAdmin(umi, {
//                 tokenManager,
//                 admin: umi.identity,
//                 // Params
//                 newMerkleRoot: some(originalMerkleRoot),
//                 newLimitPerSlot: null,
//             })
//         );
//         await txBuilder.sendAndConfirm(umi);

//         tokenManagerAcc = await safeFetchTokenManager(umi, tokenManager);

//         assert.deepStrictEqual(
//             new Uint8Array(tokenManagerAcc.merkleRoot),
//             new Uint8Array(originalMerkleRoot)
//         );

//         // Attempt to mint again with the original wallet
//         txBuilder = new TransactionBuilder();
//         txBuilder = txBuilder.add(
//             mint(umi, {
//                 tokenManager,
//                 mint: baseMint,
//                 quoteMint: quoteMint,
//                 payerMintAta: userBase,
//                 payerQuoteMintAta: userQuote,
//                 vault: vaultIssuance,
//                 associatedTokenProgram: SPL_ASSOCIATED_TOKEN_PROGRAM_ID,
//                 quantity: 1000,
//                 proof,
//             })
//         );

//         await assert.doesNotReject(async () => {
//             await txBuilder.sendAndConfirm(umi);
//         }, "Expected minting to succeed with wallet back in the allowList");

//         txBuilder = new TransactionBuilder();
//         txBuilder = txBuilder.add(
//             redeem(umi, {
//                 tokenManager,
//                 mint: baseMint,
//                 quoteMint: quoteMint,
//                 payerMintAta: userBase,
//                 payerQuoteMintAta: userQuote,
//                 vault: vaultIssuance,
//                 associatedTokenProgram: SPL_ASSOCIATED_TOKEN_PROGRAM_ID,
//                 quantity: 1000,
//                 proof,
//             })
//         );

//         await assert.doesNotReject(async () => {
//             await txBuilder.sendAndConfirm(umi);
//         }, "Expected redemptions to succeed with wallet back in the allowList");
//     });

//     it("deposit and withdraw funds from the vaultIssuance", async () => {
//         let _tokenManagerAcc = await safeFetchTokenManager(umi, tokenManager);
//         let _vaultAcc = await safeFetchToken(umi, vaultIssuance);
//         let _baseMintAcc = await safeFetchMint(umi, baseMint);

//         // Higher than total collateral amount
//         let quantity = Number(_tokenManagerAcc.totalCollateral) + 1; // Amount to deposit
//         // console.log("Quantity to Withdraw higher than collateral: ", quantity);
//         // console.log("TotalSupply: ", Number(_tokenManagerAcc.totalSupply / BigInt(10 ** baseMintDecimals)));
//         // console.log("TotalCollateral: ", Number(_tokenManagerAcc.totalCollateral / BigInt(10 ** quoteMintDecimals)));

//         // Process withdraw without one being initialized
//         let txBuilder = new TransactionBuilder();
//         txBuilder = txBuilder.add(
//             withdrawFunds(umi, {
//                 tokenManager,
//                 mint: baseMint,
//                 quoteMint: quoteMint,
//                 vault: vaultIssuance,
//                 authorityQuoteMintAta: userQuote,
//                 associatedTokenProgram: SPL_ASSOCIATED_TOKEN_PROGRAM_ID,
//                 admin: umi.identity,
//             })
//         );

//         await assert.rejects(
//             async () => {
//                 await txBuilder.sendAndConfirm(umi);
//             },
//             (err) => {
//                 return (err as Error).message.includes("No pending withdrawal");
//             },
//             "Expected withdrawal to fail because of no pending withdrawal"
//         );

//         // Initiate withdraw
//         txBuilder = new TransactionBuilder();
//         txBuilder = txBuilder.add(
//             initializeWithdrawFunds(umi, {
//                 tokenManager,
//                 mint: baseMint,
//                 vault: vaultStaking,
//                 quantity,
//                 admin: umi.identity,
//             })
//         );

//         await assert.rejects(
//             async () => {
//                 await txBuilder.sendAndConfirm(umi);
//             },
//             (err) => {
//                 return (err as Error).message.includes("Excessive Withdrawal");
//             },
//             "Expected withdrawal to fail because of excessive withdrawal - Higher than total collateral amount"
//         );

//         // Higher than the threshold amount amount
//         // Calculate the maximum withdrawable amount based on mint supply
//         const maxWithdrawableAmount = calculateMaxWithdrawableAmount(
//             BigInt(_baseMintAcc.supply),
//             BigInt(_tokenManagerAcc.exchangeRate),
//             _tokenManagerAcc.mintDecimals,
//             _tokenManagerAcc.quoteMintDecimals,
//             _tokenManagerAcc.emergencyFundBasisPoints,
//             BigInt(_tokenManagerAcc.totalCollateral)
//         );

//         // Higher than the threshold amount amount
//         quantity = Number(maxWithdrawableAmount) + 1; // Amount to deposit
//         // console.log("Quantity to Withdraw, higher than threshold: ", quantity);
//         // console.log("TotalCollateral: ", Number(_tokenManagerAcc.totalCollateral / BigInt(10 ** quoteMintDecimals)));
//         // console.log("Mint supply: ", Number(_baseMintAcc.supply / BigInt(10 ** baseMintDecimals)));

//         txBuilder = new TransactionBuilder();
//         txBuilder = txBuilder.add(
//             initializeWithdrawFunds(umi, {
//                 tokenManager,
//                 vault: vaultStaking,
//                 quantity,
//                 mint: baseMint,
//                 admin: umi.identity,
//             })
//         );

//         await assert.rejects(
//             async () => {
//                 await txBuilder.sendAndConfirm(umi);
//             },
//             (err) => {
//                 return (err as Error).message.includes("Excessive Withdrawal");
//             },
//             "Expected withdrawal to fail because of excessive withdrawal - Higher than threshold amount"
//         );

//         // Withdraw within allowed
//         quantity = Number(maxWithdrawableAmount); // Amount to deposit
//         // console.log("Quantity to Withdraw allowed: ", quantity);
//         // console.log("TotalSupply: ", Number(_baseMintAcc.supply / BigInt(10 ** baseMintDecimals)));
//         // console.log("TotalCollateral: ", Number(_tokenManagerAcc.totalCollateral / BigInt(10 ** quoteMintDecimals)));

//         txBuilder = new TransactionBuilder();
//         txBuilder = txBuilder.add(
//             initializeWithdrawFunds(umi, {
//                 tokenManager,
//                 vault: vaultStaking,
//                 quantity,
//                 mint: baseMint,
//                 admin: umi.identity,
//             })
//         );

//         await txBuilder.sendAndConfirm(umi);

//         let tokenManagerAcc = await safeFetchTokenManager(umi, tokenManager);
//         let vaultAcc = await safeFetchToken(umi, vaultIssuance);
//         let baseMintAcc = await safeFetchMint(umi, baseMint);

//         assert.equal(
//             tokenManagerAcc.pendingWithdrawalAmount,
//             quantity,
//             "Pending withdrawal amount should have changed"
//         );

//         // Fails because of timelock
//         // txBuilder = new TransactionBuilder();
//         // txBuilder = txBuilder.add(withdrawFunds(umi, {
//         //   tokenManager,
//         //   mint: baseMint,
//         //   quoteMint: quoteMint,
//         //   vault: vaultIssuance,
//         //   authorityQuoteMintAta: userQuote,
//         //   associatedTokenProgram: SPL_ASSOCIATED_TOKEN_PROGRAM_ID,
//         //   admin: umi.identity
//         // }));

//         // await assert.rejects(
//         //   async () => {
//         //     await txBuilder.sendAndConfirm(umi);
//         //   },
//         //   (err) => {
//         //     return (err as Error).message.includes("Withdrawal not ready");
//         //   },
//         //   "Expected withdrawal to fail because of timelock"
//         // );

//         // Should work after an hour or specified time
//         txBuilder = new TransactionBuilder();
//         txBuilder = txBuilder.add(
//             withdrawFunds(umi, {
//                 tokenManager,
//                 mint: baseMint,
//                 quoteMint: quoteMint,
//                 vault: vaultIssuance,
//                 authorityQuoteMintAta: userQuote,
//                 associatedTokenProgram: SPL_ASSOCIATED_TOKEN_PROGRAM_ID,
//                 admin: umi.identity,
//             })
//         );
//         await txBuilder.sendAndConfirm(umi);

//         tokenManagerAcc = await safeFetchTokenManager(umi, tokenManager);
//         vaultAcc = await safeFetchToken(umi, vaultIssuance);
//         baseMintAcc = await safeFetchMint(umi, baseMint);
//         let expectedChange = BigInt(quantity);

//         // assert.equal(tokenManagerAcc.totalCollateral, _tokenManagerAcc.totalCollateral - expectedChange, "TokenManager totalCollateral should be equal to the initial totalCollateral minus withdrawed amount");
//         // assert.equal(vaultAcc.amount, _vaultAcc.amount - expectedChange, "Vault balance should be equal to the initial vaultIssuance minus withdrawed amount");

//         // Deposit excessive
//         quantity =
//             Number(
//                 ((baseMintAcc.supply / BigInt(10 ** baseMintDecimals)) *
//                     BigInt(exchangeRate)) /
//                 BigInt(10 ** exchangeRateDecimals) -
//                 tokenManagerAcc.totalCollateral / BigInt(10 ** quoteMintDecimals)
//             ) *
//             10 ** quoteMintDecimals +
//             1;
//         if (quantity < 0) {
//             quantity = 1;
//         } else {
//             quantity += 1;
//         }
//         // console.log("Quantity to Deposit not allowed: ", quantity);
//         // console.log("TotalSupply: ", Number(baseMintAcc.supply / BigInt(10 ** baseMintDecimals)));
//         // console.log("TotalCollateral: ", Number(tokenManagerAcc.totalCollateral / BigInt(10 ** quoteMintDecimals)));

//         txBuilder = new TransactionBuilder();
//         txBuilder = txBuilder.add(
//             depositFunds(umi, {
//                 tokenManager,
//                 mint: baseMint,
//                 quoteMint: quoteMint,
//                 vault: vaultIssuance,
//                 authorityQuoteMintAta: userQuote,
//                 associatedTokenProgram: SPL_ASSOCIATED_TOKEN_PROGRAM_ID,
//                 quantity,
//                 admin: umi.identity,
//             })
//         );

//         await assert.rejects(
//             async () => {
//                 await txBuilder.sendAndConfirm(umi);
//             },
//             (err) => {
//                 return (err as Error).message.includes("Excessive Deposit");
//             },
//             "Expected deposit to fail because of excessive deposit"
//         );

//         // Deposit allowed
//         _tokenManagerAcc = tokenManagerAcc;
//         _vaultAcc = vaultAcc;
//         _baseMintAcc = baseMintAcc;

//         quantity =
//             Number(
//                 ((baseMintAcc.supply / BigInt(10 ** baseMintDecimals)) *
//                     BigInt(exchangeRate)) /
//                 BigInt(10 ** exchangeRateDecimals) -
//                 tokenManagerAcc.totalCollateral / BigInt(10 ** quoteMintDecimals)
//             ) *
//             10 ** quoteMintDecimals;

//         const maxCollateral = Number(
//             (baseMintAcc.supply / BigInt(10 ** baseMintDecimals)) *
//             BigInt(exchangeRate)
//         );
//         quantity = maxCollateral - Number(_tokenManagerAcc.totalCollateral);
//         // console.log("Max Collateral: ", maxCollateral);
//         // console.log("TotalSupply: ", Number(_baseMintAcc.supply));
//         // console.log("TotalCollateral: ", Number(_tokenManagerAcc.totalCollateral));
//         // console.log("Quantity deposit allowed: ", quantity);

//         txBuilder = new TransactionBuilder();
//         txBuilder = txBuilder.add(
//             depositFunds(umi, {
//                 tokenManager,
//                 mint: baseMint,
//                 quoteMint: quoteMint,
//                 vault: vaultIssuance,
//                 authorityQuoteMintAta: userQuote,
//                 associatedTokenProgram: SPL_ASSOCIATED_TOKEN_PROGRAM_ID,
//                 quantity,
//                 admin: umi.identity,
//             })
//         );

//         await txBuilder.sendAndConfirm(umi);

//         tokenManagerAcc = await safeFetchTokenManager(umi, tokenManager);
//         vaultAcc = await safeFetchToken(umi, vaultIssuance);

//         expectedChange = BigInt(quantity);
//         assert.equal(
//             tokenManagerAcc.totalCollateral,
//             _tokenManagerAcc.totalCollateral + expectedChange,
//             "TokenManager totalCollateral should be equal to the initial totalCollateral plus deposited amount"
//         );
//         assert.equal(
//             vaultAcc.amount,
//             _vaultAcc.amount + expectedChange,
//             "Vault balance should be equal to the initial vaultIssuance plus deposited amount"
//         );
//     });

//     it("should initiate and accept manager owner update", async () => {
//         const newAdmin = umi.eddsa.generateKeypair();

//         await umi.rpc.airdrop(
//             newAdmin.publicKey,
//             createAmount(100_000 * 10 ** 9, "SOL", 9),
//             {
//                 commitment: "finalized",
//             }
//         );
//         umi.use(keypairIdentity(fromWeb3JsKeypair(keypair))); // Switch to new admin

//         // Initiate update of tokenManager owner
//         let txBuilder = new TransactionBuilder();
//         txBuilder = txBuilder.add(
//             initiateUpdateManagerOwner(umi, {
//                 tokenManager,
//                 newOwner: newAdmin.publicKey,
//                 owner: umi.identity,
//             })
//         );
//         await txBuilder.sendAndConfirm(umi);

//         // Check if the update initiation was successful
//         let tokenManagerAcc = await safeFetchTokenManager(umi, tokenManager);

//         assert.equal(
//             tokenManagerAcc.pendingOwner,
//             newAdmin.publicKey,
//             "Pending owner should be set to new admin"
//         );

//         // Accept update of manager owner
//         umi.use(keypairIdentity(newAdmin)); // Switch to new admin
//         txBuilder = new TransactionBuilder();
//         txBuilder = txBuilder.add(
//             updateManagerOwner(umi, {
//                 tokenManager,
//                 newOwner: umi.identity,
//             })
//         );
//         await txBuilder.sendAndConfirm(umi);

//         // Verify the new admin is set
//         tokenManagerAcc = await safeFetchTokenManager(umi, tokenManager);
//         assert.equal(
//             tokenManagerAcc.owner,
//             newAdmin.publicKey,
//             "owner should be updated to new owner"
//         );
//         assert.equal(
//             tokenManagerAcc.pendingOwner,
//             publicKey("11111111111111111111111111111111"),
//             "Pending owner should be set to default pubkey"
//         );

//         // Change back
//         txBuilder = new TransactionBuilder();
//         txBuilder = txBuilder.add(
//             initiateUpdateManagerOwner(umi, {
//                 tokenManager,
//                 newOwner: fromWeb3JsKeypair(keypair).publicKey,
//                 owner: umi.identity,
//             })
//         );
//         await txBuilder.sendAndConfirm(umi);

//         // Accept update back to original admin
//         umi.use(keypairIdentity(fromWeb3JsKeypair(keypair))); // Switch back to original admin
//         txBuilder = new TransactionBuilder();
//         txBuilder = txBuilder.add(
//             updateManagerOwner(umi, {
//                 tokenManager,
//                 newOwner: umi.identity,
//             })
//         );
//         await txBuilder.sendAndConfirm(umi);

//         // Verify the admin is set back to original
//         tokenManagerAcc = await safeFetchTokenManager(umi, tokenManager);
//         assert.equal(
//             tokenManagerAcc.admin,
//             publicKey(keypair.publicKey),
//             "Admin should be reverted back to original admin"
//         );
//     });

//     it("should update base mint metadata of issuance program", async () => {
//         const name = "TEST";
//         const symbol = "TEST";
//         const uri = "https://example.com/new-xmint-info.json";

//         let txBuilder = new TransactionBuilder();
//         txBuilder = txBuilder.add(
//             updateMintMetadata(umi, {
//                 tokenManager,
//                 metadataAccount: baseMetadata,
//                 name,
//                 symbol,
//                 uri,
//                 owner: umi.identity,
//             })
//         );

//         await txBuilder.sendAndConfirm(umi);

//         const mintMetadata = await safeFetchMetadata(umi, baseMetadata);
//         assert.equal(mintMetadata.name, name, "Name should be updated");
//         assert.equal(mintMetadata.symbol, symbol, "Symbol should be updated");
//         assert.equal(mintMetadata.uri, uri, "Uri should be updated");
//     });

//     it("should mint tokens to admin and update token  minter", async () => {
//         const quantity = 10000 * 10 ** baseMintDecimals;

//         // Attempt to mint tokens with the wrong minter
//         let txBuilder = new TransactionBuilder();

//         const userBaseAtaAcc = await safeFetchToken(umi, userBase);

//         if (!userBaseAtaAcc) {
//             txBuilder = txBuilder.add(
//                 createAssociatedToken(umi, {
//                     mint: baseMint,
//                 })
//             );
//         }

//         txBuilder = new TransactionBuilder().add(
//             mintAdmin(umi, {
//                 tokenManager,
//                 mint: baseMint,
//                 minterMintAta: userBase,
//                 minter: umi.identity,
//                 associatedTokenProgram: SPL_ASSOCIATED_TOKEN_PROGRAM_ID,
//                 quantity: quantity,
//             })
//         );

//         await assert.rejects(
//             async () => {
//                 await txBuilder.sendAndConfirm(umi);
//             },
//             (err) => {
//                 return (err as Error).message.includes("Invalid minter");
//             },
//             "Expected minting to fail cause wrong minter was passed"
//         );

//         // Change the token manager minter
//         txBuilder = new TransactionBuilder().add(
//             updateTokenManagerOwner(umi, {
//                 tokenManager,
//                 owner: umi.identity,
//                 newAdmin: null,
//                 newMinter: some(umi.identity.publicKey),
//                 emergencyFundBasisPoints: null,
//                 newWithdrawTimeLock: null,
//                 newWithdrawExecutionWindow: null,
//                 newMintFeeBps: null,
//                 newRedeemFeeBps: null,
//             })
//         );

//         await txBuilder.sendAndConfirm(umi);

//         const tokenManagerAcc = await safeFetchTokenManager(umi, tokenManager);

//         assert.deepStrictEqual(
//             tokenManagerAcc.minter,
//             umi.identity.publicKey,
//             "Token manager's minter should be updated"
//         );

//         //Now try minting with the newMinter

//         const _baseMintAcc = await safeFetchMint(umi, baseMint);

//         txBuilder = new TransactionBuilder().add(
//             mintAdmin(umi, {
//                 tokenManager,
//                 mint: baseMint,
//                 minterMintAta: userBase,
//                 minter: umi.identity,
//                 associatedTokenProgram: SPL_ASSOCIATED_TOKEN_PROGRAM_ID,
//                 quantity: quantity,
//             })
//         );

//         await txBuilder.sendAndConfirm(umi);

//         const baseMintAcc = await safeFetchMint(umi, baseMint);
//         const expectedMintAmount = BigInt(quantity);

//         assert.deepStrictEqual(
//             baseMintAcc.supply,
//             _baseMintAcc.supply + expectedMintAmount,
//             "Total supply should be correct"
//         );
//     });

//     it("should update the mint and redeem fee with an higher amount", async () => {
//         let txBuilder = new TransactionBuilder().add(
//             updateTokenManagerOwner(umi, {
//                 tokenManager,
//                 owner: umi.identity,
//                 newAdmin: null,
//                 newMinter: null,
//                 emergencyFundBasisPoints: null,
//                 newWithdrawTimeLock: null,
//                 newWithdrawExecutionWindow: null,
//                 newMintFeeBps: 80,
//                 newRedeemFeeBps: 80,
//             })
//         );

//         let res = await txBuilder.sendAndConfirm(umi, {
//             send: { skipPreflight: false },
//         });

//         let tokenManagerAcc = await safeFetchTokenManager(umi, tokenManager);

//         assert.deepStrictEqual(
//             tokenManagerAcc.mintFeeBps,
//             80,
//             "Token manager's mint fee should be 80"
//         );
//         assert.deepStrictEqual(
//             tokenManagerAcc.redeemFeeBps,
//             80,
//             "Token manager's redeem fee should be 80"
//         );

//         //Test the  minting with the new fees set

//         let quantity = 10000 * 10 ** baseMintDecimals;
//         const proof = getMerkleProof(allowedWallets, keypair.publicKey.toBase58());

//         const userBaseAtaAcc = await safeFetchToken(umi, userBase);

//         txBuilder = new TransactionBuilder();

//         if (!userBaseAtaAcc) {
//             txBuilder = txBuilder.add(
//                 createAssociatedToken(umi, {
//                     mint: baseMint,
//                 })
//             );
//         }

//         let _tokenManagerAcc = await safeFetchTokenManager(umi, tokenManager);
//         let _vaultAcc = await safeFetchToken(umi, vaultIssuance);
//         let _baseMintAcc = await safeFetchMint(umi, baseMint);

//         txBuilder = txBuilder.add(
//             mint(umi, {
//                 tokenManager,
//                 mint: baseMint,
//                 quoteMint: quoteMint,
//                 payerMintAta: userBase,
//                 payerQuoteMintAta: userQuote,
//                 vault: vaultIssuance,
//                 associatedTokenProgram: SPL_ASSOCIATED_TOKEN_PROGRAM_ID,
//                 quantity,
//                 proof,
//             })
//         );

//         res = await txBuilder.sendAndConfirm(umi, {
//             send: { skipPreflight: false },
//         });

//         tokenManagerAcc = await safeFetchTokenManager(umi, tokenManager);
//         let vaultAcc = await safeFetchToken(umi, vaultIssuance);
//         let baseMintAcc = await safeFetchMint(umi, baseMint);

//         //const mintFeeBps = _tokenManagerAcc.mintFeeBps;
//         const mintFeeBps = tokenManagerAcc.mintFeeBps;
//         let feeAmount = (BigInt(quantity) * BigInt(mintFeeBps)) / BigInt(10000);
//         const expectedMintAmount = BigInt(quantity) - feeAmount;
//         const powerDifference = quoteMintDecimals - baseMintDecimals;

//         // Adjust quantity by the power difference before converting to BigInt
//         let adjustedQuantity;
//         if (powerDifference > 0) {
//             adjustedQuantity = BigInt(quantity) * BigInt(10 ** powerDifference);
//         } else if (powerDifference < 0) {
//             adjustedQuantity = BigInt(quantity) / BigInt(10 ** -powerDifference);
//         } else {
//             adjustedQuantity = BigInt(quantity);
//         }

//         // Calculate the expected quote amount
//         let expectedQuoteAmount =
//             (adjustedQuantity * BigInt(exchangeRate)) /
//             BigInt(10 ** exchangeRateDecimals);

//         assert.equal(
//             baseMintAcc.supply,
//             _baseMintAcc.supply + expectedMintAmount,
//             "Total supply should be correct"
//         );
//         assert.equal(
//             tokenManagerAcc.totalCollateral,
//             _tokenManagerAcc.totalCollateral + expectedQuoteAmount,
//             "Total collateral should be correct"
//         );
//         assert.equal(
//             vaultAcc.amount,
//             _vaultAcc.amount + expectedQuoteAmount,
//             "Vault amount should be correct"
//         );

//         //Test the  redeeming with the new fees set

//         //new quantity to be redeemed
//         quantity = 1000 * 10 ** baseMintDecimals;

//         const userQuoteAtaAcc = await safeFetchToken(umi, userQuote);

//         txBuilder = new TransactionBuilder();

//         if (!userQuoteAtaAcc) {
//             txBuilder = txBuilder.add(
//                 createAssociatedToken(umi, {
//                     mint: userQuote,
//                 })
//             );
//         }

//         _tokenManagerAcc = await safeFetchTokenManager(umi, tokenManager);
//         _vaultAcc = await safeFetchToken(umi, vaultIssuance);
//         _baseMintAcc = await safeFetchMint(umi, baseMint);

//         txBuilder = txBuilder.add(
//             redeem(umi, {
//                 tokenManager,
//                 mint: baseMint,
//                 quoteMint: quoteMint,
//                 payerMintAta: userBase,
//                 payerQuoteMintAta: userQuote,
//                 vault: vaultIssuance,
//                 payer: umi.identity,
//                 associatedTokenProgram: SPL_ASSOCIATED_TOKEN_PROGRAM_ID,
//                 quantity,
//                 proof,
//             })
//         );

//         res = await txBuilder.sendAndConfirm(umi, {
//             send: { skipPreflight: false },
//         });

//         tokenManagerAcc = await safeFetchTokenManager(umi, tokenManager);
//         vaultAcc = await safeFetchToken(umi, vaultIssuance);
//         baseMintAcc = await safeFetchMint(umi, baseMint);

//         expectedQuoteAmount =
//             (((BigInt(quantity) / BigInt(10 ** baseMintDecimals)) *
//                 BigInt(exchangeRate)) /
//                 BigInt(10 ** exchangeRateDecimals)) *
//             BigInt(10 ** quoteMintDecimals);
//         const redeemFeeBps = tokenManagerAcc.redeemFeeBps;
//         feeAmount = (BigInt(quantity) * BigInt(redeemFeeBps)) / BigInt(10000);
//         const expectedQuoteAmountAfterFees = expectedQuoteAmount - feeAmount;

//         assert.equal(
//             baseMintAcc.supply,
//             _baseMintAcc.supply - BigInt(quantity),
//             "Total supply should be correct"
//         );
//         assert.equal(
//             tokenManagerAcc.totalCollateral,
//             _tokenManagerAcc.totalCollateral - expectedQuoteAmountAfterFees,
//             "Total collateral should be correct"
//         );
//         assert.equal(
//             vaultAcc.amount,
//             _vaultAcc.amount - expectedQuoteAmountAfterFees,
//             "Vault amount should be correct"
//         );
//     });

//     it("should update the mint and redeem fee with zero ", async () => {
//         //set mint fee and redeem fee of zero
//         let txBuilder = new TransactionBuilder().add(
//             updateTokenManagerOwner(umi, {
//                 tokenManager,
//                 owner: umi.identity,
//                 newAdmin: null,
//                 newMinter: null,
//                 emergencyFundBasisPoints: null,
//                 newWithdrawTimeLock: null,
//                 newWithdrawExecutionWindow: null,
//                 newMintFeeBps: 0,
//                 newRedeemFeeBps: 0,
//             })
//         );

//         let res = await txBuilder.sendAndConfirm(umi, {
//             send: { skipPreflight: false },
//         });

//         let tokenManagerAcc = await safeFetchTokenManager(umi, tokenManager);

//         assert.deepStrictEqual(
//             tokenManagerAcc.mintFeeBps,
//             0,
//             "Token manager's mint fee should be 0"
//         );
//         assert.deepStrictEqual(
//             tokenManagerAcc.redeemFeeBps,
//             0,
//             "Token manager's redeem fee should be 0"
//         );

//         //Test the  minting with the new fees set

//         let quantity = 10000 * 10 ** baseMintDecimals;
//         const proof = getMerkleProof(allowedWallets, keypair.publicKey.toBase58());

//         const userBaseAtaAcc = await safeFetchToken(umi, userBase);

//         txBuilder = new TransactionBuilder();

//         if (!userBaseAtaAcc) {
//             txBuilder = txBuilder.add(
//                 createAssociatedToken(umi, {
//                     mint: baseMint,
//                 })
//             );
//         }

//         let _tokenManagerAcc = await safeFetchTokenManager(umi, tokenManager);
//         let _vaultAcc = await safeFetchToken(umi, vaultIssuance);
//         let _baseMintAcc = await safeFetchMint(umi, baseMint);

//         txBuilder = txBuilder.add(
//             mint(umi, {
//                 tokenManager,
//                 mint: baseMint,
//                 quoteMint: quoteMint,
//                 payerMintAta: userBase,
//                 payerQuoteMintAta: userQuote,
//                 vault: vaultIssuance,
//                 associatedTokenProgram: SPL_ASSOCIATED_TOKEN_PROGRAM_ID,
//                 quantity,
//                 proof,
//             })
//         );

//         res = await txBuilder.sendAndConfirm(umi, {
//             send: { skipPreflight: false },
//         });

//         tokenManagerAcc = await safeFetchTokenManager(umi, tokenManager);
//         let vaultAcc = await safeFetchToken(umi, vaultIssuance);
//         let baseMintAcc = await safeFetchMint(umi, baseMint);

//         //const mintFeeBps = _tokenManagerAcc.mintFeeBps;
//         const mintFeeBps = tokenManagerAcc.mintFeeBps;
//         let feeAmount = (BigInt(quantity) * BigInt(mintFeeBps)) / BigInt(10000);
//         const expectedMintAmount = BigInt(quantity) - feeAmount;
//         const powerDifference = quoteMintDecimals - baseMintDecimals;

//         // Adjust quantity by the power difference before converting to BigInt
//         let adjustedQuantity;
//         if (powerDifference > 0) {
//             adjustedQuantity = BigInt(quantity) * BigInt(10 ** powerDifference);
//         } else if (powerDifference < 0) {
//             adjustedQuantity = BigInt(quantity) / BigInt(10 ** -powerDifference);
//         } else {
//             adjustedQuantity = BigInt(quantity);
//         }

//         // Calculate the expected quote amount
//         let expectedQuoteAmount =
//             (adjustedQuantity * BigInt(exchangeRate)) /
//             BigInt(10 ** exchangeRateDecimals);

//         assert.equal(
//             baseMintAcc.supply,
//             _baseMintAcc.supply + expectedMintAmount,
//             "Total supply should be correct"
//         );
//         assert.equal(
//             tokenManagerAcc.totalCollateral,
//             _tokenManagerAcc.totalCollateral + expectedQuoteAmount,
//             "Total collateral should be correct"
//         );
//         assert.equal(
//             vaultAcc.amount,
//             _vaultAcc.amount + expectedQuoteAmount,
//             "Vault amount should be correct"
//         );

//         //Test the  redeeming with the new fees set

//         //new quantity to be redeemed
//         quantity = 1000 * 10 ** baseMintDecimals;

//         const userQuoteAtaAcc = await safeFetchToken(umi, userQuote);

//         txBuilder = new TransactionBuilder();

//         if (!userQuoteAtaAcc) {
//             txBuilder = txBuilder.add(
//                 createAssociatedToken(umi, {
//                     mint: userQuote,
//                 })
//             );
//         }

//         _tokenManagerAcc = await safeFetchTokenManager(umi, tokenManager);
//         _vaultAcc = await safeFetchToken(umi, vaultIssuance);
//         _baseMintAcc = await safeFetchMint(umi, baseMint);

//         txBuilder = txBuilder.add(
//             redeem(umi, {
//                 tokenManager,
//                 mint: baseMint,
//                 quoteMint: quoteMint,
//                 payerMintAta: userBase,
//                 payerQuoteMintAta: userQuote,
//                 vault: vaultIssuance,
//                 payer: umi.identity,
//                 associatedTokenProgram: SPL_ASSOCIATED_TOKEN_PROGRAM_ID,
//                 quantity,
//                 proof,
//             })
//         );

//         res = await txBuilder.sendAndConfirm(umi, {
//             send: { skipPreflight: false },
//         });

//         tokenManagerAcc = await safeFetchTokenManager(umi, tokenManager);
//         vaultAcc = await safeFetchToken(umi, vaultIssuance);
//         baseMintAcc = await safeFetchMint(umi, baseMint);

//         expectedQuoteAmount =
//             (((BigInt(quantity) / BigInt(10 ** baseMintDecimals)) *
//                 BigInt(exchangeRate)) /
//                 BigInt(10 ** exchangeRateDecimals)) *
//             BigInt(10 ** quoteMintDecimals);
//         const redeemFeeBps = tokenManagerAcc.redeemFeeBps;
//         feeAmount = (BigInt(quantity) * BigInt(redeemFeeBps)) / BigInt(10000);
//         const expectedQuoteAmountAfterFees = expectedQuoteAmount - feeAmount;

//         assert.equal(
//             baseMintAcc.supply,
//             _baseMintAcc.supply - BigInt(quantity),
//             "Total supply should be correct"
//         );
//         assert.equal(
//             tokenManagerAcc.totalCollateral,
//             _tokenManagerAcc.totalCollateral - expectedQuoteAmountAfterFees,
//             "Total collateral should be correct"
//         );
//         assert.equal(
//             vaultAcc.amount,
//             _vaultAcc.amount - expectedQuoteAmountAfterFees,
//             "Vault amount should be correct"
//         );
//     });

//     // START: Stake Program
//     it.only("baseMint can be staked for xMint", async () => {
//         let quantity = 1000 * 10 ** baseMintDecimals;

//         let txBuilder = new TransactionBuilder();

//         const userXAtaAcc = await safeFetchToken(umi, userX);

//         if (!userXAtaAcc) {
//             txBuilder = txBuilder.add(
//                 createAssociatedToken(umi, {
//                     mint: xMint,
//                 })
//             );
//         }

//         const _stakePoolAcc = await safeFetchPoolManager(umi, poolManager);
//         const _xMintAcc = await safeFetchMint(umi, xMint);
//         const _vaultAcc = await safeFetchToken(umi, vaultStaking);

//         txBuilder = txBuilder.add(
//             stake(umi, {
//                 poolManager,
//                 baseMint,
//                 xMint,
//                 payerBaseMintAta: userBase,
//                 payerXMintAta: userX,
//                 vault: vaultStaking,
//                 associatedTokenProgram: SPL_ASSOCIATED_TOKEN_PROGRAM_ID,
//                 quantity,
//             })
//         );

//         // console.log("Inception Timestamp:", Number(_stakePoolAcc.inceptionTimestamp));
//         // console.log("Current Timestamp:", Math.floor(Date.now() / 1000));
//         // console.log("Annual Yield Rate:", Number(_stakePoolAcc.annualYieldRate));
//         // console.log("Initial Exchange Rate:", Number(_stakePoolAcc.initialExchangeRate));

//         const exchangeRate = calculateExchangeRate(
//             Number(_stakePoolAcc.lastYieldChangeTimestamp),
//             Math.floor(Date.now() / 1000),
//             Number(_stakePoolAcc.intervalAprRate),
//             Number(_stakePoolAcc.lastYieldChangeExchangeRate),
//             Number(_stakePoolAcc.secondsPerInterval)
//         );
//         // console.log("Exchange Rate: ", exchangeRate);

//         await txBuilder.sendAndConfirm(umi);
//         //await txBuilder.sendAndConfirm(umi, { send: { skipPreflight: true } });

//         const stakePoolAcc = await safeFetchPoolManager(umi, poolManager);
//         const xMintAcc = await safeFetchMint(umi, xMint);
//         const vaultAcc = await safeFetchToken(umi, vaultStaking);

//         const expectedBaseMintAmount = BigInt(quantity);

//         const expectedxMintAmount = BigInt(
//             Math.floor((quantity / exchangeRate) * 10 ** baseMintDecimals)
//         );
//         // console.log("Expected xMint Amount: ", Number(expectedxMintAmount));
//         // console.log("xMint Supply start: ", Number(_xMintAcc.supply));
//         // console.log("xMint Supply end: ", Number(xMintAcc.supply));

//         assert.equal(
//             stakePoolAcc.baseBalance,
//             _stakePoolAcc.baseBalance + expectedBaseMintAmount,
//             "Base Balance is not correct"
//         );
//         assert.equal(
//             vaultAcc.amount,
//             _vaultAcc.amount + expectedBaseMintAmount,
//             "Vault amount is not correct"
//         );
//         chaiAssert.closeTo(
//             Number(xMintAcc.supply),
//             Number(_xMintAcc.supply) + Number(expectedxMintAmount),
//             300000,
//             "xSupply is not correct"
//         );

//         quantity = 1001 * 10 ** baseMintDecimals;
//         //Attempt to try and stake again which should fail because of deposit cap reached
//         txBuilder = new TransactionBuilder();

//         txBuilder = txBuilder.add(
//             stake(umi, {
//                 poolManager,
//                 baseMint,
//                 xMint,
//                 payerBaseMintAta: userBase,
//                 payerXMintAta: userX,
//                 vault: vaultStaking,
//                 associatedTokenProgram: SPL_ASSOCIATED_TOKEN_PROGRAM_ID,
//                 quantity,
//             })
//         );

//         await assert.rejects(
//             async () => {
//                 await txBuilder.sendAndConfirm(umi);
//             },
//             (err) => {
//                 return (err as Error).message.includes("Deposit cap exceeded");
//             },
//             "Expected staking to fail because Deposit cap exceeded"
//         );
//     });

//     it.only("baseMint can be unstaked by redeeming xMint", async () => {
//         // const quantity = 10000 * 10 ** baseMintDecimals;
//         let txBuilder = new TransactionBuilder();

//         const userBaseAtaAcc = await safeFetchToken(umi, userBase);

//         if (!userBaseAtaAcc) {
//             txBuilder = txBuilder.add(
//                 createAssociatedToken(umi, {
//                     mint: baseMint,
//                 })
//             );
//         }

//         const _stakePoolAcc = await safeFetchPoolManager(umi, poolManager);
//         const _xMintAcc = await safeFetchMint(umi, xMint);
//         const _vaultAcc = await safeFetchToken(umi, vaultStaking);

//         const quantity = Number(_xMintAcc.supply);
//         // console.log("Quantity: ", quantity);

//         txBuilder = txBuilder.add(
//             unstake(umi, {
//                 poolManager,
//                 baseMint,
//                 xMint,
//                 payerBaseMintAta: userBase,
//                 payerXMintAta: userX,
//                 vault: vaultStaking,
//                 associatedTokenProgram: SPL_ASSOCIATED_TOKEN_PROGRAM_ID,
//                 quantity,
//                 tokenManager,
//                 parityIssuanceProgram: PARITY_ISSUANCE_PROGRAM_ID,
//             })
//         );

//         // console.log("Inception Timestamp:", Number(_stakePoolAcc.inceptionTimestamp));
//         // console.log("Current Timestamp:", Math.floor(Date.now() / 1000));
//         // console.log("Annual Yield Rate:", Number(_stakePoolAcc.annualYieldRate));
//         // console.log("Initial Exchange Rate:", Number(_stakePoolAcc.initialExchangeRate));

//         const exchangeRate = calculateExchangeRate(
//             Number(_stakePoolAcc.lastYieldChangeTimestamp),
//             Math.floor(Date.now() / 1000),
//             Number(_stakePoolAcc.intervalAprRate),
//             Number(_stakePoolAcc.lastYieldChangeExchangeRate),
//             Number(_stakePoolAcc.secondsPerInterval)
//         );
//         // console.log("Exchange Rate: ", exchangeRate);

//         await txBuilder.sendAndConfirm(umi, { send: { skipPreflight: false } });

//         const stakePoolAcc = await safeFetchPoolManager(umi, poolManager);
//         const xMintAcc = await safeFetchMint(umi, xMint);
//         const vaultAcc = await safeFetchToken(umi, vaultStaking);

//         const expectedBaseMintAmount = BigInt(
//             Math.floor((quantity * exchangeRate) / 10 ** baseMintDecimals)
//         );
//         // console.log("Expected Base Mint Amount: ", Number(expectedBaseMintAmount));
//         // console.log("Base Balance Start: ", Number(_stakePoolAcc.baseBalance));
//         // console.log("Base Balance end: ", Number(stakePoolAcc.baseBalance));

//         const expectedxMintAmount = BigInt(quantity);

//         chaiAssert.equal(
//             Number(stakePoolAcc.baseBalance),
//             0,
//             "Base Balance is not correct"
//         );
//         chaiAssert.equal(Number(vaultAcc.amount), 0, "Vault amount is not correct");
//         chaiAssert.equal(
//             xMintAcc.supply,
//             _xMintAcc.supply - expectedxMintAmount,
//             "xSupply is not correct"
//         );
//     });

//     it("should update the annual yield rate of the stake pool", async function () {
//         const annualYieldRate = 2500; // in Basis points
//         const intervalSeconds = 60 * 60 * 8; // 8 hour interval

//         const intervalRate = calculateIntervalRate(
//             annualYieldRate,
//             intervalSeconds
//         );
//         // console.log("Interval Rate: ", Number(intervalRate));

//         let txBuilder = new TransactionBuilder();

//         txBuilder = txBuilder.add(
//             updateAnnualYield(umi, {
//                 poolManager,
//                 admin: umi.identity,
//                 intervalAprRate: intervalRate,
//                 tokenManager,
//                 xMint,
//                 parityIssuanceProgram: PARITY_ISSUANCE_PROGRAM_ID,
//                 associatedTokenProgram: SPL_ASSOCIATED_TOKEN_PROGRAM_ID,
//                 vault: vaultStaking,
//                 baseMint: baseMint,
//             })
//         );

//         await txBuilder.sendAndConfirm(umi);

//         const stakePoolAcc = await safeFetchPoolManager(umi, poolManager);

//         assert.equal(
//             stakePoolAcc.intervalAprRate,
//             intervalRate,
//             "Annual yield rate should be updated to 25.00%"
//         );
//     });

//     it("should initiate and accept pool owner update", async () => {
//         const newAdmin = umi.eddsa.generateKeypair();

//         await umi.rpc.airdrop(
//             newAdmin.publicKey,
//             createAmount(100_000 * 10 ** 9, "SOL", 9),
//             {
//                 commitment: "finalized",
//             }
//         );

//         // Initiate update of pool owner
//         let txBuilder = new TransactionBuilder();
//         txBuilder = txBuilder.add(
//             initiateUpdatePoolOwner(umi, {
//                 poolManager,
//                 newOwner: newAdmin.publicKey,
//                 owner: umi.identity,
//             })
//         );
//         await txBuilder.sendAndConfirm(umi);

//         // Check if the update initiation was successful
//         let poolManagerAcc = await safeFetchPoolManager(umi, poolManager);
//         assert.equal(
//             poolManagerAcc.pendingOwner,
//             newAdmin.publicKey,
//             "Pending owner should be set to new admin"
//         );

//         // Accept update of pool owner
//         umi.use(keypairIdentity(newAdmin)); // Switch to new admin
//         txBuilder = new TransactionBuilder();
//         txBuilder = txBuilder.add(
//             updatePoolOwner(umi, {
//                 poolManager,
//                 newOwner: umi.identity,
//             })
//         );
//         await txBuilder.sendAndConfirm(umi);

//         // Verify the new admin is set
//         poolManagerAcc = await safeFetchPoolManager(umi, poolManager);

//         assert.equal(
//             poolManagerAcc.owner,
//             newAdmin.publicKey,
//             "owner should be updated to new owner"
//         );
//         assert.equal(
//             poolManagerAcc.pendingOwner,
//             publicKey("11111111111111111111111111111111"),
//             "Pending owner should be set to default pubkey"
//         );

//         // Change back
//         txBuilder = new TransactionBuilder();
//         txBuilder = txBuilder.add(
//             initiateUpdatePoolOwner(umi, {
//                 poolManager,
//                 newOwner: fromWeb3JsKeypair(keypair).publicKey,
//                 owner: umi.identity,
//             })
//         );
//         await txBuilder.sendAndConfirm(umi);

//         // Accept update back to original admin
//         umi.use(keypairIdentity(fromWeb3JsKeypair(keypair))); // Switch to new admin

//         txBuilder = new TransactionBuilder();
//         txBuilder = txBuilder.add(
//             updatePoolOwner(umi, {
//                 poolManager,
//                 newOwner: umi.identity,
//             })
//         );
//         await txBuilder.sendAndConfirm(umi);

//         // Verify the admin is set back to original
//         poolManagerAcc = await safeFetchPoolManager(umi, poolManager);
//         assert.equal(
//             poolManagerAcc.admin,
//             keypair.publicKey.toBase58(),
//             "Admin should be reverted back to original admin"
//         );
//     });

//     it("should update deposit cap parity staking", async () => {
//         const notOwner = umi.eddsa.generateKeypair();
//         const newDespositCap = testDepositCapAmount;

//         await umi.rpc.airdrop(
//             notOwner.publicKey,
//             createAmount(100_000 * 10 ** 9, "SOL", 9),
//             {
//                 commitment: "finalized",
//             }
//         );

//         //Attempt trying to update deposit cap with a signer that's not the Owner
//         umi.use(keypairIdentity(notOwner));

//         let txBuilder = new TransactionBuilder();
//         txBuilder = txBuilder.add(
//             updatePoolManager(umi, {
//                 poolManager,
//                 owner: umi.identity,
//                 newAdmin: null,
//                 newDepositCap: newDespositCap,
//             })
//         );

//         await assert.rejects(
//             async () => {
//                 await txBuilder.sendAndConfirm(umi);
//             },
//             (err) => {
//                 return (err as Error).message.includes("Invalid owner");
//             },
//             "Expected updating pool manager to fail because of Invalid owner"
//         );

//         //Attempt trying to change update deposit cap with the right Owner

//         umi.use(keypairIdentity(fromWeb3JsKeypair(keypair)));

//         txBuilder = new TransactionBuilder();
//         txBuilder = txBuilder.add(
//             updatePoolManager(umi, {
//                 poolManager,
//                 owner: umi.identity,
//                 newAdmin: null,
//                 newDepositCap: newDespositCap,
//             })
//         );

//         await txBuilder.sendAndConfirm(umi);

//         //verify the updated deposit cap is set
//         let poolManagerAcc = await safeFetchPoolManager(umi, poolManager);

//         assert.equal(
//             poolManagerAcc.depositCap,
//             newDespositCap,
//             "deposit cap should be updated "
//         );

//         let quantity = 1000 * 10 ** baseMintDecimals;

//         //Attempt  staking to test if it works
//         //This should work since deposit cap variable has been increased
//         txBuilder = new TransactionBuilder();

//         const userXAtaAcc = await safeFetchToken(umi, userX);

//         if (!userXAtaAcc) {
//             txBuilder = txBuilder.add(
//                 createAssociatedToken(umi, {
//                     mint: xMint,
//                 })
//             );
//         }

//         txBuilder = txBuilder.add(
//             stake(umi, {
//                 poolManager,
//                 baseMint,
//                 xMint,
//                 payerBaseMintAta: userBase,
//                 payerXMintAta: userX,
//                 vault: vaultStaking,
//                 associatedTokenProgram: SPL_ASSOCIATED_TOKEN_PROGRAM_ID,
//                 quantity,
//             })
//         );

//         await txBuilder.sendAndConfirm(umi);

//         //Attempt to try and stake again which should fail because of deposit cap reached
//         quantity = 1001 * 10 ** baseMintDecimals;

//         txBuilder = new TransactionBuilder();

//         txBuilder = txBuilder.add(
//             stake(umi, {
//                 poolManager,
//                 baseMint,
//                 xMint,
//                 payerBaseMintAta: userBase,
//                 payerXMintAta: userX,
//                 vault: vaultStaking,
//                 associatedTokenProgram: SPL_ASSOCIATED_TOKEN_PROGRAM_ID,
//                 quantity,
//             })
//         );

//         await assert.rejects(
//             async () => {
//                 await txBuilder.sendAndConfirm(umi);
//             },
//             (err) => {
//                 return (err as Error).message.includes("Deposit cap exceeded");
//             },
//             "Expected staking to fail because Deposit cap exceeded"
//         );
//     });

//     it("should accept pool manager update", async () => {
//         const newOwner = umi.eddsa.generateKeypair();
//         const newAdmin = umi.eddsa.generateKeypair();

//         await umi.rpc.airdrop(
//             newAdmin.publicKey,
//             createAmount(100_000 * 10 ** 9, "SOL", 9),
//             {
//                 commitment: "finalized",
//             }
//         );

//         await umi.rpc.airdrop(
//             newOwner.publicKey,
//             createAmount(100_000 * 10 ** 9, "SOL", 9),
//             {
//                 commitment: "finalized",
//             }
//         );

//         //Attempt trying to change pool manager with the wrong previous owner

//         umi.use(keypairIdentity(newOwner));

//         let txBuilder = new TransactionBuilder();
//         txBuilder = txBuilder.add(
//             updatePoolManager(umi, {
//                 poolManager,
//                 owner: umi.identity,
//                 newAdmin: newAdmin.publicKey,
//                 newDepositCap: null,
//             })
//         );

//         await assert.rejects(
//             async () => {
//                 await txBuilder.sendAndConfirm(umi);
//             },
//             (err) => {
//                 return (err as Error).message.includes("Invalid owner");
//             },
//             "Expected updating pool manager to fail because of Invalid owner"
//         );

//         //Attempt trying to change pool manager with the right owner

//         umi.use(keypairIdentity(fromWeb3JsKeypair(keypair)));

//         txBuilder = new TransactionBuilder();
//         txBuilder = txBuilder.add(
//             updatePoolManager(umi, {
//                 poolManager,
//                 owner: umi.identity,
//                 newAdmin: newAdmin.publicKey,
//                 newDepositCap: null,
//             })
//         );

//         await txBuilder.sendAndConfirm(umi);

//         // Verify the new admin and owner is set
//         let poolManagerAcc = await safeFetchPoolManager(umi, poolManager);

//         assert.equal(
//             poolManagerAcc.admin,
//             newAdmin.publicKey,
//             "admin should be updated to new admin"
//         );

//         // Change the owner and admin back
//         umi.use(keypairIdentity(fromWeb3JsKeypair(keypair)));

//         txBuilder = new TransactionBuilder();
//         txBuilder = txBuilder.add(
//             updatePoolManager(umi, {
//                 poolManager,
//                 owner: umi.identity,
//                 newAdmin: fromWeb3JsKeypair(keypair).publicKey,
//                 newDepositCap: null,
//             })
//         );

//         await txBuilder.sendAndConfirm(umi);

//         // Verify the owner and admin is set back to original
//         poolManagerAcc = await safeFetchPoolManager(umi, poolManager);

//         assert.equal(
//             poolManagerAcc.admin,
//             keypair.publicKey,
//             "admin should be updated to new admin"
//         );
//     });

//     it("should update xMint metadata of stake program", async () => {
//         const name = "TEST";
//         const symbol = "TEST";
//         const uri = "https://example.com/new-xmint-info.json";

//         let txBuilder = new TransactionBuilder();
//         txBuilder = txBuilder.add(
//             updateXmintMetadata(umi, {
//                 poolManager,
//                 metadataAccount: xMetadata,
//                 name,
//                 symbol,
//                 uri,
//                 owner: umi.identity,
//             })
//         );

//         await txBuilder.sendAndConfirm(umi);

//         const xMintMetadata = await safeFetchMetadata(umi, xMetadata);
//         assert.equal(xMintMetadata.name, name, "Name should be updated");
//         assert.equal(xMintMetadata.symbol, symbol, "Symbol should be updated");
//         assert.equal(xMintMetadata.uri, uri, "Uri should be updated");
//     });

//     // START: PT Staking program
//     it("baseMint can be staked in PT Staking", async () => {
//         let quantity = 1000 * 10 ** baseMintDecimals;

//         // Attempt staking without creating the userStake acccount
//         // This should fail
//         let txBuilder = new TransactionBuilder();

//         txBuilder = txBuilder.add(
//             ptStake(umi, {
//                 globalConfig,
//                 userStake: userStakePDA,
//                 baseMint: baseMint,
//                 userBaseMintAta: userBase,
//                 user: umi.identity,
//                 vault: vaultStakingPDA,
//                 associatedTokenProgram: SPL_ASSOCIATED_TOKEN_PROGRAM_ID,
//                 quantity: quantity,
//             })
//         );

//         await assert.rejects(
//             async () => {
//                 await txBuilder.sendAndConfirm(umi);
//             },
//             (err) => {
//                 return (err as Error).message.includes(
//                     "The program expected this account to be already initialized."
//                 );
//             },
//             "Expected staking to fail because account isnt initialized"
//         );

//         // Create userStake acccount
//         txBuilder = new TransactionBuilder();

//         txBuilder = txBuilder.add(
//             initPtStake(umi, {
//                 userStake: userStakePDA,
//                 user: umi.identity,
//             })
//         );

//         await txBuilder.sendAndConfirm(umi);

//         const _userStakeAcc = await safeFetchUserStake(umi, userStakePDA);

//         assert.equal(_userStakeAcc.userPubkey, umi.identity.publicKey);
//         assert.equal(_userStakeAcc.stakedAmount, 0, "Staked amount should be zero");
//         assert.equal(
//             _userStakeAcc.initialStakingTimestamp,
//             0,
//             "initial staking time should be zero"
//         );

//         // Attempt staking after userStake acccount has been created
//         // This should succeed
//         txBuilder = new TransactionBuilder();

//         txBuilder = txBuilder.add(
//             ptStake(umi, {
//                 globalConfig,
//                 userStake: userStakePDA,
//                 baseMint: baseMint,
//                 userBaseMintAta: userBase,
//                 user: umi.identity,
//                 vault: vaultStakingPDA,
//                 associatedTokenProgram: SPL_ASSOCIATED_TOKEN_PROGRAM_ID,
//                 quantity: quantity,
//             })
//         );

//         await txBuilder.sendAndConfirm(umi);

//         const globalConfigAcc = await safeFetchGlobalConfig(umi, globalConfig);
//         const userStakeAcc = await safeFetchUserStake(umi, userStakePDA);
//         const vaultAcc = await safeFetchToken(umi, vaultStakingPDA);

//         // console.log("ptstaking last claim timestamp", userStakeAcc.lastClaimTimestamp);
//         // console.log("Vault Acc: ", vaultAcc);
//         // console.log("User Stake Acc: ", userStakeAcc);
//         // console.log("Global Config Acc: ", globalConfigAcc);

//         assert.equal(vaultAcc.amount, quantity);
//         assert.equal(userStakeAcc.stakedAmount, quantity);
//         assert.equal(globalConfigAcc.stakedSupply, quantity);
//         assert.equal(globalConfigAcc.stakingVault, vaultAcc.publicKey);
//     });

//     it("baseMint can be unstaked in PT Staking", async () => {
//         let quantity = 1000 * 10 ** baseMintDecimals;

//         // Fetch accounts before unstaking
//         const globalConfigAcc = await safeFetchGlobalConfig(umi, globalConfig);
//         const userStakeAcc = await safeFetchUserStake(umi, userStakePDA);
//         const vaultAcc = await safeFetchToken(umi, vaultStakingPDA);
//         const userBaseAcc = await safeFetchToken(umi, userBase);

//         let txBuilder = new TransactionBuilder();

//         txBuilder = txBuilder.add(
//             ptUnstake(umi, {
//                 globalConfig,
//                 userStake: userStakePDA,
//                 baseMint: baseMint,
//                 userBaseMintAta: userBase,
//                 user: umi.identity,
//                 vault: vaultStakingPDA,
//                 associatedTokenProgram: SPL_ASSOCIATED_TOKEN_PROGRAM_ID,
//                 quantity,
//             })
//         );

//         const res = await txBuilder.sendAndConfirm(umi);
//         // console.log(bs58.encode(res.signature));

//         // Fetch accounts after unstaking
//         const _globalConfigAcc = await safeFetchGlobalConfig(umi, globalConfig);
//         const _userStakeAcc = await safeFetchUserStake(umi, userStakePDA);
//         const _vaultAcc = await safeFetchToken(umi, vaultStakingPDA);
//         const _userBaseAcc = await safeFetchToken(umi, userBase);

//         // console.log(_userStakeAcc);
//         // console.log(_globalConfigAcc);

//         const pointsHistory = _userStakeAcc.pointsHistory;

//         // console.log("Points History: ", pointsHistory[0].points);
//         // console.log("Points History full: ", pointsHistory);

//         // We are using the updated lastclain timestamp as the current time 
//         const expectedPoints = calculatePoints(
//             _globalConfigAcc,
//             BigInt(quantity),
//             Number(userStakeAcc.lastClaimTimestamp),
//             Number(_userStakeAcc.lastClaimTimestamp)
//         );

//         // console.log("expected points", expectedPoints[0].points)
//         // console.log("expected points full", expectedPoints);

//         // Assert the changes
//         assert.equal(
//             _vaultAcc.amount,
//             vaultAcc.amount - BigInt(quantity),
//             "Vault balance should decrease by unstaked amount"
//         );
//         assert.equal(
//             _userStakeAcc.stakedAmount,
//             userStakeAcc.stakedAmount - BigInt(quantity),
//             "User staked amount should decrease"
//         );
//         assert.equal(
//             _globalConfigAcc.stakedSupply,
//             globalConfigAcc.stakedSupply - BigInt(quantity),
//             "Global staked supply should decrease"
//         );

//         // Assert calculated points
//         assert.equal(
//             pointsHistory[0].points,
//             expectedPoints[0].points,
//             "Calculated points should match the points in history"
//         );

//         // Check if user received the unstaked tokens
//         const expectedUserBalance = userBaseAcc.amount + BigInt(quantity);
//         assert.equal(
//             _userBaseAcc.amount,
//             expectedUserBalance,
//             "User should receive unstaked tokens"
//         );

//         // // TODO: Add assertions for points calculation if applicable
//         // Check that the points were calculated within a single phase
//         assert.equal(pointsHistory.length, 1, "Only one phase should be involved");
//         assert.equal(
//             pointsHistory[0].index,
//             0,
//             "The phase index should be 0 (initial phase)"
//         );

//         // Attempt unstaking with a user thats not the owner
//         // which should fail
//         const newUser = umi.eddsa.generateKeypair();

//         await umi.rpc.airdrop(
//             newUser.publicKey,
//             createAmount(100_000 * 10 ** 9, "SOL", 9),
//             {
//                 commitment: "finalized",
//             }
//         );

//         umi.use(keypairIdentity(newUser));

//         txBuilder = new TransactionBuilder();

//         txBuilder = txBuilder.add(
//             ptUnstake(umi, {
//                 globalConfig,
//                 userStake: userStakePDA,
//                 baseMint: baseMint,
//                 userBaseMintAta: userBase,
//                 user: umi.identity,
//                 vault: vaultStakingPDA,
//                 associatedTokenProgram: SPL_ASSOCIATED_TOKEN_PROGRAM_ID,
//                 quantity,
//             })
//         );

//         await assert.rejects(
//             async () => {
//                 await txBuilder.sendAndConfirm(umi);
//             },
//             (err) => {
//                 return (err as Error).message.includes(
//                     " A seeds constraint was violated"
//                 );
//             },
//             "Expected unstaking error as user isnt the owner of PDA"
//         );

//         umi.use(keypairIdentity(fromWeb3JsKeypair(keypair))); // Switch back to  admin
//     });

//     it("should initiate and accept global config owner update", async () => {
//         const newOwner = umi.eddsa.generateKeypair();

//         await umi.rpc.airdrop(
//             newOwner.publicKey,
//             createAmount(100_000 * 10 ** 9, "SOL", 9),
//             {
//                 commitment: "finalized",
//             }
//         );
//         umi.use(keypairIdentity(fromWeb3JsKeypair(keypair))); // Switch to new admin

//         // Initiate update of tokenManager owner
//         let txBuilder = new TransactionBuilder();
//         txBuilder = txBuilder.add(
//             initiateUpdateGlobalConfigOwner(umi, {
//                 globalConfig,
//                 newOwner: newOwner.publicKey,
//                 owner: umi.identity,
//             })
//         );
//         await txBuilder.sendAndConfirm(umi);

//         // Check if the update initiation was successful
//         let globalConfigAcc = await safeFetchGlobalConfig(umi, globalConfig);

//         assert.equal(
//             globalConfigAcc.pendingOwner,
//             newOwner.publicKey,
//             "Pending owner should be set to new admin"
//         );

//         // Accept update of manager owner
//         umi.use(keypairIdentity(newOwner)); // Switch to new admin
//         txBuilder = new TransactionBuilder();
//         txBuilder = txBuilder.add(
//             updateGlobalConfigOwner(umi, {
//                 globalConfig,
//                 newOwner: umi.identity,
//             })
//         );
//         await txBuilder.sendAndConfirm(umi);

//         // Verify the new owner is set
//         globalConfigAcc = await safeFetchGlobalConfig(umi, globalConfig);
//         assert.equal(
//             globalConfigAcc.owner,
//             newOwner.publicKey,
//             "owner should be updated to new owner"
//         );
//         assert.equal(
//             globalConfigAcc.pendingOwner,
//             publicKey("11111111111111111111111111111111"),
//             "Pending owner should be set to default pubkey"
//         );

//         // Change back
//         txBuilder = new TransactionBuilder();
//         txBuilder = txBuilder.add(
//             initiateUpdateGlobalConfigOwner(umi, {
//                 globalConfig,
//                 newOwner: fromWeb3JsKeypair(keypair).publicKey,
//                 owner: umi.identity,
//             })
//         );
//         await txBuilder.sendAndConfirm(umi);

//         // Accept update back to original admin
//         umi.use(keypairIdentity(fromWeb3JsKeypair(keypair))); // Switch back to original admin
//         txBuilder = new TransactionBuilder();
//         txBuilder = txBuilder.add(
//             updateGlobalConfigOwner(umi, {
//                 globalConfig,
//                 newOwner: umi.identity,
//             })
//         );
//         await txBuilder.sendAndConfirm(umi);

//         // Verify the admin is set back to original
//         globalConfigAcc = await safeFetchGlobalConfig(umi, globalConfig);
//         assert.equal(
//             globalConfigAcc.admin,
//             publicKey(keypair.publicKey),
//             "Admin should be reverted back to original admin"
//         );
//     });

//     it("should update Pt Staking global config", async () => {
//         const notOwner = umi.eddsa.generateKeypair();
//         const newBaselineYield = 5000; // For 50%
//         const newExchangeRatePtStaking = 30 * 10 ** baseMintDecimals;
//         const newDespositCap = testDepositCapAmount;

//         await umi.rpc.airdrop(
//             notOwner.publicKey,
//             createAmount(100_000 * 10 ** 9, "SOL", 9),
//             {
//                 commitment: "finalized",
//             }
//         );

//         // Attempt trying to update with a signer that's not the Owner
//         umi.use(keypairIdentity(notOwner));

//         let txBuilder = new TransactionBuilder();
//         txBuilder = txBuilder.add(
//             updateGlobalConfig(umi, {
//                 globalConfig,
//                 owner: umi.identity,
//                 newBaselineYieldBps: newBaselineYield,
//                 newExchangeRate: newExchangeRatePtStaking,
//                 newDepositCap: newDespositCap,
//             })
//         );

//         await assert.rejects(
//             async () => {
//                 await txBuilder.sendAndConfirm(umi);
//             },
//             (err) => {
//                 return (err as Error).message.includes("Invalid owner");
//             },
//             "Expected updating global config to fail because of Invalid owner"
//         );

//         // Attempt trying to change update  with the right Owner
//         umi.use(keypairIdentity(fromWeb3JsKeypair(keypair)));

//         txBuilder = new TransactionBuilder();
//         txBuilder = txBuilder.add(
//             updateGlobalConfig(umi, {
//                 globalConfig,
//                 owner: umi.identity,
//                 newBaselineYieldBps: newBaselineYield,
//                 newExchangeRate: newExchangeRatePtStaking,
//                 newDepositCap: newDespositCap,
//             })
//         );

//         const res = await txBuilder.sendAndConfirm(umi);
//         // console.log(bs58.encode(res.signature));

//         // Verify the updated global config is set
//         const globalConfigAcc = await safeFetchGlobalConfig(umi, globalConfig);

//         assert.equal(
//             globalConfigAcc.baseYieldHistory[globalConfigAcc.baseYieldHistory.length - 1].baseYieldBps,
//             newBaselineYield,
//             "base line yield should be updated"
//         );
//         assert.equal(
//             globalConfigAcc.depositCap,
//             newDespositCap,
//             "deposit cap should be updated"
//         );
//         assert.equal(
//             globalConfigAcc.exchangeRateHistory[globalConfigAcc.exchangeRateHistory.length - 1].exchangeRate,
//             newExchangeRatePtStaking,
//             "exchange rate should be updated"
//         );

//         let quantity = 1000 * 10 ** baseMintDecimals;

//         // Attempt  staking to test if deposit cap works
//         // This should work since deposit cap variable has been increased
//         txBuilder = new TransactionBuilder();

//         txBuilder = txBuilder.add(
//             ptStake(umi, {
//                 globalConfig,
//                 userStake: userStakePDA,
//                 baseMint: baseMint,
//                 userBaseMintAta: userBase,
//                 user: umi.identity,
//                 vault: vaultStakingPDA,
//                 associatedTokenProgram: SPL_ASSOCIATED_TOKEN_PROGRAM_ID,
//                 quantity: quantity,
//             })
//         );

//         await txBuilder.sendAndConfirm(umi);

//         //Attempt to try and stake again which should fail because of deposit cap reached
//         quantity = 1001 * 10 ** baseMintDecimals;

//         txBuilder = new TransactionBuilder();

//         txBuilder = txBuilder.add(
//             ptStake(umi, {
//                 globalConfig,
//                 userStake: userStakePDA,
//                 baseMint: baseMint,
//                 userBaseMintAta: userBase,
//                 user: umi.identity,
//                 vault: vaultStakingPDA,
//                 associatedTokenProgram: SPL_ASSOCIATED_TOKEN_PROGRAM_ID,
//                 quantity: quantity,
//             })
//         );

//         await assert.rejects(
//             async () => {
//                 await txBuilder.sendAndConfirm(umi);
//             },
//             (err) => {
//                 return (err as Error).message.includes("Deposit cap exceeded");
//             },
//             "Expected staking to fail because Deposit cap exceeded"
//         );
//     });

//     it("dynamically increases account size for exchange rate and points history, and verifies PT staking reallocation", async () => {
//         const maxPhases = 5;
//         let quantity = 100 * 10 ** baseMintDecimals;

//         let globalConfigAcc = await safeFetchGlobalConfig(umi, globalConfig);

//         // We first of all increase the deposit cap
//         let newDepositCap = testDepositCapAmount * 100;
//         let txBuilder = new TransactionBuilder();
//         txBuilder = txBuilder.add(
//             updateGlobalConfig(umi, {
//                 globalConfig,
//                 owner: umi.identity,
//                 newBaselineYieldBps: null,
//                 newExchangeRate: null,
//                 newDepositCap: newDepositCap,
//             })
//         );

//         await txBuilder.sendAndConfirm(umi);

//         // Stake amount
//         txBuilder = new TransactionBuilder();
//         txBuilder = txBuilder.add(
//             ptStake(umi, {
//                 globalConfig,
//                 userStake: userStakePDA,
//                 baseMint: baseMint,
//                 userBaseMintAta: userBase,
//                 user: umi.identity,
//                 vault: vaultStakingPDA,
//                 associatedTokenProgram: SPL_ASSOCIATED_TOKEN_PROGRAM_ID,
//                 quantity: quantity,
//             })
//         );

//         await txBuilder.sendAndConfirm(umi);

//         // const _globalConfigAcc = await safeFetchGlobalConfig(umi, globalConfig);
//         // const _globalUserStake = await safeFetchUserStake(umi, userStakePDA);
//         // console.log("Original global points:", _globalConfigAcc.pointsHistory);
//         // console.log("Original global user points:", _globalUserStake.pointsHistory);

//         // Function to create a new exchange rate phase
//         const createExchangeRatePhase = (index: number) =>
//             (20 - index) * 10 ** baseMintDecimals; // Increase exchange rate each time

//         // Function to create a new baseline yield rate
//         const createBaselineYieldRate = (index: number) => {
//             const baseRate = 2000; // 20% as basis points
//             const increment = 300; // 3% increment as basis points
//             return baseRate + (index * increment);
//         };

//         // Add phases 
//         for (let i = globalConfigAcc.exchangeRateHistory.length; i < maxPhases; i++) {
//             const newExchangeRate = createExchangeRatePhase(i);
//             const newBaselineYieldBps = createBaselineYieldRate(i);

//             // Update global config (exchange rate)
//             let updateConfigTxBuilder = new TransactionBuilder();
//             updateConfigTxBuilder = updateConfigTxBuilder.add(
//                 updateGlobalConfig(umi, {
//                     globalConfig,
//                     owner: umi.identity,
//                     newBaselineYieldBps: newBaselineYieldBps,
//                     newExchangeRate: newExchangeRate,
//                     newDepositCap: null,
//                 })
//             );
//             await updateConfigTxBuilder.sendAndConfirm(umi);

//             // Add a delay to ensure clock advances
//             await new Promise((resolve) => setTimeout(resolve, 10000));

//             // Fetch and log global config after update
//             globalConfigAcc = await safeFetchGlobalConfig(umi, globalConfig);

//             console.log(
//                 `Phase ${i} added. Current exchange rate history size:`,
//                 globalConfigAcc.exchangeRateHistory.length
//             );
//             // console.log("Last exchange rate phase:", globalConfigAcc.exchangeRateHistory[i]);
//             // console.log("Last base yield phase:", globalConfigAcc.baseYieldHistory[globalConfigAcc.baseYieldHistory.length - 1]);

//             // Add another delay after staking
//             await new Promise((resolve) => setTimeout(resolve, 10000));

//             // Assertions
//             assert.strictEqual(globalConfigAcc.exchangeRateHistory.length - 1, i);
//             assert.strictEqual(
//                 Number(globalConfigAcc.exchangeRateHistory[i].exchangeRate),
//                 newExchangeRate
//             );

//             assert.strictEqual(Number(globalConfigAcc.baseYieldHistory[globalConfigAcc.baseYieldHistory.length - 1].baseYieldBps), newBaselineYieldBps);
//         }

//         // Confirmation
//         let postGlobalConfigAcc = await safeFetchGlobalConfig(umi, globalConfig);
//         // console.log("post global points:", postGlobalConfigAcc.pointsHistory.sort((a, b) => a.index - b.index));
//         let postUserStakeAcc = await safeFetchUserStake(umi, userStakePDA);
//         // console.log("post user points:", postUserStakeAcc.pointsHistory.sort((a, b) => a.index - b.index));

//         const points = calculatePoints(
//             postGlobalConfigAcc,
//             postUserStakeAcc.stakedAmount,
//             Number(postUserStakeAcc.lastClaimTimestamp),
//             Math.round(Date.now() / 1000)
//         );

//         console.log("Points calculated:", points);

//         // Create arrays with expected global and user points
//         const expectedGlobalPoints = [...postGlobalConfigAcc.pointsHistory, ...points].reduce((acc, phase) => {
//             const existingPhase = acc.find(p => p.index === phase.index);
//             if (existingPhase) {
//                 existingPhase.points += phase.points;
//             } else {
//                 acc.push({ ...phase });
//             }
//             return acc;
//         }, []).sort((a, b) => a.index - b.index);

//         const expectedUserPoints = [...postUserStakeAcc.pointsHistory, ...points].reduce((acc, phase) => {
//             const existingPhase = acc.find(p => p.index === phase.index);
//             if (existingPhase) {
//                 existingPhase.points += phase.points;
//             } else {
//                 acc.push({ ...phase });
//             }
//             return acc;
//         }, []).sort((a, b) => a.index - b.index);

//         console.log("Expected Global Points:", expectedGlobalPoints);
//         console.log("Expected User Points:", expectedUserPoints);

//         // Perform unstaking
//         txBuilder = new TransactionBuilder();
//         txBuilder = txBuilder.add(
//             ptUnstake(umi, {
//                 globalConfig,
//                 userStake: userStakePDA,
//                 baseMint: baseMint,
//                 userBaseMintAta: userBase,
//                 user: umi.identity,
//                 vault: vaultStakingPDA,
//                 associatedTokenProgram: SPL_ASSOCIATED_TOKEN_PROGRAM_ID,
//                 quantity: quantity,
//             })
//         );
//         await txBuilder.sendAndConfirm(umi);

//         // Final checks
//         const finalGlobalConfigAcc = await safeFetchGlobalConfig(umi, globalConfig);
//         const finalUserStakeAcc = await safeFetchUserStake(umi, userStakePDA);

//         // Compare expected points with actual points
//         expectedGlobalPoints.forEach((phase, index) => {
//             const actualPhasePoints = finalGlobalConfigAcc.pointsHistory.find(p => p.index === phase.index).points

//             assert.ok(
//                 BigInt(phase.points) === actualPhasePoints,
//                 `Global points mismatch at index ${index}. Expected: ${phase.points}, Actual: ${actualPhasePoints}`
//             );
//         });

//         expectedUserPoints.forEach((phase, index) => {
//             const actualPhasePoints = finalUserStakeAcc.pointsHistory.find(p => p.index === phase.index).points

//             assert.ok(
//                 BigInt(phase.points) === actualPhasePoints,
//                 `User points mismatch at index ${index}. Expected: ${phase.points}, Actual: ${actualPhasePoints}`
//             );
//         });

//         // console.log(
//         //   "Final exchange rate history:",
//         //   finalGlobalConfigAcc.exchangeRateHistory.map((phase, index) => {
//         //     const timeElapsed = unwrapOption(phase.endDate) ? unwrapOption(phase.endDate) - phase.startDate : 0;
//         //     return {
//         //       ...phase,
//         //       index,
//         //       timeElapsed,
//         //     };
//         //   })
//         // );
//         // console.log("Final points history user:", finalUserStakeAcc.pointsHistory.sort((a, b) => a.index - b.index));
//         // console.log("Final points history global:", finalGlobalConfigAcc.pointsHistory.sort((a, b) => a.index - b.index));
//     });

//     it("should handle multiple deposits in PT Staking and multiple exchange rates, confirming recent claims", async () => {
//         const initialDeposit = 1000 * 10 ** baseMintDecimals;
//         const smallDeposit = 1 * 10 ** baseMintDecimals;
//         const delay = 1000; // 10 seconds delay

//         let previousStakeTimestamp: number;
//         let finalDepositTimestamp: number;

//         // Create userStake acccount
//         let txBuilder = new TransactionBuilder();

//         txBuilder = txBuilder.add(
//             initPtStake(umi, {
//                 userStake: userStakePDA,
//                 user: umi.identity,
//             })
//         );

//         await txBuilder.sendAndConfirm(umi);

//         // Increase the deposit cap
//         let newDepositCap = testDepositCapAmount * 100;
//         txBuilder = new TransactionBuilder();
//         txBuilder = txBuilder.add(
//             updateGlobalConfig(umi, {
//                 globalConfig,
//                 owner: umi.identity,
//                 newBaselineYieldBps: null,
//                 newExchangeRate: null,
//                 newDepositCap: newDepositCap,
//             })
//         );
//         await txBuilder.sendAndConfirm(umi);

//         // Initial deposit
//         txBuilder = new TransactionBuilder();
//         txBuilder = txBuilder.add(
//             ptStake(umi, {
//                 globalConfig,
//                 userStake: userStakePDA,
//                 baseMint: baseMint,
//                 userBaseMintAta: userBase,
//                 user: umi.identity,
//                 vault: vaultStakingPDA,
//                 associatedTokenProgram: SPL_ASSOCIATED_TOKEN_PROGRAM_ID,
//                 quantity: initialDeposit,
//             })
//         );
//         await txBuilder.sendAndConfirm(umi);

//         let userStakeAcc = await safeFetchUserStake(umi, userStakePDA);
//         previousStakeTimestamp = Number(userStakeAcc.lastClaimTimestamp);
//         // console.log("Initial stake timestamp:", previousStakeTimestamp);

//         // Function to update exchange rate and perform a small deposit
//         const updateRateAndDeposit = async (newRate: number) => {
//             // Update exchange rate
//             let updateTxBuilder = new TransactionBuilder();
//             updateTxBuilder = updateTxBuilder.add(
//                 updateGlobalConfig(umi, {
//                     globalConfig,
//                     owner: umi.identity,
//                     newBaselineYieldBps: null,
//                     newExchangeRate: newRate,
//                     newDepositCap: null,
//                 })
//             );
//             await updateTxBuilder.sendAndConfirm(umi);

//             // Perform small deposit
//             let stakeTxBuilder = new TransactionBuilder();
//             stakeTxBuilder = stakeTxBuilder.add(
//                 ptStake(umi, {
//                     globalConfig,
//                     userStake: userStakePDA,
//                     baseMint: baseMint,
//                     userBaseMintAta: userBase,
//                     user: umi.identity,
//                     vault: vaultStakingPDA,
//                     associatedTokenProgram: SPL_ASSOCIATED_TOKEN_PROGRAM_ID,
//                     quantity: smallDeposit,
//                 })
//             );
//             await stakeTxBuilder.sendAndConfirm(umi);
//         };

//         // Perform multiple small deposits with delays and rate changes
//         const newRates = [25 * 10 ** baseMintDecimals, 30 * 10 ** baseMintDecimals, 35 * 10 ** baseMintDecimals];
//         for (let i = 0; i < 3; i++) {
//             await new Promise(resolve => setTimeout(resolve, delay));
//             await updateRateAndDeposit(newRates[i]);
//             userStakeAcc = await safeFetchUserStake(umi, userStakePDA);
//             finalDepositTimestamp = Number(userStakeAcc.lastClaimTimestamp);
//             console.log(`Deposit ${i + 1} timestamp:`, finalDepositTimestamp);

//             if (i < 2) {
//                 previousStakeTimestamp = finalDepositTimestamp;
//             }
//         }

//         // Final check after deposits
//         userStakeAcc = await safeFetchUserStake(umi, userStakePDA);
//         console.log("Previous stake timestamp:", previousStakeTimestamp);
//         console.log("Final deposit timestamp:", finalDepositTimestamp);

//         // Calculate expected staked amount
//         const expectedStakedAmount = BigInt(initialDeposit) + BigInt(smallDeposit) * 3n;
//         assert.equal(userStakeAcc.stakedAmount, expectedStakedAmount, "Staked amount should match total deposits");

//         // Verify points calculation
//         const globalConfigAcc = await safeFetchGlobalConfig(umi, globalConfig);
//         const points = calculatePoints(
//             globalConfigAcc,
//             expectedStakedAmount,
//             previousStakeTimestamp,
//             finalDepositTimestamp
//         );

//         console.log("Calculated points:", points);
//         console.log("User stake points history:", userStakeAcc.pointsHistory);

//         // Check if the points in history match the calculated points
//         if (userStakeAcc.pointsHistory.length > 0) {
//             const lastPointsEntry = userStakeAcc.pointsHistory[userStakeAcc.pointsHistory.length - 1];
//             const calculatedLastPointsEntry = points[points.length - 1];
//             const difference = Math.abs(Number(lastPointsEntry.points) - Number(calculatedLastPointsEntry.points));
//             const tolerance = Math.max(1, Math.floor(Number(calculatedLastPointsEntry.points) * 0.01)); // 1% tolerance or at least 1 point
//             assert.ok(
//                 difference <= tolerance,
//                 `Last points entry (${lastPointsEntry.points}) should be close to calculated points (${calculatedLastPointsEntry.points}). Difference: ${difference}, Tolerance: ${tolerance}`
//             );
//         }

//         // Assert that we have multiple phases in the points history
//         assert.ok(
//             userStakeAcc.pointsHistory.length > 1,
//             "There should be multiple phases in the points history"
//         );

//         // Assert that the exchange rates in the points history match the ones we set
//         const expectedRates = [20 * 10 ** baseMintDecimals, ...newRates]; // Include initial rate
//         for (let i = 0; i < userStakeAcc.pointsHistory.length; i++) {
//             assert.equal(
//                 userStakeAcc.pointsHistory[i].exchangeRate,
//                 BigInt(expectedRates[i]),
//                 `Exchange rate for phase ${i} should match the set rate`
//             );
//         }
//     });

//     it("should handle multiple deposits in PT Staking, with a single exchange rate", async () => {
//         const initialDeposit = 1000 * 10 ** baseMintDecimals;
//         const smallDeposit = 1 * 10 ** baseMintDecimals;
//         const delay = 1000; // 10 seconds delay

//         let previousStakeTimestamp: number;
//         let finalDepositTimestamp: number;

//         // Create userStake acccount
//         let txBuilder = new TransactionBuilder();

//         txBuilder = txBuilder.add(
//             initPtStake(umi, {
//                 userStake: userStakePDA,
//                 user: umi.identity,
//             })
//         );

//         await txBuilder.sendAndConfirm(umi);

//         // Increase the deposit cap
//         let newDepositCap = testDepositCapAmount * 100;
//         txBuilder = new TransactionBuilder();
//         txBuilder = txBuilder.add(
//             updateGlobalConfig(umi, {
//                 globalConfig,
//                 owner: umi.identity,
//                 newBaselineYieldBps: null,
//                 newExchangeRate: null,
//                 newDepositCap: newDepositCap,
//             })
//         );
//         await txBuilder.sendAndConfirm(umi);

//         // Get initial exchange rate
//         let globalConfigAcc = await safeFetchGlobalConfig(umi, globalConfig);
//         const exchangeRate = globalConfigAcc.exchangeRateHistory[0].exchangeRate;

//         // Initial deposit
//         txBuilder = new TransactionBuilder();
//         txBuilder = txBuilder.add(
//             ptStake(umi, {
//                 globalConfig,
//                 userStake: userStakePDA,
//                 baseMint: baseMint,
//                 userBaseMintAta: userBase,
//                 user: umi.identity,
//                 vault: vaultStakingPDA,
//                 associatedTokenProgram: SPL_ASSOCIATED_TOKEN_PROGRAM_ID,
//                 quantity: initialDeposit,
//             })
//         );
//         await txBuilder.sendAndConfirm(umi);

//         let userStakeAcc = await safeFetchUserStake(umi, userStakePDA);
//         previousStakeTimestamp = Number(userStakeAcc.lastClaimTimestamp);
//         // console.log("Initial stake timestamp:", previousStakeTimestamp);

//         // Function to perform a small deposit
//         const performSmallDeposit = async () => {
//             let stakeTxBuilder = new TransactionBuilder();
//             stakeTxBuilder = stakeTxBuilder.add(
//                 ptStake(umi, {
//                     globalConfig,
//                     userStake: userStakePDA,
//                     baseMint: baseMint,
//                     userBaseMintAta: userBase,
//                     user: umi.identity,
//                     vault: vaultStakingPDA,
//                     associatedTokenProgram: SPL_ASSOCIATED_TOKEN_PROGRAM_ID,
//                     quantity: smallDeposit,
//                 })
//             );
//             await stakeTxBuilder.sendAndConfirm(umi);
//         };

//         // Perform multiple small deposits with delays
//         for (let i = 0; i < 3; i++) {
//             await new Promise(resolve => setTimeout(resolve, delay));
//             await performSmallDeposit();
//             userStakeAcc = await safeFetchUserStake(umi, userStakePDA);
//             finalDepositTimestamp = Number(userStakeAcc.lastClaimTimestamp);
//             console.log(`Deposit ${i + 1} timestamp:`, finalDepositTimestamp);
//         }

//         // Final check after deposits
//         userStakeAcc = await safeFetchUserStake(umi, userStakePDA);
//         console.log("Previous stake timestamp:", previousStakeTimestamp);
//         console.log("Final deposit timestamp:", finalDepositTimestamp);

//         // Calculate expected staked amount
//         const expectedStakedAmount = BigInt(initialDeposit) + BigInt(smallDeposit) * 3n;
//         assert.equal(userStakeAcc.stakedAmount, expectedStakedAmount, "Staked amount should match total deposits");

//         // Verify points calculation
//         globalConfigAcc = await safeFetchGlobalConfig(umi, globalConfig);

//         const points = calculatePoints(
//             globalConfigAcc,
//             expectedStakedAmount,
//             previousStakeTimestamp,
//             finalDepositTimestamp
//         );

//         console.log("Calculated points:", points);
//         console.log("User stake points history:", userStakeAcc.pointsHistory);

//         // Assert that we only have one phase in the points history
//         assert.equal(
//             userStakeAcc.pointsHistory.length,
//             1,
//             "There should be only one phase in the points history"
//         );

//         // Check if the points in history match the calculated points
//         const pointsEntry = userStakeAcc.pointsHistory[0];
//         const calculatedPoints = points[0].points;
//         const difference = Math.abs(Number(pointsEntry.points) - Number(calculatedPoints));
//         const tolerance = Math.max(1, Math.floor(Number(calculatedPoints) * 0.01)); // 1% tolerance or at least 1 point

//         assert.ok(
//             difference <= tolerance,
//             `Points entry (${pointsEntry.points}) should be close to calculated points (${calculatedPoints}). Difference: ${difference}, Tolerance: ${tolerance}`
//         );

//         // Assert that the exchange rate in the points history matches the initial rate
//         assert.equal(
//             pointsEntry.exchangeRate,
//             exchangeRate,
//             "Exchange rate in points history should match the initial rate"
//         );
//     });
// });
