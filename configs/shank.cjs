const path = require("path");
const { generateIdl } = require("@metaplex-foundation/shank-js");

const idlDir = path.join(__dirname, "..", "idls");
const binaryInstallDir = path.join(__dirname, "..", ".crates");
const programDir = path.join(__dirname, "..", "programs");

generateIdl({
  generator: "anchor",
  programName: "sold_issuance",
  programId: "Ev4vixMJX6Czywj7TSjnmBapdoYmZkpVwU3cpT2akgYG",
  idlDir,
  binaryInstallDir,
  programDir: path.join(programDir, "sold-issuance"),
  rustbin: { locked: true },
});

generateIdl({
  generator: "anchor",
  programName: "sold_staking",
  programId: "9PEGJqYZCKBWvX6X652MCKJkT7WthKYo3ypYqyVV8dJ5",
  idlDir,
  binaryInstallDir,
  programDir: path.join(programDir, "sold-staking"),
  rustbin: { locked: true },
});
