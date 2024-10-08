/**
 * This code was AUTOGENERATED using the kinobi library.
 * Please DO NOT EDIT THIS FILE, instead use visitors
 * to add features, then rerun kinobi to update it.
 *
 * @see https://github.com/metaplex-foundation/kinobi
 */

import {
  Account,
  Context,
  Pda,
  PublicKey,
  RpcAccount,
  RpcGetAccountOptions,
  RpcGetAccountsOptions,
  assertAccountExists,
  deserializeAccount,
  gpaBuilder,
  publicKey as toPublicKey,
} from '@metaplex-foundation/umi';
import {
  Serializer,
  array,
  i64,
  mapSerializer,
  publicKey as publicKeySerializer,
  string,
  struct,
  u64,
  u8,
} from '@metaplex-foundation/umi/serializers';
import {
  PointsEarnedPhase,
  PointsEarnedPhaseArgs,
  getPointsEarnedPhaseSerializer,
} from '../types';

export type UserStake = Account<UserStakeAccountData>;

export type UserStakeAccountData = {
  discriminator: Array<number>;
  userPubkey: PublicKey;
  stakedAmount: bigint;
  initialStakingTimestamp: bigint;
  lastClaimTimestamp: bigint;
  pointsHistory: Array<PointsEarnedPhase>;
};

export type UserStakeAccountDataArgs = {
  userPubkey: PublicKey;
  stakedAmount: number | bigint;
  initialStakingTimestamp: number | bigint;
  lastClaimTimestamp: number | bigint;
  pointsHistory: Array<PointsEarnedPhaseArgs>;
};

export function getUserStakeAccountDataSerializer(): Serializer<
  UserStakeAccountDataArgs,
  UserStakeAccountData
> {
  return mapSerializer<UserStakeAccountDataArgs, any, UserStakeAccountData>(
    struct<UserStakeAccountData>(
      [
        ['discriminator', array(u8(), { size: 8 })],
        ['userPubkey', publicKeySerializer()],
        ['stakedAmount', u64()],
        ['initialStakingTimestamp', i64()],
        ['lastClaimTimestamp', i64()],
        ['pointsHistory', array(getPointsEarnedPhaseSerializer())],
      ],
      { description: 'UserStakeAccountData' }
    ),
    (value) => ({
      ...value,
      discriminator: [102, 53, 163, 107, 9, 138, 87, 153],
    })
  ) as Serializer<UserStakeAccountDataArgs, UserStakeAccountData>;
}

export function deserializeUserStake(rawAccount: RpcAccount): UserStake {
  return deserializeAccount(rawAccount, getUserStakeAccountDataSerializer());
}

export async function fetchUserStake(
  context: Pick<Context, 'rpc'>,
  publicKey: PublicKey | Pda,
  options?: RpcGetAccountOptions
): Promise<UserStake> {
  const maybeAccount = await context.rpc.getAccount(
    toPublicKey(publicKey, false),
    options
  );
  assertAccountExists(maybeAccount, 'UserStake');
  return deserializeUserStake(maybeAccount);
}

export async function safeFetchUserStake(
  context: Pick<Context, 'rpc'>,
  publicKey: PublicKey | Pda,
  options?: RpcGetAccountOptions
): Promise<UserStake | null> {
  const maybeAccount = await context.rpc.getAccount(
    toPublicKey(publicKey, false),
    options
  );
  return maybeAccount.exists ? deserializeUserStake(maybeAccount) : null;
}

export async function fetchAllUserStake(
  context: Pick<Context, 'rpc'>,
  publicKeys: Array<PublicKey | Pda>,
  options?: RpcGetAccountsOptions
): Promise<UserStake[]> {
  const maybeAccounts = await context.rpc.getAccounts(
    publicKeys.map((key) => toPublicKey(key, false)),
    options
  );
  return maybeAccounts.map((maybeAccount) => {
    assertAccountExists(maybeAccount, 'UserStake');
    return deserializeUserStake(maybeAccount);
  });
}

export async function safeFetchAllUserStake(
  context: Pick<Context, 'rpc'>,
  publicKeys: Array<PublicKey | Pda>,
  options?: RpcGetAccountsOptions
): Promise<UserStake[]> {
  const maybeAccounts = await context.rpc.getAccounts(
    publicKeys.map((key) => toPublicKey(key, false)),
    options
  );
  return maybeAccounts
    .filter((maybeAccount) => maybeAccount.exists)
    .map((maybeAccount) => deserializeUserStake(maybeAccount as RpcAccount));
}

export function getUserStakeGpaBuilder(
  context: Pick<Context, 'rpc' | 'programs'>
) {
  const programId = context.programs.getPublicKey(
    'ptStaking',
    'AdXJ8Sr46ujd9DSLP5LRyF1BrqxT9azqmQqN2oTyV8cz'
  );
  return gpaBuilder(context, programId)
    .registerFields<{
      discriminator: Array<number>;
      userPubkey: PublicKey;
      stakedAmount: number | bigint;
      initialStakingTimestamp: number | bigint;
      lastClaimTimestamp: number | bigint;
      pointsHistory: Array<PointsEarnedPhaseArgs>;
    }>({
      discriminator: [0, array(u8(), { size: 8 })],
      userPubkey: [8, publicKeySerializer()],
      stakedAmount: [40, u64()],
      initialStakingTimestamp: [48, i64()],
      lastClaimTimestamp: [56, i64()],
      pointsHistory: [64, array(getPointsEarnedPhaseSerializer())],
    })
    .deserializeUsing<UserStake>((account) => deserializeUserStake(account))
    .whereField('discriminator', [102, 53, 163, 107, 9, 138, 87, 153]);
}

export function findUserStakePda(
  context: Pick<Context, 'eddsa' | 'programs'>,
  seeds: {
    /** The address of the user wallet */
    user: PublicKey;
  }
): Pda {
  const programId = context.programs.getPublicKey(
    'ptStaking',
    'AdXJ8Sr46ujd9DSLP5LRyF1BrqxT9azqmQqN2oTyV8cz'
  );
  return context.eddsa.findPda(programId, [
    string({ size: 'variable' }).serialize('user-stake'),
    publicKeySerializer().serialize(seeds.user),
  ]);
}

export async function fetchUserStakeFromSeeds(
  context: Pick<Context, 'eddsa' | 'programs' | 'rpc'>,
  seeds: Parameters<typeof findUserStakePda>[1],
  options?: RpcGetAccountOptions
): Promise<UserStake> {
  return fetchUserStake(context, findUserStakePda(context, seeds), options);
}

export async function safeFetchUserStakeFromSeeds(
  context: Pick<Context, 'eddsa' | 'programs' | 'rpc'>,
  seeds: Parameters<typeof findUserStakePda>[1],
  options?: RpcGetAccountOptions
): Promise<UserStake | null> {
  return safeFetchUserStake(context, findUserStakePda(context, seeds), options);
}
