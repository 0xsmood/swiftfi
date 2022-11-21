import React from "react";
import { Fragment, useRef, useState, useEffect } from "react";
import { Button } from "flowbite-react";
import { Dialog, Transition } from "@headlessui/react";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import { useAccount, useContract, useProvider, useSigner } from "wagmi";
import { payments_data, paymentRequest_data } from "../constants/constants";
import { ethers } from "ethers";

export default function SwiftPayRequest(props) {
  const [togglePayComponent, setTogglePayComponent] = useState(false);
  const [togglePayNow, setTogglePayNow] = useState(false);
  const [togglePayLater, setTogglePayLater] = useState(false);
  const [togglePayStream, setTogglePayStream] = useState(false);
  const [togglePayEMI, setTogglePayEMI] = useState(false);
  const cancelButtonRef = useRef(null);

  const [requestId, setrequestId] = useState(0);
  const [userAddress, setUserAddress] = useState("");
  const [amount, setAmount] = useState(0);

  const [tenure, setTenure] = useState("");

  const { address, isConnected } = useAccount();
  const provider = useProvider();
  const { data: signer } = useSigner();

  const Payments_Contract = useContract({
    address: payments_data.address,
    abi: payments_data.abi,
    signerOrProvider: signer || provider,
  });

  const PaymentsRequest_Contract = useContract({
    address: paymentRequest_data.address,
    abi: paymentRequest_data.abi,
    signerOrProvider: signer || provider,
  });

  useEffect(() => {
    setUserAddress(props.address);
    setrequestId(props.id);
    setAmount(props.amount);
    console.log(props.id, props.address, props.amount);
  }, [props]);

  const handlePayNow = async (_choice) => {
    try {
      console.log("Paying Now");
      const _amount = ethers.utils.parseEther(amount);
      if (_choice == 1) {
        const tx = await PaymentsRequest_Contract.PayNow(
          userAddress,
          requestId,
          1,
          { value: _amount }
        );
        await tx.wait();
      } else if (_choice == 2) {
        const tx = await PaymentsRequest_Contract.PayNow(
          userAddress,
          requestId,
          2
        );
        await tx.wait();
      } else {
        console.log("Not a Valid Choice");
      }
    } catch (err) {
      console.log(err);
    }
  };

  const handlePayLater = async () => {
    try {
      console.log("Pay later activating ...");
      const time = 2592000;
      const tx = await PaymentsRequest_Contract.PayNow(
        userAddress,
        requestId,
        time
      );
      await tx.wait();
      console.log("Pay Later Activated ..");
    } catch (err) {
      console.log(err);
    }
  };

  const handlePayEMI = async () => {
    try {
      // console.log(tenure);
      console.log("Pay EMI activating ...");
      const tx = await PaymentsRequest_Contract.PayNow(
        userAddress,
        requestId,
        3
      );
      await tx.wait();
      console.log("Pay EMI Activated ..");
    } catch (err) {
      console.log(err);
    }
  };

  const handlePayStream = async () => {
    try {
      console.log("Pay Stream activating ...");
      const tx = await PaymentsRequest_Contract.PayNow(
        userAddress,
        requestId,
        tenure
      );
      await tx.wait();
      console.log("Pay Stream Activated ..");
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div>
      {/* payment component */}
      <Button
        onClick={() => {
          setTogglePayComponent(!togglePayComponent);
        }}
        className="w-[100px] m-2 rounded-sm"
      >
        Pay
      </Button>

      {/* payment options modal */}
      <Transition.Root show={togglePayComponent} as={Fragment}>
        <Dialog
          as="div"
          className="relative z-10"
          initialFocus={cancelButtonRef}
          onClose={setTogglePayComponent}
        >
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-gray-500 bg-[#0c0c1764] bg-opacity-75 transition-opacity backdrop-blur-[40px]" />
          </Transition.Child>

          <div className="fixed inset-0 z-10 overflow-y-auto">
            <div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
              <Transition.Child
                as={Fragment}
                enter="ease-out duration-300"
                enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
                enterTo="opacity-100 translate-y-0 sm:scale-100"
                leave="ease-in duration-200"
                leaveFrom="opacity-100 translate-y-0 sm:scale-100"
                leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
              >
                <Dialog.Panel className="relative transform overflow-hidden rounded-lg bg-white text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg">
                  <div className="bg-gray-100 px-4 pt-5 pb-4 sm:p-6 sm:pb-4 sm:pl-0">
                    <div className="sm:flex sm:items-start ">
                      <div className="mt-3 flex flex-col justify-center items-center text-center sm:mt-0 sm:ml-4 w-full sm:text-left">
                        <Dialog.Title
                          as="h3"
                          className="text-3xl mx-auto mt-4 font-semibold leading-6 mr-auto pl-4 text-gray-900 px-2"
                        >
                          Select Payment Option{" "}
                        </Dialog.Title>
                        <div className={`mt-4`}>
                          <div className="flex flex-col  w-[350px] h-[350px] bg-gray-100 flex-wrap justify-center items-center px-6 py-4 rounded-md">
                            <Button
                              onClick={() => {
                                setTogglePayNow(!togglePayNow);
                              }}
                              className="w-[130px] py3 my-3"
                            >
                              Pay Now
                            </Button>

                            <Button
                              onClick={() => {
                                setTogglePayLater(!togglePayLater);
                              }}
                              className="w-[130px] py3 my-3"
                            >
                              Pay Later
                            </Button>

                            <Button
                              onClick={() => {
                                setTogglePayStream(!togglePayStream);
                              }}
                              className="w-[130px] py3 my-3"
                            >
                              Pay in Stream
                            </Button>

                            <Button
                              onClick={() => {
                                setTogglePayEMI(!togglePayEMI);
                              }}
                              className="w-[130px] py3 my-3"
                            >
                              Pay in EMI
                            </Button>

                            <Button
                              onClick={() => {
                                setTogglePayComponent(!togglePayComponent);
                              }}
                              ref={cancelButtonRef}
                              className="w-[130px] py3 my-3"
                              // className={` mt-3 inline-flex  rounded-md border border-transparent bg-white text-black px-4 py-2 text-base font-medium shadow-sm hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-offset-2 sm:ml-3 sm:w-auto sm:text-sm`}
                            >
                              Cancel
                            </Button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition.Root>

      {/* pay now modal */}
      <Transition.Root show={togglePayNow} as={Fragment}>
        <Dialog
          as="div"
          className="relative z-10"
          initialFocus={cancelButtonRef}
          onClose={setTogglePayNow}
        >
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-gray-500 bg-[#0c0c1764] bg-opacity-75 transition-opacity backdrop-blur-[40px]" />
          </Transition.Child>

          <div className="fixed inset-0 z-10 overflow-y-auto">
            <div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
              <Transition.Child
                as={Fragment}
                enter="ease-out duration-300"
                enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
                enterTo="opacity-100 translate-y-0 sm:scale-100"
                leave="ease-in duration-200"
                leaveFrom="opacity-100 translate-y-0 sm:scale-100"
                leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
              >
                <Dialog.Panel className="relative transform overflow-hidden rounded-lg bg-white text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg">
                  <div className="bg-gray-100 px-4 pt-5 pb-4 sm:p-6 sm:pb-4 sm:pl-0">
                    <div className="sm:flex sm:items-start ">
                      <div className="mt-3 flex flex-col justify-center items-center text-center sm:mt-0 sm:ml-4 w-full sm:text-left">
                        <Dialog.Title
                          as="h3"
                          className="text-3xl font-semibold leading-6 mr-auto pl-4 text-gray-900 px-2"
                        >
                          Pay Now
                        </Dialog.Title>
                        <div className="p-2 text-sm mt-2 w-full text-gray-800">
                          <div
                            className={` flex flex-col items-center justify-center w-full text-center rounded-md mt-2 p-2`}
                          >
                            <div
                              className={`${`text-center w-36 mr-auto font-semibold max-h-[100px] overflow-hidden rounded-md p-2 bg-gray-900 text-white`}`}
                            >
                              <ConnectButton />
                            </div>
                          </div>
                          <div className="w-full mt-3 mx-2">
                            <h2 className="my-2 text-xl">
                              RequestID: {requestId}
                            </h2>
                            <h1 className="my-2 text-2xl font-semibold">
                              Amount: {amount} Matic
                            </h1>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="bg-gray-800 px-4 py-3 sm:flex sm:flex-row sm:px-6">
                    <button
                      type="button"
                      className={`mt-3 inline-flex  rounded-md borderborder-transparent bg-green-500 px-4 py-2 text-base font-medium text-white shadow-sm hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-400 focus:ring-offset-2 sm:ml-3 sm:w-auto sm:text-sm`}
                      onClick={() => {
                        handlePayNow(2);
                      }}
                    >
                      Pay with SwiftFi Wallet
                    </button>
                    <button
                      type="button"
                      className={` mt-3 inline-flex  rounded-md border border-transparent bg-green-500 px-4 py-2 text-base font-medium text-white shadow-sm hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-400 focus:ring-offset-2 sm:ml-3 sm:w-auto sm:text-sm`}
                      onClick={() => {
                        handlePayNow(1);
                      }}
                    >
                      Pay with Other Wallet
                    </button>
                    <button
                      onClick={() => {
                        setTogglePayNow(!togglePayNow);
                      }}
                      ref={cancelButtonRef}
                      type="button"
                      className={` mt-3 inline-flex  rounded-md border border-transparent bg-white text-black px-4 py-2 text-base font-medium shadow-sm hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-offset-2 sm:ml-3 sm:w-auto sm:text-sm`}
                    >
                      Cancel
                    </button>
                  </div>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition.Root>

      {/* pay later modal */}
      <Transition.Root show={togglePayLater} as={Fragment}>
        <Dialog
          as="div"
          className="relative z-10"
          initialFocus={cancelButtonRef}
          onClose={setTogglePayLater}
        >
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-gray-500 bg-[#0c0c1764] bg-opacity-75 transition-opacity backdrop-blur-[40px]" />
          </Transition.Child>

          <div className="fixed inset-0 z-10 overflow-y-auto">
            <div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
              <Transition.Child
                as={Fragment}
                enter="ease-out duration-300"
                enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
                enterTo="opacity-100 translate-y-0 sm:scale-100"
                leave="ease-in duration-200"
                leaveFrom="opacity-100 translate-y-0 sm:scale-100"
                leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
              >
                <Dialog.Panel className="relative transform overflow-hidden rounded-lg bg-white text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg">
                  <div className="bg-gray-100 px-4 pt-5 pb-4 sm:p-6 sm:pb-4 sm:pl-0">
                    <div className="sm:flex sm:items-start ">
                      <div className="mt-3 flex flex-col justify-center items-center text-center sm:mt-0 sm:ml-4 w-full sm:text-left">
                        <Dialog.Title
                          as="h3"
                          className="text-3xl font-semibold leading-6 mr-auto pl-4 text-gray-900 px-2"
                        >
                          Pay Later
                        </Dialog.Title>

                        <div className="p-2 text-sm mt-2 w-full text-gray-800">
                          <div
                            className={` flex flex-col items-center justify-center w-full text-center rounded-md mt-2 p-2`}
                          >
                            <div
                              className={`${`text-center w-36 mr-auto font-semibold max-h-[100px] overflow-hidden rounded-md p-2 bg-gray-900 text-white`}`}
                            >
                              <ConnectButton />
                            </div>
                          </div>
                          <div className="w-full mt-3 mx-2">
                            <h2 className="my-2 text-xl">
                              RequestId: {requestId}
                            </h2>
                            <h1 className="my-2 text-2xl font-semibold">
                              Amount: {amount} Matic
                            </h1>

                            <h2 className="my-2 text-xl">
                              How does Pay Later work?
                            </h2>
                            <h2 className="my-2 textlg">
                              - 30 days interest free period <br />
                              - 15% APR interest <br />- amount to be locked
                            </h2>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="bg-gray-800 px-4 py-3 sm:flex sm:flex-row justify-end  sm:px-6">
                    <button
                      type="button"
                      className={`mt-3 inline-flex  rounded-md borderborder-transparent bg-green-500 px-4 py-2 text-base font-medium text-white shadow-sm hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-400 focus:ring-offset-2 sm:ml-3 sm:w-auto sm:text-sm`}
                      onClick={() => {
                        handlePayLater();
                      }}
                    >
                      Start Pay Later
                    </button>
                    <button
                      onClick={() => {
                        setTogglePayLater(!togglePayLater);
                      }}
                      ref={cancelButtonRef}
                      type="button"
                      className={` mt-3 inline-flex  rounded-md border border-transparent bg-white text-black px-4 py-2 text-base font-medium shadow-sm hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-offset-2 sm:ml-3 sm:w-auto sm:text-sm`}
                    >
                      Cancel
                    </button>
                  </div>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition.Root>

      {/* pay stream modal */}
      <Transition.Root show={togglePayStream} as={Fragment}>
        <Dialog
          as="div"
          className="relative z-10"
          initialFocus={cancelButtonRef}
          onClose={setTogglePayStream}
        >
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-gray-500 bg-[#0c0c1764] bg-opacity-75 transition-opacity backdrop-blur-[40px]" />
          </Transition.Child>

          <div className="fixed inset-0 z-10 overflow-y-auto">
            <div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
              <Transition.Child
                as={Fragment}
                enter="ease-out duration-300"
                enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
                enterTo="opacity-100 translate-y-0 sm:scale-100"
                leave="ease-in duration-200"
                leaveFrom="opacity-100 translate-y-0 sm:scale-100"
                leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
              >
                <Dialog.Panel className="relative transform overflow-hidden rounded-lg bg-white text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg">
                  <div className="bg-gray-100 px-4 pt-5 pb-4 sm:p-6 sm:pb-4 sm:pl-0">
                    <div className="sm:flex sm:items-start ">
                      <div className="mt-3 flex flex-col justify-center items-center text-center sm:mt-0 sm:ml-4 w-full sm:text-left">
                        <Dialog.Title
                          as="h3"
                          className="text-3xl font-semibold leading-6 mr-auto pl-4 text-gray-900 px-2"
                        >
                          Pay in Stream
                        </Dialog.Title>
                        <div className="p-2 text-sm mt-2 w-full text-gray-800">
                          <div
                            className={` flex flex-col items-center justify-center w-full text-center rounded-md mt-2 p-2`}
                          >
                            <div
                              className={` ${`text-center  mr-auto font-semibold max-h-[100px] overflow-hidden rounded-md p-2 bg-gray-900 text-white`}`}
                            >
                              <ConnectButton />
                            </div>
                          </div>

                          <div className="w-full mt-3 mx-2">
                            <h2 className="my-2 text-xl">
                              RequestId: {requestId}
                            </h2>

                            <h1 className="my-2 text-2xl font-semibold">
                              Amount: {amount} Matic
                            </h1>

                            <button
                              type="button"
                              className={`my-2 inline-flex  rounded-md borderborder-transparent bg-green-500 px-4 py-2 text-base font-medium text-white shadow-sm hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-400 focus:ring-offset-2 sm:ml-0 sm:w-auto sm:text-sm`}
                            >
                              Superfluid enabled coin Swapping and token
                              selection
                            </button>

                            <div className="my-2 flex flex-col flex-wrap mx-auto items-start justify-between">
                              <label className="pb-2 text-sm" htmlFor="">
                                Time Period :
                              </label>
                              <input
                                type="text"
                                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-[5px] focus:ring-blue-500 focus:border-blue-500 w-72 p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                                placeholder="Duration..."
                                required
                              />
                            </div>

                            <h2 className="mt-4 text-xl ">
                              Flow Rate: {` Rate HERE `}
                            </h2>

                            <h2 className="mt-5 text-center text-xs underline ">
                              Streams Powered by Superfluid{" "}
                            </h2>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="bg-gray-800 px-4 py-3 sm:flex sm:flex-row justify-end sm:px-6">
                    <button
                      type="button"
                      className={`mt-3 inline-flex  rounded-md borderborder-transparent bg-green-500 px-4 py-2 text-base font-medium text-white shadow-sm hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-400 focus:ring-offset-2 sm:ml-3 sm:w-auto sm:text-sm`}
                    >
                      Start Stream
                    </button>

                    <button
                      onClick={() => {
                        setTogglePayStream(!togglePayStream);
                      }}
                      ref={cancelButtonRef}
                      type="button"
                      className={` mt-3 inline-flex  rounded-md border border-transparent bg-white text-black px-4 py-2 text-base font-medium shadow-sm hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-offset-2 sm:ml-3 sm:w-auto sm:text-sm`}
                    >
                      Cancel
                    </button>
                  </div>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition.Root>

      {/* pay EMI modal */}
      <Transition.Root show={togglePayEMI} as={Fragment}>
        <Dialog
          as="div"
          className="relative z-10"
          initialFocus={cancelButtonRef}
          onClose={setTogglePayEMI}
        >
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-gray-500 bg-[#0c0c1764] bg-opacity-75 transition-opacity backdrop-blur-[40px]" />
          </Transition.Child>

          <div className="fixed inset-0 z-10 overflow-y-auto">
            <div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
              <Transition.Child
                as={Fragment}
                enter="ease-out duration-300"
                enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
                enterTo="opacity-100 translate-y-0 sm:scale-100"
                leave="ease-in duration-200"
                leaveFrom="opacity-100 translate-y-0 sm:scale-100"
                leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
              >
                <Dialog.Panel className="relative transform overflow-hidden rounded-lg bg-white text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg">
                  <div className="bg-gray-100 px-4 pt-5 pb-4 sm:p-6 sm:pb-4 sm:pl-0">
                    <div className="sm:flex sm:items-start ">
                      <div className="mt-3 flex flex-col justify-center items-center text-center sm:mt-0 sm:ml-4 w-full sm:text-left">
                        <Dialog.Title
                          as="h3"
                          className="text-3xl font-semibold leading-6 mr-auto pl-4 text-gray-900 px-2"
                        >
                          Pay in EMI
                        </Dialog.Title>
                        <div className="p-2 text-sm mt-2 w-full text-gray-800">
                          <div
                            className={` flex flex-col items-center justify-center w-full text-center rounded-md mt-2 p-2`}
                          >
                            <div
                              className={` ${`text-center  mr-auto font-semibold max-h-[100px] overflow-hidden rounded-md p-2 bg-gray-900 text-white`}`}
                            >
                              <ConnectButton />
                            </div>
                          </div>

                          <div className="w-full mt-3 mx-2">
                            <h2 className="my-2 text-xl">
                              RequestID: {requestId}
                            </h2>

                            <h1 className="my-2 text-2xl font-semibold">
                              Amount: {amount} Matic
                            </h1>

                            <h2 className="my-2 text-xl">
                              Tenure (months):{" "}
                              <select
                                id="countries"
                                className="bg-gray-900 my-2 text-white border w-72 md:w-64 border-gray-300 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                              >
                                <option
                                  value="3m"
                                  selected
                                  onSelect={() => setTenure(3)}
                                >
                                  3
                                </option>
                                <option
                                  value="6m"
                                  onSelect={() => setTenure(6)}
                                >
                                  6
                                </option>
                                <option
                                  value="9m"
                                  onSelect={() => setTenure(9)}
                                >
                                  9
                                </option>
                                <option
                                  value="12m"
                                  onSelect={() => setTenure(12)}
                                >
                                  12
                                </option>
                              </select>
                            </h2>

                            <h2 className="my-2 text-xl">How does EMI work?</h2>
                            <h2 className="my-2 textlg">
                              - Defaults payment if not done in 30 days
                              <br />- 25 % interest
                            </h2>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="bg-gray-800 px-4 py-3 sm:flex sm:flex-row justify-end sm:px-6">
                    <button
                      type="button"
                      className={`mt-3 inline-flex  rounded-md borderborder-transparent bg-green-500 px-4 py-2 text-base font-medium text-white shadow-sm hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-400 focus:ring-offset-2 sm:ml-3 sm:w-auto sm:text-sm`}
                      onClick={() => {
                        handlePayEMI();
                      }}
                    >
                      Pay
                    </button>
                    <button
                      onClick={() => {
                        setTogglePayEMI(!togglePayEMI);
                      }}
                      ref={cancelButtonRef}
                      type="button"
                      className={` mt-3 inline-flex  rounded-md border border-transparent bg-white text-black px-4 py-2 text-base font-medium shadow-sm hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-offset-2 sm:ml-3 sm:w-auto sm:text-sm`}
                    >
                      Cancel
                    </button>
                  </div>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition.Root>
    </div>
  );
}
