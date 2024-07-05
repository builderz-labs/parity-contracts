//! This code was AUTOGENERATED using the kinobi library.
//! Please DO NOT EDIT THIS FILE, instead use visitors
//! to add features, then rerun kinobi to update it.
//!
//! [https://github.com/metaplex-foundation/kinobi]
//!

#[cfg(feature = "anchor")]
use anchor_lang::prelude::{AnchorDeserialize, AnchorSerialize};
#[cfg(not(feature = "anchor"))]
use borsh::{BorshDeserialize, BorshSerialize};

/// Accounts.
pub struct Mint {
    pub token_manager: solana_program::pubkey::Pubkey,

    pub mint: solana_program::pubkey::Pubkey,

    pub payer_mint_ata: solana_program::pubkey::Pubkey,

    pub quote_mint: solana_program::pubkey::Pubkey,

    pub payer_quote_mint_ata: solana_program::pubkey::Pubkey,

    pub vault: solana_program::pubkey::Pubkey,

    pub price_update: solana_program::pubkey::Pubkey,

    pub payer: solana_program::pubkey::Pubkey,

    pub system_program: solana_program::pubkey::Pubkey,

    pub token_program: solana_program::pubkey::Pubkey,

    pub associated_token_program: solana_program::pubkey::Pubkey,
}

impl Mint {
    pub fn instruction(
        &self,
        args: MintInstructionArgs,
    ) -> solana_program::instruction::Instruction {
        self.instruction_with_remaining_accounts(args, &[])
    }
    #[allow(clippy::vec_init_then_push)]
    pub fn instruction_with_remaining_accounts(
        &self,
        args: MintInstructionArgs,
        remaining_accounts: &[solana_program::instruction::AccountMeta],
    ) -> solana_program::instruction::Instruction {
        let mut accounts = Vec::with_capacity(11 + remaining_accounts.len());
        accounts.push(solana_program::instruction::AccountMeta::new(
            self.token_manager,
            false,
        ));
        accounts.push(solana_program::instruction::AccountMeta::new(
            self.mint, false,
        ));
        accounts.push(solana_program::instruction::AccountMeta::new(
            self.payer_mint_ata,
            false,
        ));
        accounts.push(solana_program::instruction::AccountMeta::new_readonly(
            self.quote_mint,
            false,
        ));
        accounts.push(solana_program::instruction::AccountMeta::new(
            self.payer_quote_mint_ata,
            false,
        ));
        accounts.push(solana_program::instruction::AccountMeta::new(
            self.vault, false,
        ));
        accounts.push(solana_program::instruction::AccountMeta::new_readonly(
            self.price_update,
            false,
        ));
        accounts.push(solana_program::instruction::AccountMeta::new(
            self.payer, true,
        ));
        accounts.push(solana_program::instruction::AccountMeta::new_readonly(
            self.system_program,
            false,
        ));
        accounts.push(solana_program::instruction::AccountMeta::new_readonly(
            self.token_program,
            false,
        ));
        accounts.push(solana_program::instruction::AccountMeta::new_readonly(
            self.associated_token_program,
            false,
        ));
        accounts.extend_from_slice(remaining_accounts);
        let mut data = MintInstructionData::new().try_to_vec().unwrap();
        let mut args = args.try_to_vec().unwrap();
        data.append(&mut args);

        solana_program::instruction::Instruction {
            program_id: crate::SOLD_ISSUANCE_ID,
            accounts,
            data,
        }
    }
}

#[cfg_attr(not(feature = "anchor"), derive(BorshSerialize, BorshDeserialize))]
#[cfg_attr(feature = "anchor", derive(AnchorSerialize, AnchorDeserialize))]
pub struct MintInstructionData {
    discriminator: [u8; 8],
}

impl MintInstructionData {
    pub fn new() -> Self {
        Self {
            discriminator: [51, 57, 225, 47, 182, 146, 137, 166],
        }
    }
}

#[cfg_attr(not(feature = "anchor"), derive(BorshSerialize, BorshDeserialize))]
#[cfg_attr(feature = "anchor", derive(AnchorSerialize, AnchorDeserialize))]
#[cfg_attr(feature = "serde", derive(serde::Serialize, serde::Deserialize))]
#[derive(Clone, Debug, Eq, PartialEq)]
pub struct MintInstructionArgs {
    pub quantity: u64,
    pub proof: Vec<[u8; 32]>,
}

