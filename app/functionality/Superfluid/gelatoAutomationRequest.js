import { GelatoOpsSDK } from "@gelatonetwork/ops-sdk";
import { useProvider, useSigner, useNetwork } from "wagmi";
import { ethers } from "ethers";
import { paymentRequest_data } from "../../constants/constants";

export async function gelatoAutomateRequest(
  timePeriod,
  userAddress,
  requestID
) {
  const provider = useProvider();
  const { data: signer } = useSigner();
  const gelatoOps = new GelatoOpsSDK(chain.id, signer);

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
  } catch (err) {
    console.log(err);
  }
}
