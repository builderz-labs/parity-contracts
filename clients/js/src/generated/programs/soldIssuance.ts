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
  getSoldIssuanceErrorFromCode,
  getSoldIssuanceErrorFromName,
} from '../errors';

export const SOLD_ISSUANCE_PROGRAM_ID =
  '2EWh1kTyMUgv46FdwJYJP61LXvrhLp5CqDfy5gDoqggf' as PublicKey<'2EWh1kTyMUgv46FdwJYJP61LXvrhLp5CqDfy5gDoqggf'>;

export function createSoldIssuanceProgram(): Program {
  return {
    name: 'soldIssuance',
    publicKey: SOLD_ISSUANCE_PROGRAM_ID,
    getErrorFromCode(code: number, cause?: Error) {
      return getSoldIssuanceErrorFromCode(code, this, cause);
    },
    getErrorFromName(name: string, cause?: Error) {
      return getSoldIssuanceErrorFromName(name, this, cause);
    },
    isOnCluster() {
      return true;
    },
  };
}

export function getSoldIssuanceProgram<T extends Program = Program>(
  context: Pick<Context, 'programs'>,
  clusterFilter?: ClusterFilter
): T {
  return context.programs.get<T>('soldIssuance', clusterFilter);
}

export function getSoldIssuanceProgramId(
  context: Pick<Context, 'programs'>,
  clusterFilter?: ClusterFilter
): PublicKey {
  return context.programs.getPublicKey(
    'soldIssuance',
    SOLD_ISSUANCE_PROGRAM_ID,
    clusterFilter
  );
}
