/**
 * This code was AUTOGENERATED using the kinobi library.
 * Please DO NOT EDIT THIS FILE, instead use visitors
 * to add features, then rerun kinobi to update it.
 *
 * @see https://github.com/metaplex-foundation/kinobi
 */

import {
  ClusterFilter,
  Context,
  Program,
  PublicKey,
} from '@metaplex-foundation/umi';
import {
  getParityIssuanceErrorFromCode,
  getParityIssuanceErrorFromName,
} from '../errors';

export const PARITY_ISSUANCE_PROGRAM_ID =
  'ALukFrRp8cFkWCEZamFVsBiFtxKYPLUUGRxskFh1g5ZX' as PublicKey<'ALukFrRp8cFkWCEZamFVsBiFtxKYPLUUGRxskFh1g5ZX'>;

export function createParityIssuanceProgram(): Program {
  return {
    name: 'parityIssuance',
    publicKey: PARITY_ISSUANCE_PROGRAM_ID,
    getErrorFromCode(code: number, cause?: Error) {
      return getParityIssuanceErrorFromCode(code, this, cause);
    },
    getErrorFromName(name: string, cause?: Error) {
      return getParityIssuanceErrorFromName(name, this, cause);
    },
    isOnCluster() {
      return true;
    },
  };
}

export function getParityIssuanceProgram<T extends Program = Program>(
  context: Pick<Context, 'programs'>,
  clusterFilter?: ClusterFilter
): T {
  return context.programs.get<T>('parityIssuance', clusterFilter);
}

export function getParityIssuanceProgramId(
  context: Pick<Context, 'programs'>,
  clusterFilter?: ClusterFilter
): PublicKey {
  return context.programs.getPublicKey(
    'parityIssuance',
    PARITY_ISSUANCE_PROGRAM_ID,
    clusterFilter
  );
}
