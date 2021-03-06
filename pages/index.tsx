import {
  WalletDisconnectButton,
  WalletMultiButton,
} from "@solana/wallet-adapter-react-ui";
import { NextPage } from "next";
import Head from "next/head";
import Image from "next/image";
import { Heading } from "@chakra-ui/react";
import styles from "../styles/Home.module.css";
import DebugStuff from "../components/DebugStuff";
import Dungeon from "../components/dungeon/Dungeon";

const Index: NextPage = () => {
  return (
    <div className={styles.container}>
      <Head>
        <title>Create Next App</title>
        <meta name="description" content="Generated by create next app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className={styles.main}>
        <div className={styles.walletButtons}>
          <WalletMultiButton />
          <WalletDisconnectButton />
        </div>

        <div>
          <Heading>debug stuff</Heading>
          <DebugStuff />
        </div>

        <div>
          <Heading>Dungeon</Heading>
          <Dungeon />
        </div>
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
