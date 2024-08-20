use crate::{ExchangeRatePhase, GlobalConfig, UserStake, GLOBAL_CONFIG_LENGTH, USER_STAKE_LENGTH};
use anchor_lang::prelude::*;
use anchor_spl::{
    associated_token::AssociatedToken,
    token::{Mint, Token, TokenAccount},
};

#[derive(AnchorSerialize, AnchorDeserialize, Debug, Clone)]
pub struct InitializeGlobalConfigParams {
    pub admin: Pubkey,
    pub baseline_yield: u64,
    pub deposit_cap: u64,
    pub initial_exchange_rate: u64,
}

#[derive(Accounts)]
pub struct InitializeGlobalConfig<'info> {
    /// SPL Token Mint of the underlying token to be deposited for staking
    pub base_mint: Account<'info, Mint>,
    #[account(
        init,
        seeds = [b"global-config"],
        bump,
        payer = user,
        space = GLOBAL_CONFIG_LENGTH,
    )]
    pub global_config: Box<Account<'info, GlobalConfig>>,

    #[account(
        init,
        seeds = [b"user-stake"],
        bump,
        payer = user,
        space = USER_STAKE_LENGTH,
    )]
    pub user_stake: Box<Account<'info, UserStake>>,

    #[account(
        init,
        payer = user,
        associated_token::mint = base_mint,
        associated_token::authority = global_config,
    )]
    pub vault: Account<'info, TokenAccount>,

    #[account(mut)]
    pub user: Signer<'info>,
    pub system_program: Program<'info, System>,
    pub token_program: Program<'info, Token>,
    pub associated_token_program: Program<'info, AssociatedToken>,
}

pub fn handler(
    ctx: Context<InitializeGlobalConfig>,
    params: InitializeGlobalConfigParams,
) -> Result<()> {
    let global_config = &mut ctx.accounts.global_config;
    let user_stake = &mut ctx.accounts.user_stake;
    let bump = ctx.bumps.global_config;

    // Authorities
    global_config.owner = ctx.accounts.user.key();
    global_config.admin = params.admin;
    global_config.bump = bump;

    //Token
    global_config.base_mint = ctx.accounts.base_mint.key();
    global_config.base_mint_decimals = ctx.accounts.base_mint.decimals;
    global_config.staking_vault = ctx.accounts.vault.key();

    //Other
    global_config.baseline_yield = params.baseline_yield;
    global_config.staked_supply = 0;
    global_config.total_points_issued = 0;
    global_config.deposit_cap = params.deposit_cap;

    //Histories
    //Initialize the exchange rate history with the initial exchange rate
    let initial_phase = ExchangeRatePhase {
        exchange_rate: params.initial_exchange_rate,
        start_date: Clock::get()?.unix_timestamp, // Current timestamp
        end_date: None,
        index: 0,
    };
    global_config.exchange_rate_history = vec![initial_phase];
    global_config.points_history = Vec::new();

    //UserStake PDA
    user_stake.user_pubkey = ctx.accounts.user.key();
    user_stake.staked_amount = 0;
    user_stake.staking_timestamp = 0;
    user_stake.last_claim_timestamp = 0;
    user_stake.points_history = Vec::new();

    Ok(())
}
