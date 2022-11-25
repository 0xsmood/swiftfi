import {
  useAccount,
  useContract,
  useProvider,
  useSigner,
  useNetwork,
} from "wagmi";
import { Framework } from "@superfluid-finance/sdk-core";
import { ethers } from "ethers";
import React, { useEffect, useState } from "react";
import { GelatoOpsSDK } from "@gelatonetwork/ops-sdk";

import {
  MATICxABI,
  MATICxAddress,
} from "../../../constants/superfluidConstants";
import { payments_data, paymentRequest_data } from "../../constants/constants";
import { updateFlowPermissions } from "./acl";

export default function component(userAddress, requestID, amount) {
  const [amount, setAmount] = useState(0);
  const [noDays, setNoDays] = useState(0);
  const [flowRate, setFlowRate] = useState(0);
  const [timePeriod, setTimePeriod] = useState(0);
  const [lowBalance, setLowBalance] = useState(true);

  const { address, isConnected } = useAccount();
  const provider = useProvider();
  const { data: signer } = useSigner();
  const { chain } = useNetwork();

  const gelatoOps = new GelatoOpsSDK(chain.id, signer);

  const MATICxContract = useContract({
    address: MATICxAddress,
    abi: MATICxABI,
    signerOrProvider: signer || provider,
  });

  const paymentRequestContract = useContract({
    address: paymentRequest_data.address,
    abi: paymentRequest_data.abi,
    signerOrProvider: signer || provider,
  });

  const calculateFlowRate = async () => {
    const _timePeriod = noDays * 24 * 60 * 60;
    /// amount / sec is flowRate
    const _flow = amount / timePeriod;
    console.log(_flow);
    setFlowRate(_flow);
    setTimePeriod(_timePeriod);
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
      const tx = await paymentRequestContract.PayStream(
        userAddress,
        requestID,
        timePeriod,
        flowRate,
        MATICxAddress
      );
      await tx.wait();
    } catch (err) {
      console.log(err);
    }
  };

  const assignGelatoAutomation = async () => {
    try {
      console.log("Assigning gelato Automation...");
      const { taskId, tx } = await gelatoOps.createTask({
        execAddress: paymentRequest_data.address,
        execSelector: counter.interface.getSighash(
          "completePayStream(address, uint256)"
        ),
        execData: counter.interface.encodeFunctionData("completePayStream", [
          userAddress,
          requestID,
        ]),
        execAbi: paymentRequest_data.abi,
        interval: timePeriod, // execute every 10 minutes
        name: "Automated counter to Close Stream",
        dedicatedMsgSender: true,
      });

      await tx.wait();

      // Get dedicated proxy address to whitelist
      const { address, isDeployed } = await gelatoOps.getDedicatedMsgSender();

      /// add this address to the whitelist of the contract paymentRequest
    } catch (err) {
      console.log(err);
    }
  };

  /// maybe we can sum all of this Tasks directly into the contracts created
}
