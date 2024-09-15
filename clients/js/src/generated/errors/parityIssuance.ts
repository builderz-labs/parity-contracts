/**
 * This code was AUTOGENERATED using the kinobi library.
 * Please DO NOT EDIT THIS FILE, instead use visitors
 * to add features, then rerun kinobi to update it.
 *
 * @see https://github.com/metaplex-foundation/kinobi
 */

import { Program, ProgramError } from '@metaplex-foundation/umi';

type ProgramErrorConstructor = new (
  program: Program,
  cause?: Error
) => ProgramError;
const codeToErrorMap: Map<number, ProgramErrorConstructor> = new Map();
const nameToErrorMap: Map<string, ProgramErrorConstructor> = new Map();

/** InvalidQuoteMintAddress: Invalid quote mint address */
export class SiInvalidQuoteMintAddressError extends ProgramError {
  override readonly name: string = 'InvalidQuoteMintAddress';

  readonly code: number = 0x1770; // 6000

  constructor(program: Program, cause?: Error) {
    super('Invalid quote mint address', program, cause);
  }
}
codeToErrorMap.set(0x1770, SiInvalidQuoteMintAddressError);
nameToErrorMap.set('InvalidQuoteMintAddress', SiInvalidQuoteMintAddressError);

/** InvalidMintAddress: Invalid mint address */
export class SiInvalidMintAddressError extends ProgramError {
  override readonly name: string = 'InvalidMintAddress';

  readonly code: number = 0x1771; // 6001

  constructor(program: Program, cause?: Error) {
    super('Invalid mint address', program, cause);
  }
}
codeToErrorMap.set(0x1771, SiInvalidMintAddressError);
nameToErrorMap.set('InvalidMintAddress', SiInvalidMintAddressError);

/** MintAndRedemptionsPaused: Mint and redemptions paused */
export class SiMintAndRedemptionsPausedError extends ProgramError {
  override readonly name: string = 'MintAndRedemptionsPaused';

  readonly code: number = 0x1772; // 6002

  constructor(program: Program, cause?: Error) {
    super('Mint and redemptions paused', program, cause);
  }
}
codeToErrorMap.set(0x1772, SiMintAndRedemptionsPausedError);
nameToErrorMap.set('MintAndRedemptionsPaused', SiMintAndRedemptionsPausedError);

/** AddressNotFoundInAllowedList: Address not found in allowed list */
export class SiAddressNotFoundInAllowedListError extends ProgramError {
  override readonly name: string = 'AddressNotFoundInAllowedList';

  readonly code: number = 0x1773; // 6003

  constructor(program: Program, cause?: Error) {
    super('Address not found in allowed list', program, cause);
  }
}
codeToErrorMap.set(0x1773, SiAddressNotFoundInAllowedListError);
nameToErrorMap.set(
  'AddressNotFoundInAllowedList',
  SiAddressNotFoundInAllowedListError
);

/** MissingAllowedListProof: Missing allowed list proof */
export class SiMissingAllowedListProofError extends ProgramError {
  override readonly name: string = 'MissingAllowedListProof';

  readonly code: number = 0x1774; // 6004

  constructor(program: Program, cause?: Error) {
    super('Missing allowed list proof', program, cause);
  }
}
codeToErrorMap.set(0x1774, SiMissingAllowedListProofError);
nameToErrorMap.set('MissingAllowedListProof', SiMissingAllowedListProofError);

/** TokenManagerStatusUnchanged: Token manager status unchanged */
export class SiTokenManagerStatusUnchangedError extends ProgramError {
  override readonly name: string = 'TokenManagerStatusUnchanged';

  readonly code: number = 0x1775; // 6005

  constructor(program: Program, cause?: Error) {
    super('Token manager status unchanged', program, cause);
  }
}
codeToErrorMap.set(0x1775, SiTokenManagerStatusUnchangedError);
nameToErrorMap.set(
  'TokenManagerStatusUnchanged',
  SiTokenManagerStatusUnchangedError
);

/** ExcessiveDeposit: Excessive Deposit, collateral shouldn't exceed 100% */
export class SiExcessiveDepositError extends ProgramError {
  override readonly name: string = 'ExcessiveDeposit';

  readonly code: number = 0x1776; // 6006

  constructor(program: Program, cause?: Error) {
    super(
      "Excessive Deposit, collateral shouldn't exceed 100%",
      program,
      cause
    );
  }
}
codeToErrorMap.set(0x1776, SiExcessiveDepositError);
nameToErrorMap.set('ExcessiveDeposit', SiExcessiveDepositError);

/** ExcessiveWithdrawal: Excessive Withdrawal, collateral shouldn't be less than collateral threshold */
export class SiExcessiveWithdrawalError extends ProgramError {
  override readonly name: string = 'ExcessiveWithdrawal';

  readonly code: number = 0x1777; // 6007

  constructor(program: Program, cause?: Error) {
    super(
      "Excessive Withdrawal, collateral shouldn't be less than collateral threshold",
      program,
      cause
    );
  }
}
codeToErrorMap.set(0x1777, SiExcessiveWithdrawalError);
nameToErrorMap.set('ExcessiveWithdrawal', SiExcessiveWithdrawalError);