/// Instruction builder for `Mint`.
///
/// ### Accounts:
///
///   0. `[writable]` token_manager
///   1. `[writable]` mint
///   2. `[writable]` payer_mint_ata
///   3. `[]` quote_mint
///   4. `[writable]` payer_quote_mint_ata
///   5. `[writable]` vault
///   6. `[]` price_update
///   7. `[writable, signer]` payer
///   8. `[optional]` system_program (default to `11111111111111111111111111111111`)
///   9. `[optional]` token_program (default to `TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA`)
///   10. `[]` associated_token_program
#[derive(Default)]
pub struct MintBuilder {
    token_manager: Option<solana_program::pubkey::Pubkey>,
    mint: Option<solana_program::pubkey::Pubkey>,
    payer_mint_ata: Option<solana_program::pubkey::Pubkey>,
    quote_mint: Option<solana_program::pubkey::Pubkey>,
    payer_quote_mint_ata: Option<solana_program::pubkey::Pubkey>,
    vault: Option<solana_program::pubkey::Pubkey>,
    price_update: Option<solana_program::pubkey::Pubkey>,
    payer: Option<solana_program::pubkey::Pubkey>,
    system_program: Option<solana_program::pubkey::Pubkey>,
    token_program: Option<solana_program::pubkey::Pubkey>,
    associated_token_program: Option<solana_program::pubkey::Pubkey>,
    quantity: Option<u64>,
    proof: Option<Vec<[u8; 32]>>,
    __remaining_accounts: Vec<solana_program::instruction::AccountMeta>,
}

impl MintBuilder {
    pub fn new() -> Self {
        Self::default()
    }
    #[inline(always)]
    pub fn token_manager(&mut self, token_manager: solana_program::pubkey::Pubkey) -> &mut Self {
        self.token_manager = Some(token_manager);
        self
    }
    #[inline(always)]
    pub fn mint(&mut self, mint: solana_program::pubkey::Pubkey) -> &mut Self {
        self.mint = Some(mint);
        self
    }
    #[inline(always)]
    pub fn payer_mint_ata(&mut self, payer_mint_ata: solana_program::pubkey::Pubkey) -> &mut Self {
        self.payer_mint_ata = Some(payer_mint_ata);
        self
    }
    #[inline(always)]
    pub fn quote_mint(&mut self, quote_mint: solana_program::pubkey::Pubkey) -> &mut Self {
        self.quote_mint = Some(quote_mint);
        self
    }
    #[inline(always)]
    pub fn payer_quote_mint_ata(
        &mut self,
        payer_quote_mint_ata: solana_program::pubkey::Pubkey,
    ) -> &mut Self {
        self.payer_quote_mint_ata = Some(payer_quote_mint_ata);
        self
    }
    #[inline(always)]
    pub fn vault(&mut self, vault: solana_program::pubkey::Pubkey) -> &mut Self {
        self.vault = Some(vault);
        self
    }
    #[inline(always)]
    pub fn price_update(&mut self, price_update: solana_program::pubkey::Pubkey) -> &mut Self {
        self.price_update = Some(price_update);
        self
    }
    #[inline(always)]
    pub fn payer(&mut self, payer: solana_program::pubkey::Pubkey) -> &mut Self {
        self.payer = Some(payer);
        self
    }
    /// `[optional account, default to '11111111111111111111111111111111']`
    #[inline(always)]
    pub fn system_program(&mut self, system_program: solana_program::pubkey::Pubkey) -> &mut Self {
        self.system_program = Some(system_program);
        self
    }
    /// `[optional account, default to 'TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA']`
    #[inline(always)]
    pub fn token_program(&mut self, token_program: solana_program::pubkey::Pubkey) -> &mut Self {
        self.token_program = Some(token_program);
        self
    }
    #[inline(always)]
    pub fn associated_token_program(
        &mut self,
        associated_token_program: solana_program::pubkey::Pubkey,
    ) -> &mut Self {
        self.associated_token_program = Some(associated_token_program);
        self
    }
    #[inline(always)]
    pub fn quantity(&mut self, quantity: u64) -> &mut Self {
        self.quantity = Some(quantity);
        self
    }
    #[inline(always)]
    pub fn proof(&mut self, proof: Vec<[u8; 32]>) -> &mut Self {
        self.proof = Some(proof);
        self
    }
    /// Add an aditional account to the instruction.
    #[inline(always)]
    pub fn add_remaining_account(
        &mut self,
        account: solana_program::instruction::AccountMeta,
    ) -> &mut Self {
        self.__remaining_accounts.push(account);
        self
    }
    /// Add additional accounts to the instruction.
    #[inline(always)]
    pub fn add_remaining_accounts(
        &mut self,
        accounts: &[solana_program::instruction::AccountMeta],
    ) -> &mut Self {
        self.__remaining_accounts.extend_from_slice(accounts);
        self
    }
    #[allow(clippy::clone_on_copy)]
    pub fn instruction(&self) -> solana_program::instruction::Instruction {
        let accounts = Mint {
            token_manager: self.token_manager.expect("token_manager is not set"),
            mint: self.mint.expect("mint is not set"),
            payer_mint_ata: self.payer_mint_ata.expect("payer_mint_ata is not set"),
            quote_mint: self.quote_mint.expect("quote_mint is not set"),
            payer_quote_mint_ata: self
                .payer_quote_mint_ata
                .expect("payer_quote_mint_ata is not set"),
            vault: self.vault.expect("vault is not set"),
            price_update: self.price_update.expect("price_update is not set"),
            payer: self.payer.expect("payer is not set"),
            system_program: self
                .system_program
                .unwrap_or(solana_program::pubkey!("11111111111111111111111111111111")),
            token_program: self.token_program.unwrap_or(solana_program::pubkey!(
                "TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA"
            )),
            associated_token_program: self
                .associated_token_program
                .expect("associated_token_program is not set"),
        };
        let args = MintInstructionArgs {
            quantity: self.quantity.clone().expect("quantity is not set"),
            proof: self.proof.clone().expect("proof is not set"),
        };

        accounts.instruction_with_remaining_accounts(args, &self.__remaining_accounts)
    }
}

