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
  i32,
  mapSerializer,
  publicKey as publicKeySerializer,
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
export type InitializePoolManagerInstructionAccounts = {
  /** SPL Token Mint of the underlying token to be deposited for staking */
  baseMint: PublicKey | Pda;
  xMint: PublicKey | Pda;
  metadata: PublicKey | Pda;
  poolManager: PublicKey | Pda;
  vault: PublicKey | Pda;
  owner: Signer;
  rent?: PublicKey | Pda;
  systemProgram?: PublicKey | Pda;
  tokenProgram?: PublicKey | Pda;
  tokenMetadataProgram?: PublicKey | Pda;
  associatedTokenProgram: PublicKey | Pda;
};

// Data.
export type InitializePoolManagerInstructionData = {
  discriminator: Array<number>;
  name: string;
  symbol: string;
  uri: string;
  decimals: number;
  intervalAprRate: bigint;
  secondsPerInterval: number;
  initialExchangeRate: bigint;
  admin: PublicKey;
  depositCap: bigint;
};

export type InitializePoolManagerInstructionDataArgs = {
  name: string;
  symbol: string;
  uri: string;
  decimals: number;
  intervalAprRate: number | bigint;
  secondsPerInterval: number;
  initialExchangeRate: number | bigint;
  admin: PublicKey;
  depositCap: number | bigint;
};

export function getInitializePoolManagerInstructionDataSerializer(): Serializer<
  InitializePoolManagerInstructionDataArgs,
  InitializePoolManagerInstructionData
> {
  return mapSerializer<
    InitializePoolManagerInstructionDataArgs,
    any,
    InitializePoolManagerInstructionData
  >(
    struct<InitializePoolManagerInstructionData>(
      [
        ['discriminator', array(u8(), { size: 8 })],
        ['name', string()],
        ['symbol', string()],
        ['uri', string()],
        ['decimals', u8()],
        ['intervalAprRate', u64()],
        ['secondsPerInterval', i32()],
        ['initialExchangeRate', u64()],
        ['admin', publicKeySerializer()],
        ['depositCap', u64()],
      ],
      { description: 'InitializePoolManagerInstructionData' }
    ),
    (value) => ({
      ...value,
      discriminator: [33, 34, 202, 132, 200, 11, 214, 124],
    })
  ) as Serializer<
    InitializePoolManagerInstructionDataArgs,
    InitializePoolManagerInstructionData
  >;
}

// Args.
export type InitializePoolManagerInstructionArgs =
  InitializePoolManagerInstructionDataArgs;

// Instruction.
export function initializePoolManager(
  context: Pick<Context, 'programs'>,
  input: InitializePoolManagerInstructionAccounts &
    InitializePoolManagerInstructionArgs
): TransactionBuilder {
  // Program ID.
  const programId = context.programs.getPublicKey(
    'parityStaking',
    'BZzrzzNm14rcF8edGVYY2NHyj9aQURFXubgEdRJoyzvH'
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
    poolManager: {
      index: 3,
      isWritable: true as boolean,
      value: input.poolManager ?? null,
    },
    vault: {
      index: 4,
      isWritable: true as boolean,
      value: input.vault ?? null,
    },
    owner: {
      index: 5,
      isWritable: true as boolean,
      value: input.owner ?? null,
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
  const resolvedArgs: InitializePoolManagerInstructionArgs = { ...input };

  // Default values.
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
  const data = getInitializePoolManagerInstructionDataSerializer().serialize(
    resolvedArgs as InitializePoolManagerInstructionDataArgs
  );

  // Bytes Created On Chain.
  const bytesCreatedOnChain = 0;

  return transactionBuilder([
    { instruction: { keys, programId, data }, signers, bytesCreatedOnChain },
  ]);
}
