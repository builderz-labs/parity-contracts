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
  publicKey,
  transactionBuilder,
} from '@metaplex-foundation/umi';
import {
  Serializer,
  array,
  mapSerializer,
  string,
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
export type InitializeStakePoolInstructionAccounts = {
  /** SPL Token Mint of the underlying token to be deposited for staking */
  baseMint: PublicKey | Pda;
  xMint: PublicKey | Pda;
  metadata: PublicKey | Pda;
  stakePool: PublicKey | Pda;
  vault: PublicKey | Pda;
  payer?: Signer;
  rent?: PublicKey | Pda;
  systemProgram?: PublicKey | Pda;
  tokenProgram?: PublicKey | Pda;
  tokenMetadataProgram?: PublicKey | Pda;
  associatedTokenProgram: PublicKey | Pda;
};

// Data.
export type InitializeStakePoolInstructionData = {
  discriminator: Array<number>;
  name: string;
  symbol: string;
  uri: string;
  decimals: number;
  initialExchangeRate: bigint;
};

export type InitializeStakePoolInstructionDataArgs = {
  name: string;
  symbol: string;
  uri: string;
  decimals: number;
  initialExchangeRate: number | bigint;
};

export function getInitializeStakePoolInstructionDataSerializer(): Serializer<
  InitializeStakePoolInstructionDataArgs,
  InitializeStakePoolInstructionData
> {
  return mapSerializer<
    InitializeStakePoolInstructionDataArgs,
    any,
    InitializeStakePoolInstructionData
  >(
    struct<InitializeStakePoolInstructionData>(
      [
        ['discriminator', array(u8(), { size: 8 })],
        ['name', string()],
        ['symbol', string()],
        ['uri', string()],
        ['decimals', u8()],
        ['initialExchangeRate', u64()],
      ],
      { description: 'InitializeStakePoolInstructionData' }
    ),
    (value) => ({ ...value, discriminator: [48, 189, 243, 73, 19, 67, 36, 83] })
  ) as Serializer<
    InitializeStakePoolInstructionDataArgs,
    InitializeStakePoolInstructionData
  >;
}

// Args.
export type InitializeStakePoolInstructionArgs =
  InitializeStakePoolInstructionDataArgs;

// Instruction.
export function initializeStakePool(
  context: Pick<Context, 'payer' | 'programs'>,
  input: InitializeStakePoolInstructionAccounts &
    InitializeStakePoolInstructionArgs
): TransactionBuilder {
  // Program ID.
  const programId = context.programs.getPublicKey(
    'soldStaking',
    'F9pkhuLyu1usfS5p6RCuXxeS2TQsAVqANo1M2iC8ze1t'
  );

  // Accounts.
  const resolvedAccounts = {
    baseMint: {
      index: 0,
      isWritable: false as boolean,
      value: input.baseMint ?? null,
    },
    xMint: {
      index: 1,
      isWritable: true as boolean,
      value: input.xMint ?? null,
    },
    metadata: {
      index: 2,
      isWritable: true as boolean,
      value: input.metadata ?? null,
    },
    stakePool: {
      index: 3,
      isWritable: true as boolean,
      value: input.stakePool ?? null,
    },
    vault: {
      index: 4,
      isWritable: true as boolean,
      value: input.vault ?? null,
    },
    payer: {
      index: 5,
      isWritable: true as boolean,
      value: input.payer ?? null,
    },
    rent: { index: 6, isWritable: false as boolean, value: input.rent ?? null },
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
    tokenMetadataProgram: {
      index: 9,
      isWritable: false as boolean,
      value: input.tokenMetadataProgram ?? null,
    },
    associatedTokenProgram: {
      index: 10,
      isWritable: false as boolean,
      value: input.associatedTokenProgram ?? null,
    },
  } satisfies ResolvedAccountsWithIndices;

  // Arguments.
  const resolvedArgs: InitializeStakePoolInstructionArgs = { ...input };

  // Default values.
  if (!resolvedAccounts.payer.value) {
    resolvedAccounts.payer.value = context.payer;
  }
  if (!resolvedAccounts.rent.value) {
    resolvedAccounts.rent.value = publicKey(
      'SysvarRent111111111111111111111111111111111'
    );
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
  if (!resolvedAccounts.tokenMetadataProgram.value) {
    resolvedAccounts.tokenMetadataProgram.value = context.programs.getPublicKey(
      'mplTokenMetadata',
      'metaqbxxUerdq28cj1RbAWkYQm3ybzjb6a8bt518x1s'
    );
    resolvedAccounts.tokenMetadataProgram.isWritable = false;
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
  const data = getInitializeStakePoolInstructionDataSerializer().serialize(
    resolvedArgs as InitializeStakePoolInstructionDataArgs
  );

  // Bytes Created On Chain.
  const bytesCreatedOnChain = 0;

  return transactionBuilder([
    { instruction: { keys, programId, data }, signers, bytesCreatedOnChain },
  ]);
}