/// `mint` CPI accounts.
pub struct MintCpiAccounts<'a, 'b> {
    pub token_manager: &'b solana_program::account_info::AccountInfo<'a>,

    pub mint: &'b solana_program::account_info::AccountInfo<'a>,

    pub payer_mint_ata: &'b solana_program::account_info::AccountInfo<'a>,

    pub quote_mint: &'b solana_program::account_info::AccountInfo<'a>,

    pub payer_quote_mint_ata: &'b solana_program::account_info::AccountInfo<'a>,

    pub vault: &'b solana_program::account_info::AccountInfo<'a>,

    pub price_update: &'b solana_program::account_info::AccountInfo<'a>,

    pub payer: &'b solana_program::account_info::AccountInfo<'a>,

    pub system_program: &'b solana_program::account_info::AccountInfo<'a>,

    pub token_program: &'b solana_program::account_info::AccountInfo<'a>,

    pub associated_token_program: &'b solana_program::account_info::AccountInfo<'a>,
}

/// `mint` CPI instruction.
pub struct MintCpi<'a, 'b> {
    /// The program to invoke.
    pub __program: &'b solana_program::account_info::AccountInfo<'a>,

    pub token_manager: &'b solana_program::account_info::AccountInfo<'a>,

    pub mint: &'b solana_program::account_info::AccountInfo<'a>,

    pub payer_mint_ata: &'b solana_program::account_info::AccountInfo<'a>,

    pub quote_mint: &'b solana_program::account_info::AccountInfo<'a>,

    pub payer_quote_mint_ata: &'b solana_program::account_info::AccountInfo<'a>,

    pub vault: &'b solana_program::account_info::AccountInfo<'a>,

    pub price_update: &'b solana_program::account_info::AccountInfo<'a>,

    pub payer: &'b solana_program::account_info::AccountInfo<'a>,

    pub system_program: &'b solana_program::account_info::AccountInfo<'a>,

    pub token_program: &'b solana_program::account_info::AccountInfo<'a>,

    pub associated_token_program: &'b solana_program::account_info::AccountInfo<'a>,
    /// The arguments for the instruction.
    pub __args: MintInstructionArgs,
}

