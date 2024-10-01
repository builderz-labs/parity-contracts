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
export type WithdrawExcessPtInstructionAccounts = {
  globalConfig: PublicKey | Pda;
  baseMint: PublicKey | Pda;
  adminBaseMintAta: PublicKey | Pda;
  vault: PublicKey | Pda;
  admin: Signer;
  systemProgram?: PublicKey | Pda;
  tokenProgram?: PublicKey | Pda;
  associatedTokenProgram: PublicKey | Pda;
};

// Data.
export type WithdrawExcessPtInstructionData = { discriminator: Array<number> };

export type WithdrawExcessPtInstructionDataArgs = {};

export function getWithdrawExcessPtInstructionDataSerializer(): Serializer<
  WithdrawExcessPtInstructionDataArgs,
  WithdrawExcessPtInstructionData
> {
  return mapSerializer<
    WithdrawExcessPtInstructionDataArgs,
    any,
    WithdrawExcessPtInstructionData
  >(
    struct<WithdrawExcessPtInstructionData>(
      [['discriminator', array(u8(), { size: 8 })]],
      { description: 'WithdrawExcessPtInstructionData' }
    ),
    (value) => ({
      ...value,
      discriminator: [146, 110, 201, 148, 129, 233, 29, 225],
    })
  ) as Serializer<
    WithdrawExcessPtInstructionDataArgs,
    WithdrawExcessPtInstructionData
  >;
}

// Instruction.
export function withdrawExcessPt(
  context: Pick<Context, 'programs'>,
  input: WithdrawExcessPtInstructionAccounts
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
    baseMint: {
      index: 1,
      isWritable: true as boolean,
      value: input.baseMint ?? null,
    },
    adminBaseMintAta: {
      index: 2,
      isWritable: true as boolean,
      value: input.adminBaseMintAta ?? null,
    },
    vault: {
      index: 3,
      isWritable: true as boolean,
      value: input.vault ?? null,
    },
    admin: {
      index: 4,
      isWritable: false as boolean,
      value: input.admin ?? null,
    },
    systemProgram: {
      index: 5,
      isWritable: false as boolean,
      value: input.systemProgram ?? null,
    },
    tokenProgram: {
      index: 6,
      isWritable: false as boolean,
      value: input.tokenProgram ?? null,
    },
    associatedTokenProgram: {
      index: 7,
      isWritable: false as boolean,
      value: input.associatedTokenProgram ?? null,
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
  if (!resolvedAccounts.tokenProgram.value) {
    resolvedAccounts.tokenProgram.value = context.programs.getPublicKey(
      'splToken',
      'TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA'
    );
    resolvedAccounts.tokenProgram.isWritable = false;
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
  const data = getWithdrawExcessPtInstructionDataSerializer().serialize({});

  // Bytes Created On Chain.
  const bytesCreatedOnChain = 0;

  return transactionBuilder([
    { instruction: { keys, programId, data }, signers, bytesCreatedOnChain },
  ]);
}