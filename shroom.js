
// const { Connection, PublicKey, PublicKey.toBuffer } = require("@solana/web3.js");
const web3 = require("@solana/web3.js");
const connection = new web3.Connection("https://api.mainnet-beta.solana.com");
const anchor = require('@project-serum/anchor')
const idl = JSON.parse(require('fs').readFileSync('idl.json', 'utf8'));
const metaplex = require("@metaplex/js");
const {metadata: { MetadataData }} = metaplex.programs;
const METAPLEX_PROGRAM_ID = new anchor.web3.PublicKey("metaqbxxUerdq28cj1RbAWkYQm3ybzjb6a8bt518x1s");
let programId = new anchor.web3.PublicKey("GGYjKF1LBpqL37qcSetisYj8yQJf4kdQgoGPW7Po6P56");
const key = anchor.web3.Keypair.generate();
const opts = {
  preflightCommitment: "processed"
}
const wallet = new metaplex.NodeWallet(key);
const provider = new anchor.Provider(connection, wallet, opts.preflightCommitment);
const program = new anchor.Program(idl, programId, provider);

var symbol = process.argv.slice(2)[0];

async function getMetadataPDA(id) {
    let [key, bump] = await anchor.web3.PublicKey.findProgramAddress(
      [Buffer.from("metadata"),
      METAPLEX_PROGRAM_ID.toBuffer(),
      id.toBuffer()], 
      METAPLEX_PROGRAM_ID
    );
    return key;
} 
async function getMetadata(accounts) {
    const metadataAddresses = await Promise.all(accounts.map(a => getMetadataPDA(a.account.nftKey)));
    const metadataAccountInfos = await provider.connection.getMultipleAccountsInfo(metadataAddresses);

    return metadataAccountInfos.map((m, index) => 
      [accounts[index], 
      m?.data !== undefined ? MetadataData.deserialize(m?.data) : undefined]);
}

async function printStakedUsers() {
  let accounts = await program.account.shroomPairAccount.all();
  accounts = accounts.filter(a => a.account.timestamp > 0)

  let metadatas = await getMetadata(accounts);
  users = metadatas.filter(a => a[1].data.symbol === symbol.toString()).map(a => a[0].account.userKey.toString());
  let uniqueUsers = [...new Set(users)];
  console.log("Users staking", symbol, ":", uniqueUsers.length);
  uniqueUsers.forEach(u => console.log(u));
}


printStakedUsers();




