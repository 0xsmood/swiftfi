import Head from "next/head";
import styles from '../styles/Home.module.css'
import Image from "next/image";
import Layout from "../components/Layout";
import wallet from '../assets/wallet.png'

export default function Home() {
  return (
    <>
      <Layout>
        <div className="pt-[3rem] text-center">
        <div className={`${styles.main} pt-14`}>
        <div className={`${styles.left} md:pt-0 pt-14`}>
          <h1 className={styles.heading}>
            <span className={styles.color1}>Swift</span>
            <span className={styles.color2}>Fi</span>
          </h1>
          <p>
            SwiftFi is a platform that lets you receive payments in the form of
            crypto by generating a unique link for every user.
          </p>
          <p>
            SwiftFi also offers you to invest received money directly to stream,
            with couple of other options to help manage and make payments
            easily.
          </p>
          <p>
            You can also use gift cards to send money to your loved ones or the
            crypto card feature to pay on your favourite websites :D
          </p>
          <div className={styles.buttons}>
            <button className={styles.btnPrimary}>Dashboard 🚀</button>
            <button className={styles.btnSecondary}>Github 😎</button>
          </div>
        </div>
        <div className={styles.right}>
          <Image className={styles.hero} src={wallet} />
          {/* <section className={styles.section}>
            <span className={styles.span}></span>
            <span className={styles.span}></span>
            <span className={styles.span}></span>
            <span className={styles.span}></span>
            <span className={styles.span}></span>
            <span className={styles.span}></span>
            <span className={styles.span}></span>
            <span className={styles.span}></span>
            <span className={styles.span}></span>
            <span className={styles.span}></span>
          </section> */}
        </div>
      </div>

      <div className={styles.features}>
        {/* <h1 className={styles.heading}>
          <span className={styles.color1}>Swift</span>
          <span className={styles.color2}>Fi</span>
        </h1> */}
        <div className={styles.gradientBox}>
              <h1 className="text-3xl font-bold">Lorem ipsum dolor sit amet consectetur adipisicing elit. Modi possimus libero, est unde nesciunt quis minus vitae aut </h1>
        </div>
      </div>
        </div>
      </Layout>
    </>
  );
}
