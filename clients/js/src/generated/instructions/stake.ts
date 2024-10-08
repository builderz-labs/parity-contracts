/**
 * This code was AUTOGENERATED using the kinobi library.
 * Please DO NOT EDIT THIS FILE, instead use visitors
 * to add features, then rerun kinobi to update it.
 *
 * @see https://github.com/metaplex-foundation/kinobi
 */

import {
  Context,
  Pda,
  PublicKey,
  Signer,
  TransactionBuilder,
  transactionBuilder,
} from '@metaplex-foundation/umi';
import {
  Serializer,
  array,
  mapSerializer,
  struct,
  u64,
  u8,
} from '@metaplex-foundation/umi/serializers';
import {
  ResolvedAccount,
  ResolvedAccountsWithIndices,
  getAccountMetasAndSigners,
} from '../shared';

// Accounts.
export type StakeInstructionAccounts = {
  poolManager: PublicKey | Pda;
  baseMint: PublicKey | Pda;
  payerBaseMintAta: PublicKey | Pda;
  xMint: PublicKey | Pda;
  payerXMintAta: PublicKey | Pda;
  vault: PublicKey | Pda;
  payer?: Signer;
  systemProgram?: PublicKey | Pda;
  tokenProgram?: PublicKey | Pda;
  associatedTokenProgram: PublicKey | Pda;
};

// Data.
export type StakeInstructionData = {
  discriminator: Array<number>;
  quantity: bigint;
};

export type StakeInstructionDataArgs = { quantity: number | bigint };

export function getStakeInstructionDataSerializer(): Serializer<
  StakeInstructionDataArgs,
  StakeInstructionData
> {
  return mapSerializer<StakeInstructionDataArgs, any, StakeInstructionData>(
    struct<StakeInstructionData>(
      [
        ['discriminator', array(u8(), { size: 8 })],
        ['quantity', u64()],
      ],
      { description: 'StakeInstructionData' }
    ),
    (value) => ({
      ...value,
      discriminator: [206, 176, 202, 18, 200, 209, 179, 108],
    })
  ) as Serializer<StakeInstructionDataArgs, StakeInstructionData>;
}

// Args.
export type StakeInstructionArgs = StakeInstructionDataArgs;

// Instruction.
export function stake(
  context: Pick<Context, 'payer' | 'programs'>,
  input: StakeInstructionAccounts & StakeInstructionArgs
): TransactionBuilder {
  // Program ID.
  const programId = context.programs.getPublicKey(
    'parityStaking',
    'BZzrzzNm14rcF8edGVYY2NHyj9aQURFXubgEdRJoyzvH'
  );

  // Accounts.
  const resolvedAccounts = {
    poolManager: {
      index: 0,
      isWritable: true as boolean,
      value: input.poolManager ?? null,
    },
    baseMint: {
      index: 1,
      isWritable: true as boolean,
      value: input.baseMint ?? null,
    },
    payerBaseMintAta: {
      index: 2,
      isWritable: true as boolean,
      value: input.payerBaseMintAta ?? null,
    },
    xMint: {
      index: 3,
      isWritable: true as boolean,
      value: input.xMint ?? null,
    },
    payerXMintAta: {
      index: 4,
      isWritable: true as boolean,
      value: input.payerXMintAta ?? null,
    },
    vault: {
      index: 5,
      isWritable: true as boolean,
      value: input.vault ?? null,
    },
    payer: {
      index: 6,
      isWritable: true as boolean,
      value: input.payer ?? null,
    },
    systemProgram: {
      index: 7,
      isWritable: false as boolean,
      value: input.systemProgram ?? null,
    },
    tokenProgram: {
      index: 8,
      isWritable: false as boolean,
      value: input.tokenProgram ?? null,
    },
    associatedTokenProgram: {
      index: 9,
      isWritable: false as boolean,
      value: input.associatedTokenProgram ?? null,
    },
  } satisfies ResolvedAccountsWithIndices;

  // Arguments.
  const resolvedArgs: StakeInstructionArgs = { ...input };

  // Default values.
  if (!resolvedAccounts.payer.value) {
    resolvedAccounts.payer.value = context.payer;
  }
  if (!resolvedAccounts.systemProgram.value) {
    resolvedAccounts.systemProgram.value = context.programs.getPublicKey(
      'splSystem',
      '11111111111111111111111111111111'
    );
    resolvedAccounts.systemProgram.isWritable = false;
  }
  if (!resolvedAccounts.tokenProgram.value) {
    resolvedAccounts.tokenProgram.value = context.programs.getPublicKey(
      'splToken',
      'TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA'
    );
    resolvedAccounts.tokenProgram.isWritable = false;
  }

  // Accounts in order.
  const orderedAccounts: ResolvedAccount[] = Object.values(
    resolvedAccounts
  ).sort((a, b) => a.index - b.index);

  // Keys and Signers.
  const [keys, signers] = getAccountMetasAndSigners(
    orderedAccounts,
    'programId',
    programId
  );

  // Data.
  const data = getStakeInstructionDataSerializer().serialize(
    resolvedArgs as StakeInstructionDataArgs
  );

  // Bytes Created On Chain.
  const bytesCreatedOnChain = 0;

  return transactionBuilder([
    { instruction: { keys, programId, data }, signers, bytesCreatedOnChain },
  ]);
}
