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
  bytes,
  i64,
  mapSerializer,
  publicKey as publicKeySerializer,
  string,
  struct,
  u16,
  u64,
  u8,
} from '@metaplex-foundation/umi/serializers';
import {
  ResolvedAccount,
  ResolvedAccountsWithIndices,
  getAccountMetasAndSigners,
} from '../shared';

// Accounts.
export type InitializeTokenManagerInstructionAccounts = {
  tokenManager: PublicKey | Pda;
  vault: PublicKey | Pda;
  metadata: PublicKey | Pda;
  mint: PublicKey | Pda;
  quoteMint: PublicKey | Pda;
  owner: Signer;
  rent?: PublicKey | Pda;
  systemProgram?: PublicKey | Pda;
  tokenProgram?: PublicKey | Pda;
  tokenMetadataProgram?: PublicKey | Pda;
  associatedTokenProgram: PublicKey | Pda;
};

// Data.
export type InitializeTokenManagerInstructionData = {
  discriminator: Array<number>;
  name: string;
  symbol: string;
  uri: string;
  decimals: number;
  exchangeRate: bigint;
  emergencyFundBasisPoints: number;
  merkleRoot: Uint8Array;
  admin: PublicKey;
  minter: PublicKey;
  gateKeepers: Array<PublicKey>;
  mintLimitPerSlot: bigint;
  redemptionLimitPerSlot: bigint;
  withdrawTimeLock: bigint;
  withdrawExecutionWindow: bigint;
};

export type InitializeTokenManagerInstructionDataArgs = {
  name: string;
  symbol: string;
  uri: string;
  decimals: number;
  exchangeRate: number | bigint;
  emergencyFundBasisPoints: number;
  merkleRoot: Uint8Array;
  admin: PublicKey;
  minter: PublicKey;
  gateKeepers: Array<PublicKey>;
  mintLimitPerSlot: number | bigint;
  redemptionLimitPerSlot: number | bigint;
  withdrawTimeLock: number | bigint;
  withdrawExecutionWindow: number | bigint;
};

export function getInitializeTokenManagerInstructionDataSerializer(): Serializer<
  InitializeTokenManagerInstructionDataArgs,
  InitializeTokenManagerInstructionData
> {
  return mapSerializer<
    InitializeTokenManagerInstructionDataArgs,
    any,
    InitializeTokenManagerInstructionData
  >(
    struct<InitializeTokenManagerInstructionData>(
      [
        ['discriminator', array(u8(), { size: 8 })],
        ['name', string()],
        ['symbol', string()],
        ['uri', string()],
        ['decimals', u8()],
        ['exchangeRate', u64()],
        ['emergencyFundBasisPoints', u16()],
        ['merkleRoot', bytes({ size: 32 })],
        ['admin', publicKeySerializer()],
        ['minter', publicKeySerializer()],
        ['gateKeepers', array(publicKeySerializer())],
        ['mintLimitPerSlot', u64()],
        ['redemptionLimitPerSlot', u64()],
        ['withdrawTimeLock', i64()],
        ['withdrawExecutionWindow', i64()],
      ],
      { description: 'InitializeTokenManagerInstructionData' }
    ),
    (value) => ({ ...value, discriminator: [67, 249, 6, 71, 87, 19, 139, 58] })
  ) as Serializer<
    InitializeTokenManagerInstructionDataArgs,
    InitializeTokenManagerInstructionData
  >;
}

// Args.
export type InitializeTokenManagerInstructionArgs =
  InitializeTokenManagerInstructionDataArgs;

// Instruction.
export function initializeTokenManager(
  context: Pick<Context, 'programs'>,
  input: InitializeTokenManagerInstructionAccounts &
    InitializeTokenManagerInstructionArgs
): TransactionBuilder {
  // Program ID.
  const programId = context.programs.getPublicKey(
    'soldIssuance',
    'JCLA8ET4DCCsJsvNcaNBhpY8ZudFfAbpgspPBnni1NQy'
  );

  // Accounts.
  const resolvedAccounts = {
    tokenManager: {
      index: 0,
      isWritable: true as boolean,
      value: input.tokenManager ?? null,
    },
    vault: {
      index: 1,
      isWritable: true as boolean,
      value: input.vault ?? null,
    },
    metadata: {
      index: 2,
      isWritable: true as boolean,
      value: input.metadata ?? null,
    },
    mint: { index: 3, isWritable: true as boolean, value: input.mint ?? null },
    quoteMint: {
      index: 4,
      isWritable: false as boolean,
      value: input.quoteMint ?? null,
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
  const resolvedArgs: InitializeTokenManagerInstructionArgs = { ...input };

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
  const data = getInitializeTokenManagerInstructionDataSerializer().serialize(
    resolvedArgs as InitializeTokenManagerInstructionDataArgs
  );

  // Bytes Created On Chain.
  const bytesCreatedOnChain = 0;

  return transactionBuilder([
    { instruction: { keys, programId, data }, signers, bytesCreatedOnChain },
  ]);
}
