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
  getSoldStakingErrorFromCode,
  getSoldStakingErrorFromName,
} from '../errors';

export const SOLD_STAKING_PROGRAM_ID =
  'F9pkhuLyu1usfS5p6RCuXxeS2TQsAVqANo1M2iC8ze1t' as PublicKey<'F9pkhuLyu1usfS5p6RCuXxeS2TQsAVqANo1M2iC8ze1t'>;

export function createSoldStakingProgram(): Program {
  return {
    name: 'soldStaking',
    publicKey: SOLD_STAKING_PROGRAM_ID,
    getErrorFromCode(code: number, cause?: Error) {
      return getSoldStakingErrorFromCode(code, this, cause);
    },
    getErrorFromName(name: string, cause?: Error) {
      return getSoldStakingErrorFromName(name, this, cause);
    },
    isOnCluster() {
      return true;
    },
  };
}

export function getSoldStakingProgram<T extends Program = Program>(
  context: Pick<Context, 'programs'>,
  clusterFilter?: ClusterFilter
): T {
  return context.programs.get<T>('soldStaking', clusterFilter);
}

export function getSoldStakingProgramId(
  context: Pick<Context, 'programs'>,
  clusterFilter?: ClusterFilter
): PublicKey {
  return context.programs.getPublicKey(
    'soldStaking',
    SOLD_STAKING_PROGRAM_ID,
    clusterFilter
  );
}