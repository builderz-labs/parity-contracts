use anchor_lang::prelude::*;
use anchor_spl::token::TokenAccount;

use crate::{error::ParityStakingError, PoolManager};

#[derive(AnchorSerialize, AnchorDeserialize, Debug, Clone)]
pub struct UpdatePoolManagerParams {
    pub new_admin: Option<Pubkey>,
    pub new_deposit_cap: Option<u64>,
}

#[derive(Accounts)]
pub struct UpdatePoolManager<'info> {
    #[account(
        mut,
        seeds = [b"pool-manager"],
        bump = pool_manager.bump
    )]
    pub pool_manager: Account<'info, PoolManager>,
    #[account(
        mut,
        associated_token::mint = pool_manager.base_mint,
        associated_token::authority = pool_manager,
    )]
    pub vault: Account<'info, TokenAccount>,
    #[account(mut, address = pool_manager.owner @ ParityStakingError::InvalidOwner)]
    pub owner: Signer<'info>,
}

pub fn handler(ctx: Context<UpdatePoolManager>, params: UpdatePoolManagerParams) -> Result<()> {
    let pool_manager = &mut ctx.accounts.pool_manager;

    if let Some(new_admin) = params.new_admin {
        if new_admin == Pubkey::default() {
            return err!(ParityStakingError::InvalidParam); // Ensure new admin is not the default public key
        }
        pool_manager.admin = new_admin;
    }

    if let Some(new_deposit_cap) = params.new_deposit_cap {
        if new_deposit_cap == 0 {
            return err!(ParityStakingError::InvalidParam); // Ensure deposit cap is non-zero
        }

        // Check that the new deposit cap is not less than the previous
        let vault_amount = ctx.accounts.vault.amount;
        if new_deposit_cap < vault_amount {
            return err!(ParityStakingError::DepositCapTooLow);
        }

        pool_manager.deposit_cap = new_deposit_cap;
    }
    Ok(())
}
