import { Framework } from "@superfluid-finance/sdk-core";
import { useProvider, useSigner } from "wagmi";

import { MATICxAddress } from "../../constants/superfluidConstants";

/// permission type = 7
/// flowRateAllowance = 10 $DAIx/sec
export async function updateFlowPermissions(
  operator,
  flowRateAllowance,
  permissionType
) {
  const provider = useProvider();
  const { data: signer } = useSigner();

  const sf = await Framework.create({
    chainId: 80001,
    provider: provider,
  });

  try {
    const updateFlowOperatorOperation = sf.cfaV1.updateFlowOperatorPermissions({
      flowOperator: operator,
      permissions: permissionType,
      flowRateAllowance: flowRateAllowance,
      superToken: MATICxAddress,
      // userData?: string
    });

    const result = await updateFlowOperatorOperation.exec(signer);
    console.log(result);
  } catch (err) {
    console.log(err);
  }
}
