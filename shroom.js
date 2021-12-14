
// const { Connection, PublicKey, PublicKey.toBuffer } = require("@solana/web3.js");
const web3 = require("@solana/web3.js");
const connection = new web3.Connection("https://api.mainnet-beta.solana.com");
const anchor = require('@project-serum/anchor')
const metaplex = require("@metaplex/js");
const idl = JSON.parse(require('fs').readFileSync('idl.json', 'utf8'));

let programId = new anchor.web3.PublicKey("GGYjKF1LBpqL37qcSetisYj8yQJf4kdQgoGPW7Po6P56");

const key = anchor.web3.Keypair.generate();
const opts = {
  preflightCommitment: "processed"
}
const wallet = new metaplex.NodeWallet(key);
const provider = new anchor.Provider(connection, wallet, opts.preflightCommitment);
const program = new anchor.Program(idl, programId, provider);

// var args = process.argv.slice(2);

// async function getUserAccountPDA() {
//     let userKey = new anchor.web3.PublicKey(args[0]);
//     let [key, bump] = await web3.PublicKey.findProgramAddress(
//       [userKey.toBuffer(), Buffer.from("1")],
//       programId
//     );
//     return [key, bump];
//   }

async function printUserAccount() {
	// let pda = await getUserAccountPDA();
  //let account = await connection.getParsedAccountInfo(pda[0], "processed");
	let accounts = await program.account.userAccount.all();
  accounts = accounts.filter(function(a){return a.account.stakedShroomz.length  > 0});
  accounts.forEach(account => {
      console.log(account.account.userKey.toString());
    })
	//printDetails("User Account", pda[0], account);jsonParsed
	// console.log("user accounts addresses: " + accounts.map());//JSON.stringify(account.value));
}


printUserAccount();