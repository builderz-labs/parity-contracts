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
  u64,
  u8,
} from '@metaplex-foundation/umi/serializers';
import {
  ResolvedAccount,
  ResolvedAccountsWithIndices,
  getAccountMetasAndSigners,
} from '../shared';

// Accounts.
export type PtUnstakeInstructionAccounts = {
  globalConfig: PublicKey | Pda;
  userStake: PublicKey | Pda;
  baseMint: PublicKey | Pda;
  userBaseMintAta: PublicKey | Pda;
  vault: PublicKey | Pda;
  user: Signer;
  systemProgram?: PublicKey | Pda;
  tokenProgram?: PublicKey | Pda;
  associatedTokenProgram: PublicKey | Pda;
};

// Data.
export type PtUnstakeInstructionData = {
  discriminator: Array<number>;
  quantity: bigint;
};

export type PtUnstakeInstructionDataArgs = { quantity: number | bigint };

export function getPtUnstakeInstructionDataSerializer(): Serializer<
  PtUnstakeInstructionDataArgs,
  PtUnstakeInstructionData
> {
  return mapSerializer<
    PtUnstakeInstructionDataArgs,
    any,
    PtUnstakeInstructionData
  >(
    struct<PtUnstakeInstructionData>(
      [
        ['discriminator', array(u8(), { size: 8 })],
        ['quantity', u64()],
      ],
      { description: 'PtUnstakeInstructionData' }
    ),
    (value) => ({
      ...value,
      discriminator: [132, 172, 235, 147, 71, 130, 195, 170],
    })
  ) as Serializer<PtUnstakeInstructionDataArgs, PtUnstakeInstructionData>;
}

// Args.
export type PtUnstakeInstructionArgs = PtUnstakeInstructionDataArgs;

// Instruction.
export function ptUnstake(
  context: Pick<Context, 'programs'>,
  input: PtUnstakeInstructionAccounts & PtUnstakeInstructionArgs
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
    userStake: {
      index: 1,
      isWritable: true as boolean,
      value: input.userStake ?? null,
    },
    baseMint: {
      index: 2,
      isWritable: true as boolean,
      value: input.baseMint ?? null,
    },
    userBaseMintAta: {
      index: 3,
      isWritable: true as boolean,
      value: input.userBaseMintAta ?? null,
    },
    vault: {
      index: 4,
      isWritable: true as boolean,
      value: input.vault ?? null,
    },
    user: { index: 5, isWritable: true as boolean, value: input.user ?? null },
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

  // Arguments.
  const resolvedArgs: PtUnstakeInstructionArgs = { ...input };

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
  const data = getPtUnstakeInstructionDataSerializer().serialize(
    resolvedArgs as PtUnstakeInstructionDataArgs
  );

  // Bytes Created On Chain.
  const bytesCreatedOnChain = 0;

  return transactionBuilder([
    { instruction: { keys, programId, data }, signers, bytesCreatedOnChain },
  ]);
}
