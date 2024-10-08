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
  u8,
} from '@metaplex-foundation/umi/serializers';
import {
  ResolvedAccount,
  ResolvedAccountsWithIndices,
  getAccountMetasAndSigners,
} from '../shared';

// Accounts.
export type InitiateUpdateGlobalConfigOwnerInstructionAccounts = {
  globalConfig: PublicKey | Pda;
  owner: Signer;
};

// Data.
export type InitiateUpdateGlobalConfigOwnerInstructionData = {
  discriminator: Array<number>;
  newOwner: PublicKey;
};

export type InitiateUpdateGlobalConfigOwnerInstructionDataArgs = {
  newOwner: PublicKey;
};

export function getInitiateUpdateGlobalConfigOwnerInstructionDataSerializer(): Serializer<
  InitiateUpdateGlobalConfigOwnerInstructionDataArgs,
  InitiateUpdateGlobalConfigOwnerInstructionData
> {
  return mapSerializer<
    InitiateUpdateGlobalConfigOwnerInstructionDataArgs,
    any,
    InitiateUpdateGlobalConfigOwnerInstructionData
  >(
    struct<InitiateUpdateGlobalConfigOwnerInstructionData>(
      [
        ['discriminator', array(u8(), { size: 8 })],
        ['newOwner', publicKeySerializer()],
      ],
      { description: 'InitiateUpdateGlobalConfigOwnerInstructionData' }
    ),
    (value) => ({
      ...value,
      discriminator: [171, 73, 140, 242, 11, 88, 45, 231],
    })
  ) as Serializer<
    InitiateUpdateGlobalConfigOwnerInstructionDataArgs,
    InitiateUpdateGlobalConfigOwnerInstructionData
  >;
}

// Args.
export type InitiateUpdateGlobalConfigOwnerInstructionArgs =
  InitiateUpdateGlobalConfigOwnerInstructionDataArgs;

// Instruction.
export function initiateUpdateGlobalConfigOwner(
  context: Pick<Context, 'programs'>,
  input: InitiateUpdateGlobalConfigOwnerInstructionAccounts &
    InitiateUpdateGlobalConfigOwnerInstructionArgs
): TransactionBuilder {
  // Program ID.
  const programId = context.programs.getPublicKey(
    'ptStaking',
    'AdXJ8Sr46ujd9DSLP5LRyF1BrqxT9azqmQqN2oTyV8cz'
  );

  // Accounts.
  const resolvedAccounts = {
    globalConfig: {
      index: 0,
      isWritable: true as boolean,
      value: input.globalConfig ?? null,
    },
    owner: {
      index: 1,
      isWritable: true as boolean,
      value: input.owner ?? null,
    },
  } satisfies ResolvedAccountsWithIndices;

  // Arguments.
  const resolvedArgs: InitiateUpdateGlobalConfigOwnerInstructionArgs = {
    ...input,
  };

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
  const data =
    getInitiateUpdateGlobalConfigOwnerInstructionDataSerializer().serialize(
      resolvedArgs as InitiateUpdateGlobalConfigOwnerInstructionDataArgs
    );

  // Bytes Created On Chain.
  const bytesCreatedOnChain = 0;

  return transactionBuilder([
    { instruction: { keys, programId, data }, signers, bytesCreatedOnChain },
  ]);
}