/** CalculationOverflow: Calculation overflow */
export class SiCalculationOverflowError extends ProgramError {
  override readonly name: string = 'CalculationOverflow';

  readonly code: number = 0x1778; // 6008

  constructor(program: Program, cause?: Error) {
    super('Calculation overflow', program, cause);
  }
}
codeToErrorMap.set(0x1778, SiCalculationOverflowError);
nameToErrorMap.set('CalculationOverflow', SiCalculationOverflowError);

/** SlotLimitExceeded: Slot limit exceeded */
export class SiSlotLimitExceededError extends ProgramError {
  override readonly name: string = 'SlotLimitExceeded';

  readonly code: number = 0x1779; // 6009

  constructor(program: Program, cause?: Error) {
    super('Slot limit exceeded', program, cause);
  }
}
codeToErrorMap.set(0x1779, SiSlotLimitExceededError);
nameToErrorMap.set('SlotLimitExceeded', SiSlotLimitExceededError);

/** InvalidAdmin: Invalid admin */
export class SiInvalidAdminError extends ProgramError {
  override readonly name: string = 'InvalidAdmin';

  readonly code: number = 0x177a; // 6010

  constructor(program: Program, cause?: Error) {
    super('Invalid admin', program, cause);
  }
}
codeToErrorMap.set(0x177a, SiInvalidAdminError);
nameToErrorMap.set('InvalidAdmin', SiInvalidAdminError);

/** InvalidOwner: Invalid owner */
export class SiInvalidOwnerError extends ProgramError {
  override readonly name: string = 'InvalidOwner';

  readonly code: number = 0x177b; // 6011

  constructor(program: Program, cause?: Error) {
    super('Invalid owner', program, cause);
  }
}
codeToErrorMap.set(0x177b, SiInvalidOwnerError);
nameToErrorMap.set('InvalidOwner', SiInvalidOwnerError);

/** InvalidMinter: Invalid minter */
export class SiInvalidMinterError extends ProgramError {
  override readonly name: string = 'InvalidMinter';

  readonly code: number = 0x177c; // 6012

  constructor(program: Program, cause?: Error) {
    super('Invalid minter', program, cause);
  }
}
codeToErrorMap.set(0x177c, SiInvalidMinterError);
nameToErrorMap.set('InvalidMinter', SiInvalidMinterError);

/** InvalidToggleActiveAuthority: Invalid toggle active authority */
export class SiInvalidToggleActiveAuthorityError extends ProgramError {
  override readonly name: string = 'InvalidToggleActiveAuthority';

  readonly code: number = 0x177d; // 6013

  constructor(program: Program, cause?: Error) {
    super('Invalid toggle active authority', program, cause);
  }
}
codeToErrorMap.set(0x177d, SiInvalidToggleActiveAuthorityError);
nameToErrorMap.set(
  'InvalidToggleActiveAuthority',
  SiInvalidToggleActiveAuthorityError
);

/** NoPendingWithdrawal: No pending withdrawal */
export class SiNoPendingWithdrawalError extends ProgramError {
  override readonly name: string = 'NoPendingWithdrawal';

  readonly code: number = 0x177e; // 6014

  constructor(program: Program, cause?: Error) {
    super('No pending withdrawal', program, cause);
  }
}
codeToErrorMap.set(0x177e, SiNoPendingWithdrawalError);
nameToErrorMap.set('NoPendingWithdrawal', SiNoPendingWithdrawalError);

/** WithdrawalNotReady: Withdrawal not ready */
export class SiWithdrawalNotReadyError extends ProgramError {
  override readonly name: string = 'WithdrawalNotReady';

  readonly code: number = 0x177f; // 6015

  constructor(program: Program, cause?: Error) {
    super('Withdrawal not ready', program, cause);
  }
}
codeToErrorMap.set(0x177f, SiWithdrawalNotReadyError);
nameToErrorMap.set('WithdrawalNotReady', SiWithdrawalNotReadyError);

/** WithdrawalExpired: Withdrawal expired */
export class SiWithdrawalExpiredError extends ProgramError {
  override readonly name: string = 'WithdrawalExpired';

  readonly code: number = 0x1780; // 6016

  constructor(program: Program, cause?: Error) {
    super('Withdrawal expired', program, cause);
  }
}
codeToErrorMap.set(0x1780, SiWithdrawalExpiredError);
nameToErrorMap.set('WithdrawalExpired', SiWithdrawalExpiredError);

/**
 * Attempts to resolve a custom program error from the provided error code.
 * @category Errors
 */
export function getParityIssuanceErrorFromCode(
  code: number,
  program: Program,
  cause?: Error
): ProgramError | null {
  const constructor = codeToErrorMap.get(code);
  return constructor ? new constructor(program, cause) : null;
}

/**
 * Attempts to resolve a custom program error from the provided error name, i.e. 'Unauthorized'.
 * @category Errors
 */
export function getParityIssuanceErrorFromName(
  name: string,
  program: Program,
  cause?: Error
): ProgramError | null {
  const constructor = nameToErrorMap.get(name);
  return constructor ? new constructor(program, cause) : null;
}
