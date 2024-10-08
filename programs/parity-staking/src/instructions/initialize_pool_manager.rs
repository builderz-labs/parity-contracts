use anchor_lang::prelude::*;

use anchor_spl::{
    associated_token::AssociatedToken,
    metadata::{
        create_metadata_accounts_v3, mpl_token_metadata::types::DataV2, CreateMetadataAccountsV3,
        Metadata as Metaplex,
    },
    token::{Mint, Token, TokenAccount},
};

use crate::{ParityStakingError, PoolManager, MAX_INTERVAL_APR_RATE, POOL_MANAGER_LENGTH};

#[derive(AnchorSerialize, AnchorDeserialize, Debug, Clone)]
pub struct InitializePoolManagerParams {
    pub name: String,
    pub symbol: String,
    pub uri: String,
    pub decimals: u8,
    pub interval_apr_rate: u64,
    pub seconds_per_interval: i32,
    pub initial_exchange_rate: u64,
    pub admin: Pubkey,
    pub deposit_cap: u64,
}

impl InitializePoolManagerParams {
    pub fn validate(&self) -> Result<()> {
        // Validate name
        if self.name.is_empty() {
            return err!(ParityStakingError::InvalidParam); // Ensure name is not empty
        }

        // Validate symbol
        if self.symbol.is_empty() {
            return err!(ParityStakingError::InvalidParam); // Ensure symbol is not empty
        }

        // Validate URI
        if self.uri.is_empty() {
            return err!(ParityStakingError::InvalidParam); // Ensure URI is not empty
        }

        // Validate decimals
        if self.decimals > 18 {
            return err!(ParityStakingError::InvalidParam); // Ensure decimals are within valid range
        }

        // Validate initial exchange rate
        if self.initial_exchange_rate == 0 {
            return err!(ParityStakingError::InvalidParam); // Ensure initial exchange rate is non-zero
        }

        // Validate deposit cap
        if self.deposit_cap == 0 {
            return err!(ParityStakingError::InvalidParam); // Ensure deposit cap is non-zero
        }

        // Validate interval APR rate
        if self.interval_apr_rate == 0 {
            return err!(ParityStakingError::InvalidParam); // Ensure interval APR rate is non-zero
        }

        if self.interval_apr_rate > MAX_INTERVAL_APR_RATE {
            return err!(ParityStakingError::MaxIntervalAprRateExceeded); // Ensure interval APR rate does not exceed the maximum limit
        }

        // Validate seconds per interval
        if self.seconds_per_interval <= 0 {
            return err!(ParityStakingError::InvalidParam); // Ensure seconds per interval is positive
        }
        // Implement bounds check for seconds per interval
        if self.seconds_per_interval > 60 * 60 * 24 {
            return err!(ParityStakingError::InvalidParam); // Ensure seconds per interval is within reasonable bounds
        }

        Ok(())
    }
}

#[derive(Accounts)]
#[instruction(params: InitializePoolManagerParams)]
pub struct InitializePoolManager<'info> {
    /// SPL Token Mint of the underlying token to be deposited for staking
    pub base_mint: Account<'info, Mint>,
    #[account(
        init,
        seeds = [b"mint"],
        bump,
        payer = owner,
        mint::decimals = params.decimals,
        mint::authority = pool_manager,
    )]
    pub x_mint: Account<'info, Mint>,
    /// CHECK: Validate address by deriving pda
    #[account(
        mut,
        seeds = [b"metadata", token_metadata_program.key().as_ref(), x_mint.key().as_ref()],
        bump,
        seeds::program = token_metadata_program.key(),
    )]
    pub metadata: UncheckedAccount<'info>,
    #[account(
      init,
      seeds = [
        b"pool-manager",
      ],
      bump,
      payer = owner,
      space = POOL_MANAGER_LENGTH,
    )]
    pub pool_manager: Box<Account<'info, PoolManager>>,
    #[account(
        init,
        payer = owner,
        associated_token::mint = base_mint,
        associated_token::authority = pool_manager,
    )]
    pub vault: Account<'info, TokenAccount>,
    #[account(mut)]
    pub owner: Signer<'info>,
    pub rent: Sysvar<'info, Rent>,
    pub system_program: Program<'info, System>,
    pub token_program: Program<'info, Token>,
    pub token_metadata_program: Program<'info, Metaplex>,
    pub associated_token_program: Program<'info, AssociatedToken>,
}

pub fn handler(
    ctx: Context<InitializePoolManager>,
    params: InitializePoolManagerParams,
) -> Result<()> {
    // Validate the parameters
    params.validate()?;

    let pool_manager = &mut ctx.accounts.pool_manager;

    let bump = ctx.bumps.pool_manager;
    let signer_seeds: &[&[&[u8]]] = &[&[b"pool-manager", &[bump]]];

    let token_data: DataV2 = DataV2 {
        name: params.name,
        symbol: params.symbol,
        uri: params.uri,
        seller_fee_basis_points: 0,
        creators: None,
        collection: None,
        uses: None,
    };

    let metadata_ctx = CpiContext::new_with_signer(
        ctx.accounts.token_metadata_program.to_account_info(),
        CreateMetadataAccountsV3 {
            payer: ctx.accounts.owner.to_account_info(),
            update_authority: pool_manager.to_account_info(),
            mint: ctx.accounts.x_mint.to_account_info(),
            metadata: ctx.accounts.metadata.to_account_info(),
            mint_authority: pool_manager.to_account_info(),
            system_program: ctx.accounts.system_program.to_account_info(),
            rent: ctx.accounts.rent.to_account_info(),
        },
        &signer_seeds,
    );

    create_metadata_accounts_v3(metadata_ctx, token_data, true, true, None)?;

    msg!("Token mint created successfully.");

    let pool_manager = &mut ctx.accounts.pool_manager;

    // Authorities
    pool_manager.owner = ctx.accounts.owner.key();
    pool_manager.admin = params.admin;
    pool_manager.bump = bump;
    // Token
    pool_manager.base_mint = ctx.accounts.base_mint.key();
    pool_manager.base_mint_decimals = ctx.accounts.base_mint.decimals;
    pool_manager.x_mint = ctx.accounts.x_mint.key();
    pool_manager.x_mint_decimals = ctx.accounts.x_mint.decimals;
    pool_manager.initial_exchange_rate = params.initial_exchange_rate;
    // Other
    pool_manager.base_balance = 0;
    pool_manager.interval_apr_rate = params.interval_apr_rate;
    pool_manager.seconds_per_interval = params.seconds_per_interval;

    let clock = Clock::get()?;
    let current_timestamp = clock.unix_timestamp;
    pool_manager.inception_timestamp = current_timestamp;
    pool_manager.last_yield_change_timestamp = current_timestamp;
    pool_manager.last_yield_change_exchange_rate = params.initial_exchange_rate;
    pool_manager.deposit_cap = params.deposit_cap;

    Ok(())
}
