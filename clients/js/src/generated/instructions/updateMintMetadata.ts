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
  u8,
} from '@metaplex-foundation/umi/serializers';
import {
  ResolvedAccount,
  ResolvedAccountsWithIndices,
  getAccountMetasAndSigners,
} from '../shared';

// Accounts.
export type UpdateMintMetadataInstructionAccounts = {
  tokenManager: PublicKey | Pda;
  owner: Signer;
  metadataAccount: PublicKey | Pda;
  rent?: PublicKey | Pda;
  tokenMetadataProgram?: PublicKey | Pda;
  systemProgram?: PublicKey | Pda;
};

// Data.
export type UpdateMintMetadataInstructionData = {
  discriminator: Array<number>;
  name: string;
  symbol: string;
  uri: string;
};

export type UpdateMintMetadataInstructionDataArgs = {
  name: string;
  symbol: string;
  uri: string;
};

export function getUpdateMintMetadataInstructionDataSerializer(): Serializer<
  UpdateMintMetadataInstructionDataArgs,
  UpdateMintMetadataInstructionData
> {
  return mapSerializer<
    UpdateMintMetadataInstructionDataArgs,
    any,
    UpdateMintMetadataInstructionData
  >(
    struct<UpdateMintMetadataInstructionData>(
      [
        ['discriminator', array(u8(), { size: 8 })],
        ['name', string()],
        ['symbol', string()],
        ['uri', string()],
      ],
      { description: 'UpdateMintMetadataInstructionData' }
    ),
    (value) => ({
      ...value,
      discriminator: [46, 244, 2, 123, 67, 219, 22, 121],
    })
  ) as Serializer<
    UpdateMintMetadataInstructionDataArgs,
    UpdateMintMetadataInstructionData
  >;
}

// Args.
export type UpdateMintMetadataInstructionArgs =
  UpdateMintMetadataInstructionDataArgs;

// Instruction.
export function updateMintMetadata(
  context: Pick<Context, 'programs'>,
  input: UpdateMintMetadataInstructionAccounts &
    UpdateMintMetadataInstructionArgs
): TransactionBuilder {
  // Program ID.
  const programId = context.programs.getPublicKey(
    'parityIssuance',
    '7hkMsfmcxQmJERtzpGTGUn9jmREBZkxYRF2rZ9BRWkZU'
  );

  // Accounts.
  const resolvedAccounts = {
    tokenManager: {
      index: 0,
      isWritable: true as boolean,
      value: input.tokenManager ?? null,
    },
    owner: {
      index: 1,
      isWritable: false as boolean,
      value: input.owner ?? null,
    },
    metadataAccount: {
      index: 2,
      isWritable: true as boolean,
      value: input.metadataAccount ?? null,
    },
    rent: { index: 3, isWritable: false as boolean, value: input.rent ?? null },
    tokenMetadataProgram: {
      index: 4,
      isWritable: false as boolean,
      value: input.tokenMetadataProgram ?? null,
    },
    systemProgram: {
      index: 5,
      isWritable: false as boolean,
      value: input.systemProgram ?? null,
    },
  } satisfies ResolvedAccountsWithIndices;

  // Arguments.
  const resolvedArgs: UpdateMintMetadataInstructionArgs = { ...input };

  // Default values.
  if (!resolvedAccounts.rent.value) {
    resolvedAccounts.rent.value = publicKey(
      'SysvarRent111111111111111111111111111111111'
    );
  }
  if (!resolvedAccounts.tokenMetadataProgram.value) {
    resolvedAccounts.tokenMetadataProgram.value = context.programs.getPublicKey(
      'mplTokenMetadata',
      'metaqbxxUerdq28cj1RbAWkYQm3ybzjb6a8bt518x1s'
    );
    resolvedAccounts.tokenMetadataProgram.isWritable = false;
  }
  if (!resolvedAccounts.systemProgram.value) {
    resolvedAccounts.systemProgram.value = context.programs.getPublicKey(
      'splSystem',
      '11111111111111111111111111111111'
    );
    resolvedAccounts.systemProgram.isWritable = false;
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
  const data = getUpdateMintMetadataInstructionDataSerializer().serialize(
    resolvedArgs as UpdateMintMetadataInstructionDataArgs
  );

  // Bytes Created On Chain.
  const bytesCreatedOnChain = 0;

  return transactionBuilder([
    { instruction: { keys, programId, data }, signers, bytesCreatedOnChain },
  ]);
}
