// We're adding these
import * as web3 from '@solana/web3.js';
import * as fs from 'fs';
import dotenv from 'dotenv';
dotenv.config();


async function main() {
    const payer = initializeKeypair();
    const connection = new web3.Connection(web3.clusterApiUrl('devnet'));
    await connection.requestAirdrop(payer.publicKey, web3.LAMPORTS_PER_SOL*1);
    await sendSol(connection, 0.1*web3.LAMPORTS_PER_SOL, web3.Keypair.generate().publicKey, payer)
}

function initializeKeypair(): web3.Keypair {
    const secret = JSON.parse(process.env.PRIVATE_KEY ?? "") as number[];
    const secretKey = Uint8Array.from(secret);
    const keypairFromSecretKey = web3.Keypair.fromSecretKey(secretKey);
    return keypairFromSecretKey;
}

async function sendSol(connection: web3.Connection, amount: number, to: web3.PublicKey, sender: web3.Keypair) {
    const transaction = new web3.Transaction()

    const sendSolInstruction = web3.SystemProgram.transfer(
        {
            fromPubkey: sender.publicKey,
            toPubkey: to, 
            lamports: amount,
        }
    )

    transaction.add(sendSolInstruction)

    const sig = await web3.sendAndConfirmTransaction(connection, transaction, [sender])
    console.log(`You can view your transaction on the Solana Explorer at:\nhttps://explorer.solana.com/tx/${sig}?cluster=devnet`);
}

main().then(() => {
    console.log("Finished successfully")
}).catch((error) => {
    console.error(error);
})

// const PROGRAM_ID = new web3.PublicKey("ChT1B39WKLS8qUrkLvFDXMhEJ4F1XZzwUNHUt4AU9aVa")
// const PROGRAM_DATA_PUBLIC_KEY = new web3.PublicKey("Ah9K7dQ8EHaZqcAsgBW8w37yN2eAy3koFmUn4x3CJtod")

// async function main() {
//     const connection = new web3.Connection(web3.clusterApiUrl('devnet'));
//     const signer1 = await initializeKeypair(connection);
//     const signer2 = await initializeKeypair(connection);
  
//     console.log("Public key:", signer1.publicKey.toBase58());
//     console.log("Public key:", signer2.publicKey.toBase58());

//     // await pingProgram(connection, signer)
//   }

// main()
//     .then(() => {
//         console.log("Finished successfully")
//         process.exit(0)
//     })
//     .catch((error) => {
//         console.log(error)
//         process.exit(1)
//     })


// async function initializeKeypair(
//     connection: web3.Connection
// ): Promise<web3.Keypair> {
//     if (!process.env.PRIVATE_KEY) {
//         console.log('Generating new keypair... 🗝️');
//         const signer = web3.Keypair.generate();
//         await airdropSolIfNeeded(signer, connection);
//         console.log('Creating .env file');
//         fs.writeFileSync('.env', `PRIVATE_KEY=[${signer.secretKey.toString()}]`);

//         return signer;
//     }

//     const secret = JSON.parse(process.env.PRIVATE_KEY ?? '') as number[];
//     const secretKey = Uint8Array.from(secret);
//     const keypairFromSecret = web3.Keypair.fromSecretKey(secretKey);
//     await airdropSolIfNeeded(keypairFromSecret, connection);
//     return keypairFromSecret;
// }


// async function airdropSolIfNeeded(
//     signer: web3.Keypair,
//     connection: web3.Connection
// ) {
//     const balance = await connection.getBalance(signer.publicKey);
//     console.log('Current balance is ', balance / web3.LAMPORTS_PER_SOL, 'SOL');

//     if (balance / web3.LAMPORTS_PER_SOL < 1) {
//         console.log('Airdropping 1 SOL');
//         const airdropSignature = await connection.requestAirdrop(
//             signer.publicKey,
//             web3.LAMPORTS_PER_SOL
//         );

//         const latestBlockhash = await connection.getLatestBlockhash();

//         await connection.confirmTransaction({
//             blockhash: latestBlockhash.blockhash,
//             lastValidBlockHeight: latestBlockhash.lastValidBlockHeight,
//             signature: airdropSignature
//         });

//         const newBalance = await connection.getBalance(signer.publicKey);
//         console.log('New balance is ', newBalance / web3.LAMPORTS_PER_SOL, 'SOL');
//     }
// }

// async function pingProgram(
//     connection: web3.Connection,
//     payer: web3.Keypair) {
//         const transaction = new web3.Transaction();
//         const instruction = new web3.TransactionInstruction({
//             keys: [
//                 {
//                 pubkey: PROGRAM_DATA_PUBLIC_KEY,
//                 isSigner: false,
//                 isWritable: true
//             }
//             ],
//             programId: PROGRAM_ID
//         })

//         transaction.add(instruction)
//         const transactionSignature = await web3.sendAndConfirmTransaction(
//             connection, transaction, [payer]
//         )

//         console.log(
//             `Transaction https://explorer.solana.com/tx/${transactionSignature}?cluster=devnet`
//         )
//     }