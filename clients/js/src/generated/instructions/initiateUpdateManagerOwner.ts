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
export type InitiateUpdateManagerOwnerInstructionAccounts = {
  tokenManager: PublicKey | Pda;
  owner: Signer;
};

// Data.
export type InitiateUpdateManagerOwnerInstructionData = {
  discriminator: Array<number>;
  newOwner: PublicKey;
};

export type InitiateUpdateManagerOwnerInstructionDataArgs = {
  newOwner: PublicKey;
};

export function getInitiateUpdateManagerOwnerInstructionDataSerializer(): Serializer<
  InitiateUpdateManagerOwnerInstructionDataArgs,
  InitiateUpdateManagerOwnerInstructionData
> {
  return mapSerializer<
    InitiateUpdateManagerOwnerInstructionDataArgs,
    any,
    InitiateUpdateManagerOwnerInstructionData
  >(
    struct<InitiateUpdateManagerOwnerInstructionData>(
      [
        ['discriminator', array(u8(), { size: 8 })],
        ['newOwner', publicKeySerializer()],
      ],
      { description: 'InitiateUpdateManagerOwnerInstructionData' }
    ),
    (value) => ({ ...value, discriminator: [5, 2, 223, 246, 50, 226, 98, 78] })
  ) as Serializer<
    InitiateUpdateManagerOwnerInstructionDataArgs,
    InitiateUpdateManagerOwnerInstructionData
  >;
}

// Args.
export type InitiateUpdateManagerOwnerInstructionArgs =
  InitiateUpdateManagerOwnerInstructionDataArgs;

// Instruction.
export function initiateUpdateManagerOwner(
  context: Pick<Context, 'programs'>,
  input: InitiateUpdateManagerOwnerInstructionAccounts &
    InitiateUpdateManagerOwnerInstructionArgs
): TransactionBuilder {
  // Program ID.
  const programId = context.programs.getPublicKey(
    'parityIssuance',
    'ALukFrRp8cFkWCEZamFVsBiFtxKYPLUUGRxskFh1g5ZX'
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
  } satisfies ResolvedAccountsWithIndices;

  // Arguments.
  const resolvedArgs: InitiateUpdateManagerOwnerInstructionArgs = { ...input };

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
    getInitiateUpdateManagerOwnerInstructionDataSerializer().serialize(
      resolvedArgs as InitiateUpdateManagerOwnerInstructionDataArgs
    );

  // Bytes Created On Chain.
  const bytesCreatedOnChain = 0;

  return transactionBuilder([
    { instruction: { keys, programId, data }, signers, bytesCreatedOnChain },
  ]);
}
