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
export type MintInstructionAccounts = {
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
export type MintInstructionData = {
  discriminator: Array<number>;
  quantity: bigint;
  proof: Array<Uint8Array>;
};

export type MintInstructionDataArgs = {
  quantity: number | bigint;
  proof: Array<Uint8Array>;
};

export function getMintInstructionDataSerializer(): Serializer<
  MintInstructionDataArgs,
  MintInstructionData
> {
  return mapSerializer<MintInstructionDataArgs, any, MintInstructionData>(
    struct<MintInstructionData>(
      [
        ['discriminator', array(u8(), { size: 8 })],
        ['quantity', u64()],
        ['proof', array(bytes({ size: 32 }))],
      ],
      { description: 'MintInstructionData' }
    ),
    (value) => ({
      ...value,
      discriminator: [51, 57, 225, 47, 182, 146, 137, 166],
    })
  ) as Serializer<MintInstructionDataArgs, MintInstructionData>;
}

// Args.
export type MintInstructionArgs = MintInstructionDataArgs;

// Instruction.
export function mint(
  context: Pick<Context, 'payer' | 'programs'>,
  input: MintInstructionAccounts & MintInstructionArgs
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
  const resolvedArgs: MintInstructionArgs = { ...input };

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
  const data = getMintInstructionDataSerializer().serialize(
    resolvedArgs as MintInstructionDataArgs
  );

  // Bytes Created On Chain.
  const bytesCreatedOnChain = 0;

  return transactionBuilder([
    { instruction: { keys, programId, data }, signers, bytesCreatedOnChain },
  ]);
}
