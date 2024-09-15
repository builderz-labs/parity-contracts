use anchor_lang::prelude::*;
use anchor_spl::token::{Mint, TokenAccount}
;

use crate::{ParityIssuanceError, TokenManager};

#[derive(Accounts)]
pub struct InitializeWithdrawFunds<'info> {
    #[account(mut, seeds = [b"token-manager"], bump)]
    pub token_manager: Account<'info, TokenManager>,
    #[account(
        mint::authority = token_manager,
        mint::decimals = token_manager.mint_decimals,
        address = token_manager.mint,
    )]
    pub mint: Account<'info, Mint>,
    #[account(
        mut,
        associated_token::mint = token_manager.quote_mint,
        associated_token::authority = token_manager,
    )]
    pub vault: Account<'info, TokenAccount>,
    // Other
    #[account(mut, address = token_manager.admin @ ParityIssuanceError::InvalidAdmin)]
    pub admin: Signer<'info>,
}

pub fn handler(ctx: Context<InitializeWithdrawFunds>, quantity: u64) -> Result<()> {
    let token_manager = &mut ctx.accounts.token_manager;
    let mint = &mut ctx.accounts.mint;
    let actual_vault_balance = ctx.accounts.vault.amount;

    let quote_amount = quantity;

    if quote_amount > actual_vault_balance {
        return err!(ParityIssuanceError::ExcessiveWithdrawal);
    }

    let max_withdrawable_amount = token_manager.calculate_max_withdrawable_amount(mint.supply, actual_vault_balance)?;
    msg!("Max withdrawable amount: {}", max_withdrawable_amount);
    msg!("Quote amount: {}", quote_amount);
    msg!("Mint supply: {}", mint.supply);

    if quote_amount > max_withdrawable_amount {
        return err!(ParityIssuanceError::ExcessiveWithdrawal);
    }

    // Update token_manager
    token_manager.pending_withdrawal_amount = quote_amount;
    token_manager.withdrawal_initiation_time = Clock::get()?.unix_timestamp;

    Ok(())
}
