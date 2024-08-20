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
export type UpdateGlobalConfigInstructionAccounts = {
  globalConfig: PublicKey | Pda;
  owner: Signer;
};

// Data.
export type UpdateGlobalConfigInstructionData = {
  discriminator: Array<number>;
  newBaselineYield: Option<bigint>;
  newExchangeRate: Option<bigint>;
  newDepositCap: Option<bigint>;
};

export type UpdateGlobalConfigInstructionDataArgs = {
  newBaselineYield: OptionOrNullable<number | bigint>;
  newExchangeRate: OptionOrNullable<number | bigint>;
  newDepositCap: OptionOrNullable<number | bigint>;
};

export function getUpdateGlobalConfigInstructionDataSerializer(): Serializer<
  UpdateGlobalConfigInstructionDataArgs,
  UpdateGlobalConfigInstructionData
> {
  return mapSerializer<
    UpdateGlobalConfigInstructionDataArgs,
    any,
    UpdateGlobalConfigInstructionData
  >(
    struct<UpdateGlobalConfigInstructionData>(
      [
        ['discriminator', array(u8(), { size: 8 })],
        ['newBaselineYield', option(u64())],
        ['newExchangeRate', option(u64())],
        ['newDepositCap', option(u64())],
      ],
      { description: 'UpdateGlobalConfigInstructionData' }
    ),
    (value) => ({
      ...value,
      discriminator: [164, 84, 130, 189, 111, 58, 250, 200],
    })
  ) as Serializer<
    UpdateGlobalConfigInstructionDataArgs,
    UpdateGlobalConfigInstructionData
  >;
}

// Args.
export type UpdateGlobalConfigInstructionArgs =
  UpdateGlobalConfigInstructionDataArgs;

// Instruction.
export function updateGlobalConfig(
  context: Pick<Context, 'programs'>,
  input: UpdateGlobalConfigInstructionAccounts &
    UpdateGlobalConfigInstructionArgs
): TransactionBuilder {
  // Program ID.
  const programId = context.programs.getPublicKey(
    'ptStaking',
    '5zWkamSdh3S4hELhV1ezx6gzyCinBVi38StJUdi8cfGa'
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
  const resolvedArgs: UpdateGlobalConfigInstructionArgs = { ...input };

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
  const data = getUpdateGlobalConfigInstructionDataSerializer().serialize(
    resolvedArgs as UpdateGlobalConfigInstructionDataArgs
  );

  // Bytes Created On Chain.
  const bytesCreatedOnChain = 0;

  return transactionBuilder([
    { instruction: { keys, programId, data }, signers, bytesCreatedOnChain },
  ]);
}
