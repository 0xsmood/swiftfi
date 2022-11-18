import React from "react";
import SwiftPay from "../../../components/SwiftPay";
import styles from "../../../styles/Home.module.css";

export default function Home() {
  return (
    <div>
      <div
        className={`${styles.bg} px-6 min-h-screen bg-[#0000008b] flex items-center justify-center flex-wrap`}
      >
        <div
          className={`${styles.paylink} flex flex-col items-center justify-start w-full `}
        >
          <h1 className="pt-6 pb-2 text-lg md:text-xl font-semibold text-center">
            gm!!! this personalized payment page was created with{" "}
            <a
              target="_blank"
              rel="noopener noreferrer"
              href="https://swiftfi.vercel.app"
            >
              <u>SwiftFi</u>
            </a>{" "}
            🚀
          </h1>
          <h1 className=" mt-4 text-lg font-semibold lg:text-3xl mx-auto pb-2  text-center">
            Page Title here
          </h1>

          <div className="max-w-[700px] md:mt-[50px]">
            <h1 className="text-3xl  font-semibold pb-8 text-center">
              <span className="underline">Description</span>
            </h1>
            <p className="text-center px-4 pb-8">
              Lorem ipsum dolor, sit amet consectetur adipisicing elit. Id
              aspernatur, pariatur consequuntur optio error odit quaerat officia
              explicabo obcaecati. Quis, tempora quia. Rerum sed, doloremque
              ipsa
            </p>
            <h2 className="text-center px-4 pb-8">
              Email :{" "}
              <a
                className=" underline"
                href={`${"mailto:${`EMAIL HERE`}"}`}
              >{`Mail goes here`}</a>
            </h2>
          </div>

          <div>
            <SwiftPay />
          </div>
        </div>
      </div>
    </div>
  );
}
