import {
  WalletDisconnectButton,
  WalletMultiButton,
} from "@solana/wallet-adapter-react-ui";
import { NextPage } from "next";
import Head from "next/head";
import Image from "next/image";
import styles from "../styles/Home.module.css";
import { useState, useEffect } from "react";
import { useConnection, useWallet } from "@solana/wallet-adapter-react";
import * as borsh from "borsh";
import {
  Connection,
  PublicKey,
  LAMPORTS_PER_SOL,
  Transaction,
  SystemProgram,
  TransactionInstruction,
} from "@solana/web3.js";
import {
  Alert,
  AlertIcon,
  AlertTitle,
  AlertDescription,
  Button,
  CloseButton,
  Grid,
  GridItem,
  Stat,
  StatLabel,
  StatNumber,
  StatHelpText,
  StatArrow,
  StatGroup,
  SimpleGrid,
  Box,
  Flex,
  Center,
  Square,
  Text,
  HStack,
} from "@chakra-ui/react";

const fetchBalance = async (
  conn: Connection,
  publicKey: PublicKey
): Promise<number> => {
  const balance = await conn.getBalance(publicKey);
  return balance;
};

const requestAirdrop = async (
  conn: Connection,
  publicKey: PublicKey
): Promise<string> => {
  try {
    const hash = await conn.requestAirdrop(publicKey, LAMPORTS_PER_SOL);
    await conn.confirmTransaction(hash);
    return hash;
  } catch (error) {
    let errorMessage = error instanceof Error ? error.message : "Unknown Error";
    throw error;
  }
};

const TestPubKey = new PublicKey(
  "Ce8tvZDapCXXvHNQkCDEDbutRpNz1DMHZb65FtAc7VAf"
);
const programAddr = "FxhNkRokQnQWNtCXazTtfevc3aHnmapDknQUw76sPfhM";
const programPubkey = new PublicKey(programAddr);
const storageAddr = "B5uaun3nrjYVgh5wTX5LHMxHJKQXXiZLfeXt2tunDrK1";
const storagePubkey = new PublicKey(storageAddr);
const GREETING_SEED = "hello";

// The state of a greeting account managed by the hello world program
class GreetingAccount {
  counter = 0;
  constructor(fields: { counter: number } | undefined = undefined) {
    if (fields) {
      this.counter = fields.counter;
    }
  }
}

// Borsh schema definition for greeting accounts
const GreetingSchema = new Map([
  [GreetingAccount, { kind: "struct", fields: [["counter", "u32"]] }],
]);

// The expected size of each greeting account.
const GREETING_SIZE = borsh.serialize(
  GreetingSchema,
  new GreetingAccount()
).length;

