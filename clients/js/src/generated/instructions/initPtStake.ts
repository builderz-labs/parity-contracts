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
export type InitPtStakeInstructionAccounts = {
  userStake: PublicKey | Pda;
  user: Signer;
  systemProgram?: PublicKey | Pda;
};

// Data.
export type InitPtStakeInstructionData = { discriminator: Array<number> };

export type InitPtStakeInstructionDataArgs = {};

export function getInitPtStakeInstructionDataSerializer(): Serializer<
  InitPtStakeInstructionDataArgs,
  InitPtStakeInstructionData
> {
  return mapSerializer<
    InitPtStakeInstructionDataArgs,
    any,
    InitPtStakeInstructionData
  >(
    struct<InitPtStakeInstructionData>(
      [['discriminator', array(u8(), { size: 8 })]],
      { description: 'InitPtStakeInstructionData' }
    ),
    (value) => ({
      ...value,
      discriminator: [168, 150, 58, 162, 118, 13, 218, 226],
    })
  ) as Serializer<InitPtStakeInstructionDataArgs, InitPtStakeInstructionData>;
}

// Instruction.
export function initPtStake(
  context: Pick<Context, 'programs'>,
  input: InitPtStakeInstructionAccounts
): TransactionBuilder {
  // Program ID.
  const programId = context.programs.getPublicKey(
    'ptStaking',
    'AdXJ8Sr46ujd9DSLP5LRyF1BrqxT9azqmQqN2oTyV8cz'
  );

  // Accounts.
  const resolvedAccounts = {
    userStake: {
      index: 0,
      isWritable: true as boolean,
      value: input.userStake ?? null,
    },
    user: { index: 1, isWritable: true as boolean, value: input.user ?? null },
    systemProgram: {
      index: 2,
      isWritable: false as boolean,
      value: input.systemProgram ?? null,
    },
  } satisfies ResolvedAccountsWithIndices;

  // Default values.
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
  const data = getInitPtStakeInstructionDataSerializer().serialize({});

  // Bytes Created On Chain.
  const bytesCreatedOnChain = 0;

  return transactionBuilder([
    { instruction: { keys, programId, data }, signers, bytesCreatedOnChain },
  ]);
}
