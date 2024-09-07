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
  u8,
} from '@metaplex-foundation/umi/serializers';
import {
  ResolvedAccount,
  ResolvedAccountsWithIndices,
  getAccountMetasAndSigners,
} from '../shared';

// Accounts.
export type UpdateManagerOwnerInstructionAccounts = {
  tokenManager: PublicKey | Pda;
  newOwner: Signer;
};

// Data.
export type UpdateManagerOwnerInstructionData = {
  discriminator: Array<number>;
};

export type UpdateManagerOwnerInstructionDataArgs = {};

export function getUpdateManagerOwnerInstructionDataSerializer(): Serializer<
  UpdateManagerOwnerInstructionDataArgs,
  UpdateManagerOwnerInstructionData
> {
  return mapSerializer<
    UpdateManagerOwnerInstructionDataArgs,
    any,
    UpdateManagerOwnerInstructionData
  >(
    struct<UpdateManagerOwnerInstructionData>(
      [['discriminator', array(u8(), { size: 8 })]],
      { description: 'UpdateManagerOwnerInstructionData' }
    ),
    (value) => ({
      ...value,
      discriminator: [222, 39, 178, 32, 216, 177, 170, 117],
    })
  ) as Serializer<
    UpdateManagerOwnerInstructionDataArgs,
    UpdateManagerOwnerInstructionData
  >;
}

// Instruction.
export function updateManagerOwner(
  context: Pick<Context, 'programs'>,
  input: UpdateManagerOwnerInstructionAccounts
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
    newOwner: {
      index: 1,
      isWritable: false as boolean,
      value: input.newOwner ?? null,
    },
  } satisfies ResolvedAccountsWithIndices;

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
  const data = getUpdateManagerOwnerInstructionDataSerializer().serialize({});

  // Bytes Created On Chain.
  const bytesCreatedOnChain = 0;

  return transactionBuilder([
    { instruction: { keys, programId, data }, signers, bytesCreatedOnChain },
  ]);
}