const Index: NextPage = () => {
  const [balance1, setBalance1] = useState<number | null>(null);
  const [balance2, setBalance2] = useState<number | null>(null);
  const { connection } = useConnection();
  const { publicKey, sendTransaction } = useWallet();

  const _fetchBalance = async () => {
    if (!publicKey) return;
    const balance1 = await connection.getBalance(publicKey);
    const balance2 = await connection.getBalance(TestPubKey);
    setBalance1(balance1 / LAMPORTS_PER_SOL);
    setBalance2(balance2 / LAMPORTS_PER_SOL);
  };

  const _airDrop = async () => {
    if (!publicKey) return;
    await requestAirdrop(connection, publicKey);
  };

  const _transfer = async () => {
    if (!publicKey) return;
    const tx = new Transaction().add(
      SystemProgram.transfer({
        fromPubkey: publicKey,
        toPubkey: TestPubKey,
        lamports: 2 * LAMPORTS_PER_SOL,
      })
    );
    const signature = await sendTransaction(tx, connection);
    await connection.confirmTransaction(signature, "processed");
    console.log("sent tx", signature);
  };

  const _accountInfo = async () => {
    const pubKey = new PublicKey(programAddr);
    const info = await connection.getAccountInfo(pubKey);
    console.log(info);
  };

  const _createGreeter = async () => {
    if (!publicKey) return;
    const programId = new PublicKey(programAddr);

    const greetedPubkey = await PublicKey.createWithSeed(
      publicKey,
      GREETING_SEED,
      programId
    );
    console.log("new pub key", greetedPubkey.toString(), greetedPubkey);

    const tx = new Transaction().add(
      SystemProgram.createAccountWithSeed({
        fromPubkey: publicKey,
        basePubkey: publicKey,
        seed: GREETING_SEED,
        newAccountPubkey: greetedPubkey,
        lamports: 1 * LAMPORTS_PER_SOL,
        space: GREETING_SIZE,
        programId,
      })
    );

    const signature = await sendTransaction(tx, connection);
    await connection.confirmTransaction(signature, "processed");
    console.log("sent tx", signature);
  };

  const _getCount = async () => {
    if (!publicKey) return;

    const accountInfo = await connection.getAccountInfo(storagePubkey);
    console.log("account info", accountInfo);
    if (!accountInfo) return;

    // Find the expected parameters.
    const greeting = borsh.deserialize(
      GreetingSchema,
      GreetingAccount,
      accountInfo.data
    );

    // A little helper
    console.log(greeting);
  };

  const _setCount = async () => {
    if (!publicKey) return;

    const tx = new Transaction().add(
      new TransactionInstruction({
        keys: [{ pubkey: storagePubkey, isSigner: false, isWritable: true }],
        programId: programPubkey,
        data: Buffer.alloc(0), // All instructions are hellos
      })
    );

    const signature = await sendTransaction(tx, connection);
    await connection.confirmTransaction(signature, "processed");
    console.log("sent tx", signature);
  };

  return (
    <div className={styles.container}>
      <Head>
        <title>Create Next App</title>
        <meta name="description" content="Generated by create next app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className={styles.main}>
        <h1 className={styles.title}>
          Welcome to <a href="https://nextjs.org">Next.js!</a>
        </h1>

        <div className={styles.walletButtons}>
          <WalletMultiButton />
          <WalletDisconnectButton />
        </div>

        <Grid templateColumns="repeat(5, 1fr)" gap={6}>
          <Box w="100%" h="10" bg="blue.500">
            <Button colorScheme="blue" onClick={_fetchBalance}>
              fetch balance
            </Button>
          </Box>
          <Box w="100%" h="10" bg="blue.500">
            <Button colorScheme="blue" onClick={_airDrop}>
              airdrop
            </Button>
          </Box>
          <Box w="100%" h="10" bg="blue.500">
            <Button colorScheme="blue" onClick={_transfer}>
              transfer
            </Button>
          </Box>
          <Box w="100%" h="10" bg="blue.500">
            <Button colorScheme="blue" onClick={_accountInfo}>
              getInfo
            </Button>
          </Box>
          <Box w="100%" h="10" bg="blue.500">
            <Button colorScheme="blue" onClick={_createGreeter}>
              create
            </Button>
          </Box>
          <Box w="100%" h="10" bg="blue.500">
            <Button colorScheme="blue" onClick={_getCount}>
              get
            </Button>
          </Box>
          <Box w="100%" h="10" bg="blue.500">
            <Button colorScheme="blue" onClick={_setCount}>
              set
            </Button>
          </Box>
        </Grid>

        <SimpleGrid columns={2} spacing={10}>
          <Box height="80px">
            <Stat>
              <StatLabel>Balance 1</StatLabel>
              <StatNumber>{balance1} SOL</StatNumber>
            </Stat>
          </Box>
          <Box height="80px">
            <Stat>
              <StatLabel>Balance 2</StatLabel>
              <StatNumber>{balance2} SOL</StatNumber>
            </Stat>
          </Box>
        </SimpleGrid>
      </main>

      <footer className={styles.footer}>
        <a
          href="https://vercel.com?utm_source=create-next-app&utm_medium=default-template&utm_campaign=create-next-app"
          target="_blank"
          rel="noopener noreferrer"
        >
          Powered by{" "}
          <span className={styles.logo}>
            <Image src="/vercel.svg" alt="Vercel Logo" width={72} height={16} />
          </span>
        </a>
      </footer>
    </div>
  );
};

export default Index;
