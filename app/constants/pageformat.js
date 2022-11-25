import { useAccount, useContract, useProvider, useSigner } from "wagmi";

export default function component() {
  const { address, isConnected } = useAccount();
  const provider = useProvider();
  const { data: signer } = useSigner();

  const Contract = useContract({
    address: data.address,
    abi: data.abi,
    signerOrProvider: signer || provider,
  });

  const component = async () => {
    try {
    } catch (err) {
      console.log(err);
    }
  };
}