impl<'a, 'b> MintCpi<'a, 'b> {
    pub fn new(
        program: &'b solana_program::account_info::AccountInfo<'a>,
        accounts: MintCpiAccounts<'a, 'b>,
        args: MintInstructionArgs,
    ) -> Self {
        Self {
            __program: program,
            token_manager: accounts.token_manager,
            mint: accounts.mint,
            payer_mint_ata: accounts.payer_mint_ata,
            quote_mint: accounts.quote_mint,
            payer_quote_mint_ata: accounts.payer_quote_mint_ata,
            vault: accounts.vault,
            price_update: accounts.price_update,
            payer: accounts.payer,
            system_program: accounts.system_program,
            token_program: accounts.token_program,
            associated_token_program: accounts.associated_token_program,
            __args: args,
        }
    }
    #[inline(always)]
    pub fn invoke(&self) -> solana_program::entrypoint::ProgramResult {
        self.invoke_signed_with_remaining_accounts(&[], &[])
    }
    #[inline(always)]
    pub fn invoke_with_remaining_accounts(
        &self,
        remaining_accounts: &[(
            &'b solana_program::account_info::AccountInfo<'a>,
            bool,
            bool,
        )],
    ) -> solana_program::entrypoint::ProgramResult {
        self.invoke_signed_with_remaining_accounts(&[], remaining_accounts)
    }
    #[inline(always)]
    pub fn invoke_signed(
        &self,
        signers_seeds: &[&[&[u8]]],
    ) -> solana_program::entrypoint::ProgramResult {
        self.invoke_signed_with_remaining_accounts(signers_seeds, &[])
    }
    #[allow(clippy::clone_on_copy)]
    #[allow(clippy::vec_init_then_push)]
    pub fn invoke_signed_with_remaining_accounts(
        &self,
        signers_seeds: &[&[&[u8]]],
        remaining_accounts: &[(
            &'b solana_program::account_info::AccountInfo<'a>,
            bool,
            bool,
        )],
    ) -> solana_program::entrypoint::ProgramResult {
        let mut accounts = Vec::with_capacity(11 + remaining_accounts.len());
        accounts.push(solana_program::instruction::AccountMeta::new(
            *self.token_manager.key,
            false,
        ));
        accounts.push(solana_program::instruction::AccountMeta::new(
            *self.mint.key,
            false,
        ));
        accounts.push(solana_program::instruction::AccountMeta::new(
            *self.payer_mint_ata.key,
            false,
        ));
        accounts.push(solana_program::instruction::AccountMeta::new_readonly(
            *self.quote_mint.key,
            false,
        ));
        accounts.push(solana_program::instruction::AccountMeta::new(
            *self.payer_quote_mint_ata.key,
            false,
        ));
        accounts.push(solana_program::instruction::AccountMeta::new(
            *self.vault.key,
            false,
        ));
        accounts.push(solana_program::instruction::AccountMeta::new_readonly(
            *self.price_update.key,
            false,
        ));
        accounts.push(solana_program::instruction::AccountMeta::new(
            *self.payer.key,
            true,
        ));
        accounts.push(solana_program::instruction::AccountMeta::new_readonly(
            *self.system_program.key,
            false,
        ));
        accounts.push(solana_program::instruction::AccountMeta::new_readonly(
            *self.token_program.key,
            false,
        ));
        accounts.push(solana_program::instruction::AccountMeta::new_readonly(
            *self.associated_token_program.key,
            false,
        ));
        remaining_accounts.iter().for_each(|remaining_account| {
            accounts.push(solana_program::instruction::AccountMeta {
                pubkey: *remaining_account.0.key,
                is_signer: remaining_account.1,
                is_writable: remaining_account.2,
            })
        });
        let mut data = MintInstructionData::new().try_to_vec().unwrap();
        let mut args = self.__args.try_to_vec().unwrap();
        data.append(&mut args);

        let instruction = solana_program::instruction::Instruction {
            program_id: crate::SOLD_ISSUANCE_ID,
            accounts,
            data,
        };
        let mut account_infos = Vec::with_capacity(11 + 1 + remaining_accounts.len());
        account_infos.push(self.__program.clone());
        account_infos.push(self.token_manager.clone());
        account_infos.push(self.mint.clone());
        account_infos.push(self.payer_mint_ata.clone());
        account_infos.push(self.quote_mint.clone());
        account_infos.push(self.payer_quote_mint_ata.clone());
        account_infos.push(self.vault.clone());
        account_infos.push(self.price_update.clone());
        account_infos.push(self.payer.clone());
        account_infos.push(self.system_program.clone());
        account_infos.push(self.token_program.clone());
        account_infos.push(self.associated_token_program.clone());
        remaining_accounts
            .iter()
            .for_each(|remaining_account| account_infos.push(remaining_account.0.clone()));

        if signers_seeds.is_empty() {
            solana_program::program::invoke(&instruction, &account_infos)
        } else {
            solana_program::program::invoke_signed(&instruction, &account_infos, signers_seeds)
        }
    }
}

