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
export type RemoveGatekeeperInstructionAccounts = {
  tokenManager: PublicKey | Pda;
  gatekeeper: PublicKey | Pda;
  admin: Signer;
};

// Data.
export type RemoveGatekeeperInstructionData = { discriminator: Array<number> };

export type RemoveGatekeeperInstructionDataArgs = {};

export function getRemoveGatekeeperInstructionDataSerializer(): Serializer<
  RemoveGatekeeperInstructionDataArgs,
  RemoveGatekeeperInstructionData
> {
  return mapSerializer<
    RemoveGatekeeperInstructionDataArgs,
    any,
    RemoveGatekeeperInstructionData
  >(
    struct<RemoveGatekeeperInstructionData>(
      [['discriminator', array(u8(), { size: 8 })]],
      { description: 'RemoveGatekeeperInstructionData' }
    ),
    (value) => ({ ...value, discriminator: [238, 65, 200, 12, 18, 41, 141, 7] })
  ) as Serializer<
    RemoveGatekeeperInstructionDataArgs,
    RemoveGatekeeperInstructionData
  >;
}

// Instruction.
export function removeGatekeeper(
  context: Pick<Context, 'programs'>,
  input: RemoveGatekeeperInstructionAccounts
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
    gatekeeper: {
      index: 1,
      isWritable: true as boolean,
      value: input.gatekeeper ?? null,
    },
    admin: {
      index: 2,
      isWritable: false as boolean,
      value: input.admin ?? null,
    },
  } satisfies ResolvedAccountsWithIndices;

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
  const data = getRemoveGatekeeperInstructionDataSerializer().serialize({});

  // Bytes Created On Chain.
  const bytesCreatedOnChain = 0;

  return transactionBuilder([
    { instruction: { keys, programId, data }, signers, bytesCreatedOnChain },
  ]);
}
