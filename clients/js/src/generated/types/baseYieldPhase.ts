/**
 * This code was AUTOGENERATED using the kinobi library.
 * Please DO NOT EDIT THIS FILE, instead use visitors
 * to add features, then rerun kinobi to update it.
 *
 * @see https://github.com/metaplex-foundation/kinobi
 */

import { Option, OptionOrNullable } from '@metaplex-foundation/umi';
import {
  Serializer,
  i64,
  option,
  struct,
  u16,
  u64,
} from '@metaplex-foundation/umi/serializers';

export type BaseYieldPhase = {
  baseYieldBps: bigint;
  startDate: bigint;
  endDate: Option<bigint>;
  index: number;
};

export type BaseYieldPhaseArgs = {
  baseYieldBps: number | bigint;
  startDate: number | bigint;
  endDate: OptionOrNullable<number | bigint>;
  index: number;
};

export function getBaseYieldPhaseSerializer(): Serializer<
  BaseYieldPhaseArgs,
  BaseYieldPhase
> {
  return struct<BaseYieldPhase>(
    [
      ['baseYieldBps', u64()],
      ['startDate', i64()],
      ['endDate', option(i64())],
      ['index', u16()],
    ],
    { description: 'BaseYieldPhase' }
  ) as Serializer<BaseYieldPhaseArgs, BaseYieldPhase>;
}