/// Instruction builder for `Mint` via CPI.
///
/// ### Accounts:
///
///   0. `[writable]` token_manager
///   1. `[writable]` mint
///   2. `[writable]` payer_mint_ata
///   3. `[]` quote_mint
///   4. `[writable]` payer_quote_mint_ata
///   5. `[writable]` vault
///   6. `[]` price_update
///   7. `[writable, signer]` payer
///   8. `[]` system_program
///   9. `[]` token_program
///   10. `[]` associated_token_program
pub struct MintCpiBuilder<'a, 'b> {
    instruction: Box<MintCpiBuilderInstruction<'a, 'b>>,
}

impl<'a, 'b> MintCpiBuilder<'a, 'b> {
    pub fn new(program: &'b solana_program::account_info::AccountInfo<'a>) -> Self {
        let instruction = Box::new(MintCpiBuilderInstruction {
            __program: program,
            token_manager: None,
            mint: None,
            payer_mint_ata: None,
            quote_mint: None,
            payer_quote_mint_ata: None,
            vault: None,
            price_update: None,
            payer: None,
            system_program: None,
            token_program: None,
            associated_token_program: None,
            quantity: None,
            proof: None,
            __remaining_accounts: Vec::new(),
        });
        Self { instruction }
    }
    #[inline(always)]
    pub fn token_manager(
        &mut self,
        token_manager: &'b solana_program::account_info::AccountInfo<'a>,
    ) -> &mut Self {
        self.instruction.token_manager = Some(token_manager);
        self
    }
    #[inline(always)]
    pub fn mint(&mut self, mint: &'b solana_program::account_info::AccountInfo<'a>) -> &mut Self {
        self.instruction.mint = Some(mint);
        self
    }
    #[inline(always)]
    pub fn payer_mint_ata(
        &mut self,
        payer_mint_ata: &'b solana_program::account_info::AccountInfo<'a>,
    ) -> &mut Self {
        self.instruction.payer_mint_ata = Some(payer_mint_ata);
        self
    }
    #[inline(always)]
    pub fn quote_mint(
        &mut self,
        quote_mint: &'b solana_program::account_info::AccountInfo<'a>,
    ) -> &mut Self {
        self.instruction.quote_mint = Some(quote_mint);
        self
    }
    #[inline(always)]
    pub fn payer_quote_mint_ata(
        &mut self,
        payer_quote_mint_ata: &'b solana_program::account_info::AccountInfo<'a>,
    ) -> &mut Self {
        self.instruction.payer_quote_mint_ata = Some(payer_quote_mint_ata);
        self
    }
    #[inline(always)]
    pub fn vault(&mut self, vault: &'b solana_program::account_info::AccountInfo<'a>) -> &mut Self {
        self.instruction.vault = Some(vault);
        self
    }
    #[inline(always)]
    pub fn price_update(
        &mut self,
        price_update: &'b solana_program::account_info::AccountInfo<'a>,
    ) -> &mut Self {
        self.instruction.price_update = Some(price_update);
        self
    }
    #[inline(always)]
    pub fn payer(&mut self, payer: &'b solana_program::account_info::AccountInfo<'a>) -> &mut Self {
        self.instruction.payer = Some(payer);
        self
    }
    #[inline(always)]
    pub fn system_program(
        &mut self,
        system_program: &'b solana_program::account_info::AccountInfo<'a>,
    ) -> &mut Self {
        self.instruction.system_program = Some(system_program);
        self
    }
    #[inline(always)]
    pub fn token_program(
        &mut self,
        token_program: &'b solana_program::account_info::AccountInfo<'a>,
    ) -> &mut Self {
        self.instruction.token_program = Some(token_program);
        self
    }
    #[inline(always)]
    pub fn associated_token_program(
        &mut self,
        associated_token_program: &'b solana_program::account_info::AccountInfo<'a>,
    ) -> &mut Self {
        self.instruction.associated_token_program = Some(associated_token_program);
        self
    }
    #[inline(always)]
    pub fn quantity(&mut self, quantity: u64) -> &mut Self {
        self.instruction.quantity = Some(quantity);
        self
    }
    #[inline(always)]
    pub fn proof(&mut self, proof: Vec<[u8; 32]>) -> &mut Self {
        self.instruction.proof = Some(proof);
        self
    }
    /// Add an additional account to the instruction.
    #[inline(always)]
    pub fn add_remaining_account(
        &mut self,
        account: &'b solana_program::account_info::AccountInfo<'a>,
        is_writable: bool,
        is_signer: bool,
    ) -> &mut Self {
        self.instruction
            .__remaining_accounts
            .push((account, is_writable, is_signer));
        self
    }
    /// Add additional accounts to the instruction.
    ///
    /// Each account is represented by a tuple of the `AccountInfo`, a `bool` indicating whether the account is writable or not,
    /// and a `bool` indicating whether the account is a signer or not.
    #[inline(always)]
    pub fn add_remaining_accounts(
        &mut self,
        accounts: &[(
            &'b solana_program::account_info::AccountInfo<'a>,
            bool,
            bool,
        )],
    ) -> &mut Self {
        self.instruction
            .__remaining_accounts
            .extend_from_slice(accounts);
        self
    }
    #[inline(always)]
    pub fn invoke(&self) -> solana_program::entrypoint::ProgramResult {
        self.invoke_signed(&[])
    }
    #[allow(clippy::clone_on_copy)]
    #[allow(clippy::vec_init_then_push)]
    pub fn invoke_signed(
        &self,
        signers_seeds: &[&[&[u8]]],
    ) -> solana_program::entrypoint::ProgramResult {
        let args = MintInstructionArgs {
            quantity: self
                .instruction
                .quantity
                .clone()
                .expect("quantity is not set"),
            proof: self.instruction.proof.clone().expect("proof is not set"),
        };
        let instruction = MintCpi {
            __program: self.instruction.__program,

            token_manager: self
                .instruction
                .token_manager
                .expect("token_manager is not set"),

            mint: self.instruction.mint.expect("mint is not set"),

            payer_mint_ata: self
                .instruction
                .payer_mint_ata
                .expect("payer_mint_ata is not set"),

            quote_mint: self.instruction.quote_mint.expect("quote_mint is not set"),

            payer_quote_mint_ata: self
                .instruction
                .payer_quote_mint_ata
                .expect("payer_quote_mint_ata is not set"),

            vault: self.instruction.vault.expect("vault is not set"),

            price_update: self
                .instruction
                .price_update
                .expect("price_update is not set"),

            payer: self.instruction.payer.expect("payer is not set"),

            system_program: self
                .instruction
                .system_program
                .expect("system_program is not set"),

            token_program: self
                .instruction
                .token_program
                .expect("token_program is not set"),

            associated_token_program: self
                .instruction
                .associated_token_program
                .expect("associated_token_program is not set"),
            __args: args,
        };
        instruction.invoke_signed_with_remaining_accounts(
            signers_seeds,
            &self.instruction.__remaining_accounts,
        )
    }
}

