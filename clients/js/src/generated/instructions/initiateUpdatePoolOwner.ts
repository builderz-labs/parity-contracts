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
export type InitiateUpdatePoolOwnerInstructionAccounts = {
  poolManager: PublicKey | Pda;
  owner: Signer;
};

// Data.
export type InitiateUpdatePoolOwnerInstructionData = {
  discriminator: Array<number>;
  newOwner: PublicKey;
};

export type InitiateUpdatePoolOwnerInstructionDataArgs = {
  newOwner: PublicKey;
};

export function getInitiateUpdatePoolOwnerInstructionDataSerializer(): Serializer<
  InitiateUpdatePoolOwnerInstructionDataArgs,
  InitiateUpdatePoolOwnerInstructionData
> {
  return mapSerializer<
    InitiateUpdatePoolOwnerInstructionDataArgs,
    any,
    InitiateUpdatePoolOwnerInstructionData
  >(
    struct<InitiateUpdatePoolOwnerInstructionData>(
      [
        ['discriminator', array(u8(), { size: 8 })],
        ['newOwner', publicKeySerializer()],
      ],
      { description: 'InitiateUpdatePoolOwnerInstructionData' }
    ),
    (value) => ({ ...value, discriminator: [42, 53, 110, 22, 7, 25, 204, 151] })
  ) as Serializer<
    InitiateUpdatePoolOwnerInstructionDataArgs,
    InitiateUpdatePoolOwnerInstructionData
  >;
}

// Args.
export type InitiateUpdatePoolOwnerInstructionArgs =
  InitiateUpdatePoolOwnerInstructionDataArgs;

// Instruction.
export function initiateUpdatePoolOwner(
  context: Pick<Context, 'programs'>,
  input: InitiateUpdatePoolOwnerInstructionAccounts &
    InitiateUpdatePoolOwnerInstructionArgs
): TransactionBuilder {
  // Program ID.
  const programId = context.programs.getPublicKey(
    'parityStaking',
    'AJmk6gK2zALnLxaXYR6CzTYMFRu62adT4dVUKpxNT5Zh'
  );

  // Accounts.
  const resolvedAccounts = {
    poolManager: {
      index: 0,
      isWritable: true as boolean,
      value: input.poolManager ?? null,
    },
    owner: {
      index: 1,
      isWritable: false as boolean,
      value: input.owner ?? null,
    },
  } satisfies ResolvedAccountsWithIndices;

  // Arguments.
  const resolvedArgs: InitiateUpdatePoolOwnerInstructionArgs = { ...input };

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
  const data = getInitiateUpdatePoolOwnerInstructionDataSerializer().serialize(
    resolvedArgs as InitiateUpdatePoolOwnerInstructionDataArgs
  );

  // Bytes Created On Chain.
  const bytesCreatedOnChain = 0;

  return transactionBuilder([
    { instruction: { keys, programId, data }, signers, bytesCreatedOnChain },
  ]);
}
