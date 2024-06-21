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
  bytes,
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
export type RedeemInstructionAccounts = {
  tokenManager: PublicKey | Pda;
  mint: PublicKey | Pda;
  payerMintAta: PublicKey | Pda;
  quoteMint: PublicKey | Pda;
  payerQuoteMintAta: PublicKey | Pda;
  vault: PublicKey | Pda;
  payer?: Signer;
  systemProgram?: PublicKey | Pda;
  tokenProgram?: PublicKey | Pda;
  associatedTokenProgram: PublicKey | Pda;
};

// Data.
export type RedeemInstructionData = {
  discriminator: Array<number>;
  quantity: bigint;
  proof: Array<Uint8Array>;
};

export type RedeemInstructionDataArgs = {
  quantity: number | bigint;
  proof: Array<Uint8Array>;
};

export function getRedeemInstructionDataSerializer(): Serializer<
  RedeemInstructionDataArgs,
  RedeemInstructionData
> {
  return mapSerializer<RedeemInstructionDataArgs, any, RedeemInstructionData>(
    struct<RedeemInstructionData>(
      [
        ['discriminator', array(u8(), { size: 8 })],
        ['quantity', u64()],
        ['proof', array(bytes({ size: 32 }))],
      ],
      { description: 'RedeemInstructionData' }
    ),
    (value) => ({
      ...value,
      discriminator: [184, 12, 86, 149, 70, 196, 97, 225],
    })
  ) as Serializer<RedeemInstructionDataArgs, RedeemInstructionData>;
}

// Args.
export type RedeemInstructionArgs = RedeemInstructionDataArgs;

// Instruction.
export function redeem(
  context: Pick<Context, 'payer' | 'programs'>,
  input: RedeemInstructionAccounts & RedeemInstructionArgs
): TransactionBuilder {
  // Program ID.
  const programId = context.programs.getPublicKey(
    'soldIssuance',
    'JCLA8ET4DCCsJsvNcaNBhpY8ZudFfAbpgspPBnni1NQy'
  );

  // Accounts.
  const resolvedAccounts = {
    tokenManager: {
      index: 0,
      isWritable: true as boolean,
      value: input.tokenManager ?? null,
    },
    mint: { index: 1, isWritable: true as boolean, value: input.mint ?? null },
    payerMintAta: {
      index: 2,
      isWritable: true as boolean,
      value: input.payerMintAta ?? null,
    },
    quoteMint: {
      index: 3,
      isWritable: false as boolean,
      value: input.quoteMint ?? null,
    },
    payerQuoteMintAta: {
      index: 4,
      isWritable: true as boolean,
      value: input.payerQuoteMintAta ?? null,
    },
    vault: {
      index: 5,
      isWritable: true as boolean,
      value: input.vault ?? null,
    },
    payer: {
      index: 6,
      isWritable: true as boolean,
      value: input.payer ?? null,
    },
    systemProgram: {
      index: 7,
      isWritable: false as boolean,
      value: input.systemProgram ?? null,
    },
    tokenProgram: {
      index: 8,
      isWritable: false as boolean,
      value: input.tokenProgram ?? null,
    },
    associatedTokenProgram: {
      index: 9,
      isWritable: false as boolean,
      value: input.associatedTokenProgram ?? null,
    },
  } satisfies ResolvedAccountsWithIndices;

  // Arguments.
  const resolvedArgs: RedeemInstructionArgs = { ...input };

  // Default values.
  if (!resolvedAccounts.payer.value) {
    resolvedAccounts.payer.value = context.payer;
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
  const data = getRedeemInstructionDataSerializer().serialize(
    resolvedArgs as RedeemInstructionDataArgs
  );

  // Bytes Created On Chain.
  const bytesCreatedOnChain = 0;

  return transactionBuilder([
    { instruction: { keys, programId, data }, signers, bytesCreatedOnChain },
  ]);
}