struct MintCpiBuilderInstruction<'a, 'b> {
    __program: &'b solana_program::account_info::AccountInfo<'a>,
    token_manager: Option<&'b solana_program::account_info::AccountInfo<'a>>,
    mint: Option<&'b solana_program::account_info::AccountInfo<'a>>,
    payer_mint_ata: Option<&'b solana_program::account_info::AccountInfo<'a>>,
    quote_mint: Option<&'b solana_program::account_info::AccountInfo<'a>>,
    payer_quote_mint_ata: Option<&'b solana_program::account_info::AccountInfo<'a>>,
    vault: Option<&'b solana_program::account_info::AccountInfo<'a>>,
    price_update: Option<&'b solana_program::account_info::AccountInfo<'a>>,
    payer: Option<&'b solana_program::account_info::AccountInfo<'a>>,
    system_program: Option<&'b solana_program::account_info::AccountInfo<'a>>,
    token_program: Option<&'b solana_program::account_info::AccountInfo<'a>>,
    associated_token_program: Option<&'b solana_program::account_info::AccountInfo<'a>>,
    quantity: Option<u64>,
    proof: Option<Vec<[u8; 32]>>,
    /// Additional instruction accounts `(AccountInfo, is_writable, is_signer)`.
    __remaining_accounts: Vec<(
        &'b solana_program::account_info::AccountInfo<'a>,
        bool,
        bool,
    )>,
}
