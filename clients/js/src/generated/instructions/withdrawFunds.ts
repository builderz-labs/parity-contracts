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
  struct,
  u8,
} from '@metaplex-foundation/umi/serializers';
import {
  ResolvedAccount,
  ResolvedAccountsWithIndices,
  getAccountMetasAndSigners,
} from '../shared';

// Accounts.
export type WithdrawFundsInstructionAccounts = {
  tokenManager: PublicKey | Pda;
  quoteMint: PublicKey | Pda;
  authorityQuoteMintAta: PublicKey | Pda;
  vault: PublicKey | Pda;
  admin: Signer;
  rent?: PublicKey | Pda;
  systemProgram?: PublicKey | Pda;
  tokenProgram?: PublicKey | Pda;
  associatedTokenProgram: PublicKey | Pda;
};

// Data.
export type WithdrawFundsInstructionData = { discriminator: Array<number> };

export type WithdrawFundsInstructionDataArgs = {};

export function getWithdrawFundsInstructionDataSerializer(): Serializer<
  WithdrawFundsInstructionDataArgs,
  WithdrawFundsInstructionData
> {
  return mapSerializer<
    WithdrawFundsInstructionDataArgs,
    any,
    WithdrawFundsInstructionData
  >(
    struct<WithdrawFundsInstructionData>(
      [['discriminator', array(u8(), { size: 8 })]],
      { description: 'WithdrawFundsInstructionData' }
    ),
    (value) => ({
      ...value,
      discriminator: [241, 36, 29, 111, 208, 31, 104, 217],
    })
  ) as Serializer<
    WithdrawFundsInstructionDataArgs,
    WithdrawFundsInstructionData
  >;
}

// Instruction.
export function withdrawFunds(
  context: Pick<Context, 'programs'>,
  input: WithdrawFundsInstructionAccounts
): TransactionBuilder {
  // Program ID.
  const programId = context.programs.getPublicKey(
    'soldIssuance',
    '5rEgzyEQ6mQEYEetybHXuuvojbKi2mpKXP1fKsVJXJYo'
  );

  // Accounts.
  const resolvedAccounts = {
    tokenManager: {
      index: 0,
      isWritable: true as boolean,
      value: input.tokenManager ?? null,
    },
    quoteMint: {
      index: 1,
      isWritable: false as boolean,
      value: input.quoteMint ?? null,
    },
    authorityQuoteMintAta: {
      index: 2,
      isWritable: true as boolean,
      value: input.authorityQuoteMintAta ?? null,
    },
    vault: {
      index: 3,
      isWritable: true as boolean,
      value: input.vault ?? null,
    },
    admin: {
      index: 4,
      isWritable: true as boolean,
      value: input.admin ?? null,
    },
    rent: { index: 5, isWritable: false as boolean, value: input.rent ?? null },
    systemProgram: {
      index: 6,
      isWritable: false as boolean,
      value: input.systemProgram ?? null,
    },
    tokenProgram: {
      index: 7,
      isWritable: false as boolean,
      value: input.tokenProgram ?? null,
    },
    associatedTokenProgram: {
      index: 8,
      isWritable: false as boolean,
      value: input.associatedTokenProgram ?? null,
    },
  } satisfies ResolvedAccountsWithIndices;

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
  const data = getWithdrawFundsInstructionDataSerializer().serialize({});

  // Bytes Created On Chain.
  const bytesCreatedOnChain = 0;

  return transactionBuilder([
    { instruction: { keys, programId, data }, signers, bytesCreatedOnChain },
  ]);
}
