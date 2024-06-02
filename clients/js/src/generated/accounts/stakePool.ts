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

export type StakePool = Account<StakePoolAccountData>;

export type StakePoolAccountData = {
  discriminator: Array<number>;
  baseMint: PublicKey;
  xMint: PublicKey;
  inceptionTimestamp: bigint;
  lastYieldChangeTimestamp: bigint;
  annualYieldRate: bigint;
  baseBalance: bigint;
  xSupply: bigint;
  authority: PublicKey;
  bump: number;
  baseMintDecimals: number;
  xMintDecimals: number;
  initialExchangeRate: bigint;
  lastYieldChangeExchangeRate: bigint;
};

export type StakePoolAccountDataArgs = {
  baseMint: PublicKey;
  xMint: PublicKey;
  inceptionTimestamp: number | bigint;
  lastYieldChangeTimestamp: number | bigint;
  annualYieldRate: number | bigint;
  baseBalance: number | bigint;
  xSupply: number | bigint;
  authority: PublicKey;
  bump: number;
  baseMintDecimals: number;
  xMintDecimals: number;
  initialExchangeRate: number | bigint;
  lastYieldChangeExchangeRate: number | bigint;
};

export function getStakePoolAccountDataSerializer(): Serializer<
  StakePoolAccountDataArgs,
  StakePoolAccountData
> {
  return mapSerializer<StakePoolAccountDataArgs, any, StakePoolAccountData>(
    struct<StakePoolAccountData>(
      [
        ['discriminator', array(u8(), { size: 8 })],
        ['baseMint', publicKeySerializer()],
        ['xMint', publicKeySerializer()],
        ['inceptionTimestamp', i64()],
        ['lastYieldChangeTimestamp', i64()],
        ['annualYieldRate', u64()],
        ['baseBalance', u64()],
        ['xSupply', u64()],
        ['authority', publicKeySerializer()],
        ['bump', u8()],
        ['baseMintDecimals', u8()],
        ['xMintDecimals', u8()],
        ['initialExchangeRate', u64()],
        ['lastYieldChangeExchangeRate', u64()],
      ],
      { description: 'StakePoolAccountData' }
    ),
    (value) => ({
      ...value,
      discriminator: [121, 34, 206, 21, 79, 127, 255, 28],
    })
  ) as Serializer<StakePoolAccountDataArgs, StakePoolAccountData>;
}

export function deserializeStakePool(rawAccount: RpcAccount): StakePool {
  return deserializeAccount(rawAccount, getStakePoolAccountDataSerializer());
}

export async function fetchStakePool(
  context: Pick<Context, 'rpc'>,
  publicKey: PublicKey | Pda,
  options?: RpcGetAccountOptions
): Promise<StakePool> {
  const maybeAccount = await context.rpc.getAccount(
    toPublicKey(publicKey, false),
    options
  );
  assertAccountExists(maybeAccount, 'StakePool');
  return deserializeStakePool(maybeAccount);
}

export async function safeFetchStakePool(
  context: Pick<Context, 'rpc'>,
  publicKey: PublicKey | Pda,
  options?: RpcGetAccountOptions
): Promise<StakePool | null> {
  const maybeAccount = await context.rpc.getAccount(
    toPublicKey(publicKey, false),
    options
  );
  return maybeAccount.exists ? deserializeStakePool(maybeAccount) : null;
}

export async function fetchAllStakePool(
  context: Pick<Context, 'rpc'>,
  publicKeys: Array<PublicKey | Pda>,
  options?: RpcGetAccountsOptions
): Promise<StakePool[]> {
  const maybeAccounts = await context.rpc.getAccounts(
    publicKeys.map((key) => toPublicKey(key, false)),
    options
  );
  return maybeAccounts.map((maybeAccount) => {
    assertAccountExists(maybeAccount, 'StakePool');
    return deserializeStakePool(maybeAccount);
  });
}

export async function safeFetchAllStakePool(
  context: Pick<Context, 'rpc'>,
  publicKeys: Array<PublicKey | Pda>,
  options?: RpcGetAccountsOptions
): Promise<StakePool[]> {
  const maybeAccounts = await context.rpc.getAccounts(
    publicKeys.map((key) => toPublicKey(key, false)),
    options
  );
  return maybeAccounts
    .filter((maybeAccount) => maybeAccount.exists)
    .map((maybeAccount) => deserializeStakePool(maybeAccount as RpcAccount));
}

export function getStakePoolGpaBuilder(
  context: Pick<Context, 'rpc' | 'programs'>
) {
  const programId = context.programs.getPublicKey(
    'soldStaking',
    'F9pkhuLyu1usfS5p6RCuXxeS2TQsAVqANo1M2iC8ze1t'
  );
  return gpaBuilder(context, programId)
    .registerFields<{
      discriminator: Array<number>;
      baseMint: PublicKey;
      xMint: PublicKey;
      inceptionTimestamp: number | bigint;
      lastYieldChangeTimestamp: number | bigint;
      annualYieldRate: number | bigint;
      baseBalance: number | bigint;
      xSupply: number | bigint;
      authority: PublicKey;
      bump: number;
      baseMintDecimals: number;
      xMintDecimals: number;
      initialExchangeRate: number | bigint;
      lastYieldChangeExchangeRate: number | bigint;
    }>({
      discriminator: [0, array(u8(), { size: 8 })],
      baseMint: [8, publicKeySerializer()],
      xMint: [40, publicKeySerializer()],
      inceptionTimestamp: [72, i64()],
      lastYieldChangeTimestamp: [80, i64()],
      annualYieldRate: [88, u64()],
      baseBalance: [96, u64()],
      xSupply: [104, u64()],
      authority: [112, publicKeySerializer()],
      bump: [144, u8()],
      baseMintDecimals: [145, u8()],
      xMintDecimals: [146, u8()],
      initialExchangeRate: [147, u64()],
      lastYieldChangeExchangeRate: [155, u64()],
    })
    .deserializeUsing<StakePool>((account) => deserializeStakePool(account))
    .whereField('discriminator', [121, 34, 206, 21, 79, 127, 255, 28]);
}

export function getStakePoolSize(): number {
  return 163;
}

export function findStakePoolPda(
  context: Pick<Context, 'eddsa' | 'programs'>
): Pda {
  const programId = context.programs.getPublicKey(
    'soldStaking',
    'F9pkhuLyu1usfS5p6RCuXxeS2TQsAVqANo1M2iC8ze1t'
  );
  return context.eddsa.findPda(programId, [
    string({ size: 'variable' }).serialize('stake-pool'),
  ]);
}

export async function fetchStakePoolFromSeeds(
  context: Pick<Context, 'eddsa' | 'programs' | 'rpc'>,
  options?: RpcGetAccountOptions
): Promise<StakePool> {
  return fetchStakePool(context, findStakePoolPda(context), options);
}

export async function safeFetchStakePoolFromSeeds(
  context: Pick<Context, 'eddsa' | 'programs' | 'rpc'>,
  options?: RpcGetAccountOptions
): Promise<StakePool | null> {
  return safeFetchStakePool(context, findStakePoolPda(context), options);
}