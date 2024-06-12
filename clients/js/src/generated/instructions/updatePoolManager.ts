/**
 * This code was AUTOGENERATED using the kinobi library.
 * Please DO NOT EDIT THIS FILE, instead use visitors
 * to add features, then rerun kinobi to update it.
 *
 * @see https://github.com/metaplex-foundation/kinobi
 */

import {
  Context,
  Option,
  OptionOrNullable,
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
  option,
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
export type UpdatePoolManagerInstructionAccounts = {
  poolManager: PublicKey | Pda;
  owner: Signer;
};

// Data.
export type UpdatePoolManagerInstructionData = {
  discriminator: Array<number>;
  newOwner: Option<PublicKey>;
  newAdmin: Option<PublicKey>;
};

export type UpdatePoolManagerInstructionDataArgs = {
  newOwner: OptionOrNullable<PublicKey>;
  newAdmin: OptionOrNullable<PublicKey>;
};

export function getUpdatePoolManagerInstructionDataSerializer(): Serializer<
  UpdatePoolManagerInstructionDataArgs,
  UpdatePoolManagerInstructionData
> {
  return mapSerializer<
    UpdatePoolManagerInstructionDataArgs,
    any,
    UpdatePoolManagerInstructionData
  >(
    struct<UpdatePoolManagerInstructionData>(
      [
        ['discriminator', array(u8(), { size: 8 })],
        ['newOwner', option(publicKeySerializer())],
        ['newAdmin', option(publicKeySerializer())],
      ],
      { description: 'UpdatePoolManagerInstructionData' }
    ),
    (value) => ({
      ...value,
      discriminator: [49, 214, 121, 235, 177, 200, 48, 241],
    })
  ) as Serializer<
    UpdatePoolManagerInstructionDataArgs,
    UpdatePoolManagerInstructionData
  >;
}

// Args.
export type UpdatePoolManagerInstructionArgs =
  UpdatePoolManagerInstructionDataArgs;

// Instruction.
export function updatePoolManager(
  context: Pick<Context, 'programs'>,
  input: UpdatePoolManagerInstructionAccounts & UpdatePoolManagerInstructionArgs
): TransactionBuilder {
  // Program ID.
  const programId = context.programs.getPublicKey(
    'soldStaking',
    'F9pkhuLyu1usfS5p6RCuXxeS2TQsAVqANo1M2iC8ze1t'
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
      isWritable: true as boolean,
      value: input.owner ?? null,
    },
  } satisfies ResolvedAccountsWithIndices;

  // Arguments.
  const resolvedArgs: UpdatePoolManagerInstructionArgs = { ...input };

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
  const data = getUpdatePoolManagerInstructionDataSerializer().serialize(
    resolvedArgs as UpdatePoolManagerInstructionDataArgs
  );

  // Bytes Created On Chain.
  const bytesCreatedOnChain = 0;

  return transactionBuilder([
    { instruction: { keys, programId, data }, signers, bytesCreatedOnChain },
  ]);
}
