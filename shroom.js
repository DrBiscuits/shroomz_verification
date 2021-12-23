
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

var args = process.argv.slice(2);

async function getMetadataPDA(id) {
    let [key, bump] = await anchor.web3.PublicKey.findProgramAddress(
      [Buffer.from("metadata"),
      METAPLEX_PROGRAM_ID.toBuffer(),
      id.toBuffer()], 
      METAPLEX_PROGRAM_ID
    );
    return key;
} 
async function getMetadata(tokenAddresses) {
    const metadataAddresses = await Promise.all(tokenAddresses.map(key => getMetadataPDA(key)));
    const metadataAccountInfos = await provider.connection.getMultipleAccountsInfo(metadataAddresses);

    return metadataAccountInfos.map(m => 
      m?.data !== undefined ? MetadataData.deserialize(metadataAccountInfo?.data) : undefined);
}

async function printAllStakedPairs() {
  let accounts = await program.account.shroomPairAccount.all();
  // accounts.forEach(a => console.log(a.account.userKey));
  let metadatas = await getMetadata(accounts.map(a => a.account.nftKey));
  //accounts.filter(a => a.account.timestamp > 0).forEach(a => console.log(a));
}


printAllStakedPairs();




