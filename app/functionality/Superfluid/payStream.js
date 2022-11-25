import { useAccount, useContract, useProvider, useSigner } from "wagmi";
import { Framework } from "@superfluid-finance/sdk-core";
import { ethers } from "ethers";
import React, { useEffect, useState } from "react";

import {
  MATICxABI,
  MATICxAddress,
} from "../../../constants/superfluidConstants";
import { payments_data } from "../../constants/constants";
import { updateFlowPermissions } from "./acl";

export default function component() {
  const [amount, setAmount] = useState(0);
  const [noDays, setNoDays] = useState(0);
  const [flowRate, setFlowRate] = useState(0);
  const [lowBalance, setLowBalance] = useState(true);

  const { address, isConnected } = useAccount();
  const provider = useProvider();
  const { data: signer } = useSigner();

  const MATICxContract = useContract({
    address: MATICxAddress,
    abi: MATICxABI,
    signerOrProvider: signer || provider,
  });

  const paymentsContract = useContract({
    address: payments_data.address,
    abi: payments_data.abi,
    signerOrProvider: signer || provider,
  });

  const calculateFlowRate = async () => {
    const timePeriod = noDays * 24 * 60 * 60;
    /// amount / sec is flowRate
    const _flow = amount / timePeriod;
    console.log(_flow);
    setFlowRate(_flow);
  };

  useEffect(() => {
    calculateFlowRate();
  }, [amount, noDays]);

  const checkMATICxBalance = async () => {
    try {
      console.log("Checking the Balance ...");
      const data = await MATICxContract.balanceOf(address);
      const _amount = ethers.utils.formatEther(data);

      console.log(_amount);
      if (_amount > amount) {
        setLowBalance(true);
      }
    } catch (err) {
      console.log(err);
    }
  };

  //// condition to show https://app.superfluid.finance/wrap?upgrade , link to upgrade the MATICx

  const updatePermissions = async () => {
    try {
      console.log("Updating the Flow ...");
      const operator = payments_data.address;
      /// allowance type = 5 , for create and Delete permissions
      const tx = await updateFlowPermissions(payments_data, flowRate, 5);
      await tx.wait();
    } catch (err) {
      console.log(err);
    }
  };

  const startStream = async () => {
    try {
      console.log("Starting the Stream..");
      const timePeriod = noDays * 24 * 60 * 60;
      const tx = await paymentsContract.payStream(
        address,
        userAddress,
        amount,
        timePeriod,
        MATICxAddress
      );
      await tx.wait();
    } catch (err) {
      console.log(err);
    }
  };
}
