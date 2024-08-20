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
  publicKey as publicKeySerializer,
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
export type InitializeGlobalConfigInstructionAccounts = {
  /** SPL Token Mint of the underlying token to be deposited for staking */
  baseMint: PublicKey | Pda;
  globalConfig: PublicKey | Pda;
  userStake: PublicKey | Pda;
  vault: PublicKey | Pda;
  user: Signer;
  systemProgram?: PublicKey | Pda;
  tokenProgram?: PublicKey | Pda;
  associatedTokenProgram: PublicKey | Pda;
};

// Data.
export type InitializeGlobalConfigInstructionData = {
  discriminator: Array<number>;
  admin: PublicKey;
  baselineYield: bigint;
  depositCap: bigint;
  initialExchangeRate: bigint;
};

export type InitializeGlobalConfigInstructionDataArgs = {
  admin: PublicKey;
  baselineYield: number | bigint;
  depositCap: number | bigint;
  initialExchangeRate: number | bigint;
};

export function getInitializeGlobalConfigInstructionDataSerializer(): Serializer<
  InitializeGlobalConfigInstructionDataArgs,
  InitializeGlobalConfigInstructionData
> {
  return mapSerializer<
    InitializeGlobalConfigInstructionDataArgs,
    any,
    InitializeGlobalConfigInstructionData
  >(
    struct<InitializeGlobalConfigInstructionData>(
      [
        ['discriminator', array(u8(), { size: 8 })],
        ['admin', publicKeySerializer()],
        ['baselineYield', u64()],
        ['depositCap', u64()],
        ['initialExchangeRate', u64()],
      ],
      { description: 'InitializeGlobalConfigInstructionData' }
    ),
    (value) => ({
      ...value,
      discriminator: [113, 216, 122, 131, 225, 209, 22, 55],
    })
  ) as Serializer<
    InitializeGlobalConfigInstructionDataArgs,
    InitializeGlobalConfigInstructionData
  >;
}

// Args.
export type InitializeGlobalConfigInstructionArgs =
  InitializeGlobalConfigInstructionDataArgs;

// Instruction.
export function initializeGlobalConfig(
  context: Pick<Context, 'programs'>,
  input: InitializeGlobalConfigInstructionAccounts &
    InitializeGlobalConfigInstructionArgs
): TransactionBuilder {
  // Program ID.
  const programId = context.programs.getPublicKey(
    'ptStaking',
    '5zWkamSdh3S4hELhV1ezx6gzyCinBVi38StJUdi8cfGa'
  );

  // Accounts.
  const resolvedAccounts = {
    baseMint: {
      index: 0,
      isWritable: false as boolean,
      value: input.baseMint ?? null,
    },
    globalConfig: {
      index: 1,
      isWritable: true as boolean,
      value: input.globalConfig ?? null,
    },
    userStake: {
      index: 2,
      isWritable: true as boolean,
      value: input.userStake ?? null,
    },
    vault: {
      index: 3,
      isWritable: true as boolean,
      value: input.vault ?? null,
    },
    user: { index: 4, isWritable: true as boolean, value: input.user ?? null },
    systemProgram: {
      index: 5,
      isWritable: false as boolean,
      value: input.systemProgram ?? null,
    },
    tokenProgram: {
      index: 6,
      isWritable: false as boolean,
      value: input.tokenProgram ?? null,
    },
    associatedTokenProgram: {
      index: 7,
      isWritable: false as boolean,
      value: input.associatedTokenProgram ?? null,
    },
  } satisfies ResolvedAccountsWithIndices;

  // Arguments.
  const resolvedArgs: InitializeGlobalConfigInstructionArgs = { ...input };

  // Default values.
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
  const data = getInitializeGlobalConfigInstructionDataSerializer().serialize(
    resolvedArgs as InitializeGlobalConfigInstructionDataArgs
  );

  // Bytes Created On Chain.
  const bytesCreatedOnChain = 0;

  return transactionBuilder([
    { instruction: { keys, programId, data }, signers, bytesCreatedOnChain },
  ]);
}
