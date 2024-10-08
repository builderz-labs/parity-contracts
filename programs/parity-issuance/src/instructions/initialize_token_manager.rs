use crate::{ParityIssuanceError, TokenManager, TOKEN_MANAGER_SIZE};
use anchor_lang::prelude::*;
use anchor_spl::{
    associated_token::AssociatedToken,
    metadata::{
        create_metadata_accounts_v3, mpl_token_metadata::types::DataV2, CreateMetadataAccountsV3,
        Metadata as Metaplex,
    },
    token::{Mint, Token, TokenAccount},
};

#[derive(AnchorSerialize, AnchorDeserialize, Debug, Clone)]
pub struct InitializeTokenManagerParams {
    pub name: String,
    pub symbol: String,
    pub uri: String,
    pub decimals: u8,
    pub exchange_rate: u64,
    pub emergency_fund_basis_points: u16,
    pub merkle_root: [u8; 32],
    pub admin: Pubkey,
    pub minter: Pubkey,
    pub limit_per_slot: u64,
    pub withdraw_time_lock: i64,
    pub withdraw_execution_window: i64,
    pub mint_fee_bps: u16,
    pub redeem_fee_bps: u16,
}

impl InitializeTokenManagerParams {
    pub fn validate(&self) -> Result<()> {
        // Validate name and symbol are not empty
        if self.name.is_empty() {
            return err!(ParityIssuanceError::InvalidParam);
        }
        if self.symbol.is_empty() {
            return err!(ParityIssuanceError::InvalidParam);
        }

        // Validate decimals are within a valid range
        if self.decimals > 18 {
            return err!(ParityIssuanceError::InvalidParam);
        }

        // Validate exchange rate is non-zero
        if self.exchange_rate == 0 {
            return err!(ParityIssuanceError::InvalidParam);
        }

        // Validate admin and minter are valid public keys
        if self.admin == Pubkey::default() {
            return err!(ParityIssuanceError::InvalidParam);
        }
        if self.minter == Pubkey::default() {
            return err!(ParityIssuanceError::InvalidParam);
        }

        // Validate emergency fund basis points are within bounds
        if self.emergency_fund_basis_points > 10000 {
            return err!(ParityIssuanceError::InvalidParam);
        }

        // Validate withdraw time lock and execution window are non-negative
        if self.withdraw_time_lock < 0 {
            return err!(ParityIssuanceError::InvalidParam);
        }
        if self.withdraw_execution_window < 0 {
            return err!(ParityIssuanceError::InvalidParam);
        }

        // Validate limit per slot is non-zero
        if self.limit_per_slot == 0 {
            return err!(ParityIssuanceError::InvalidParam);
        }

        // Validate mint and redeem fees are within bounds
        if self.mint_fee_bps > 10000 || self.redeem_fee_bps > 10000 {
            return err!(ParityIssuanceError::InvalidParam);
        }

        Ok(())
    }
}

#[derive(Accounts)]
#[instruction(
    params: InitializeTokenManagerParams
)]
pub struct InitializeTokenManager<'info> {
    #[account(
        init,
        payer = owner,
        space = TOKEN_MANAGER_SIZE,
        seeds = [b"token-manager"],
        bump,
    )]
    pub token_manager: Box<Account<'info, TokenManager>>,
    #[account(
        init,
        payer = owner,
        associated_token::mint = quote_mint,
        associated_token::authority = token_manager,
    )]
    pub vault: Account<'info, TokenAccount>,
    /// CHECK: New Metaplex Account being created
    #[account(mut)]
    pub metadata: UncheckedAccount<'info>,
    #[account(
        init,
        seeds = [b"mint"],
        bump,
        payer = owner,
        mint::decimals = params.decimals,
        mint::authority = token_manager,
    )]
    pub mint: Account<'info, Mint>,
    pub quote_mint: Account<'info, Mint>,
    #[account(mut)]
    pub owner: Signer<'info>,
    pub rent: Sysvar<'info, Rent>,
    pub system_program: Program<'info, System>,
    pub token_program: Program<'info, Token>,
    pub token_metadata_program: Program<'info, Metaplex>,
    pub associated_token_program: Program<'info, AssociatedToken>,
}

pub fn handler(
    ctx: Context<InitializeTokenManager>,
    params: InitializeTokenManagerParams,
) -> Result<()> {
    // Validate parameters
    params.validate()?;

    let token_manager = &mut ctx.accounts.token_manager;

    let bump = ctx.bumps.token_manager; // Corrected to be a slice of a slice of a byte slice
    let signer_seeds: &[&[&[u8]]] = &[&[b"token-manager", &[bump]]];

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
            update_authority: token_manager.to_account_info(),
            mint: ctx.accounts.mint.to_account_info(),
            metadata: ctx.accounts.metadata.to_account_info(),
            mint_authority: token_manager.to_account_info(),
            system_program: ctx.accounts.system_program.to_account_info(),
            rent: ctx.accounts.rent.to_account_info(),
        },
        &signer_seeds,
    );

    create_metadata_accounts_v3(metadata_ctx, token_data, true, true, None)?;

    msg!("Token mint created successfully.");

    let token_manager = &mut ctx.accounts.token_manager;

    token_manager.bump = bump;

    // Authorities
    token_manager.owner = ctx.accounts.owner.key();
    token_manager.pending_owner = Pubkey::default();
    token_manager.admin = params.admin;
    token_manager.minter = params.minter;
    token_manager.merkle_root = params.merkle_root;
    token_manager.is_whitelist_enabled = true;

    // Token
    token_manager.mint = ctx.accounts.mint.key();
    token_manager.mint_decimals = ctx.accounts.mint.decimals;
    token_manager.quote_mint = ctx.accounts.quote_mint.key();
    token_manager.quote_mint_decimals = ctx.accounts.quote_mint.decimals;
    token_manager.exchange_rate = params.exchange_rate;
    // Other
    token_manager.total_collateral = 0;
    token_manager.emergency_fund_basis_points = params.emergency_fund_basis_points;
    token_manager.active = true;

    // Per Block limit
    let clock = Clock::get()?;
    let current_slot = clock.slot;
    token_manager.current_slot = current_slot;
    token_manager.current_slot_volume = 0;
    token_manager.limit_per_slot = params.limit_per_slot;

    token_manager.pending_withdrawal_amount = 0;
    token_manager.withdrawal_initiation_time = 0;
    token_manager.withdraw_time_lock = params.withdraw_time_lock;
    token_manager.withdraw_execution_window = params.withdraw_execution_window;

    token_manager.mint_fee_bps = params.mint_fee_bps;
    token_manager.redeem_fee_bps = params.redeem_fee_bps;

    Ok(())
}
