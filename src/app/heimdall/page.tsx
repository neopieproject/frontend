"use client";
import React, { useEffect } from "react";
import { Alert, Button, Card, Space, Typography } from "antd";
import SwapInput from "../components/SwapInput";
import { useNeoWallets } from "@/utils/neo/hook";
import { useAccount, useDisconnect } from "wagmi";
import { useApp } from "@/hooks";
import ConnectedWalletInput from "../components/ConnectedWalletInput";
import { NEOX_HEIMDALL_CA, NEOX_NEO_PIE_CA, NEOX_ONEO_CA } from "@/consts";
import { NEOX_MAINNET, wagmiConfig } from "@/wagmi-config";
import { getBalance, waitForTransactionReceipt } from "wagmi/actions";
import { burn, getBurnNoFromLogs } from "@/utils/neox/heimdall";
import { approve, getAllowances } from "@/utils/neox";
import { ethers } from "ethers";
import { neutralizeN3Address } from "@/utils/neo/helpers";
import { checkIfUnlocked } from "@/utils/neo/teleport";
import Header from "../components/Header";

const Heimdall = () => {
  const { openNeoWalletModal, openEvmWalletModal } = useApp();
  const [amount, setAmount] = React.useState("");
  const neoWallet = useNeoWallets();
  const evmWallet = useAccount();
  const { disconnect } = useDisconnect();
  const [balance, setBalance] = React.useState<string | undefined>();
  const [status, setStatus] = React.useState<{
    stage: "allowlances" | "approve" | "teleport" | "minting on N3";
    status: "checking" | "waiting" | "processing" | "success" | "error";
    message?: string;
  }>();

  const onHeimdall = async () => {
    if (
      evmWallet.isConnected &&
      evmWallet.address &&
      neoWallet.connectedWallet
    ) {
      let allowances: any;
      let tokenApprovalHash: any;
      let feeApprovalHash: any;
      let burnHash: any;
      let burnNo: any;

      setStatus({
        stage: "allowlances",
        status: "checking",
      });

      try {
        allowances = await getAllowances(
          evmWallet.address,
          [NEOX_ONEO_CA, NEOX_NEO_PIE_CA],
          NEOX_HEIMDALL_CA
        );
      } catch (e: any) {
        setStatus({
          stage: "allowlances",
          status: "error",
          message: e.message ? e.message : "Failed to check allowances",
        });
        return;
      }

      if (allowances[0] < amount) {
        try {
          tokenApprovalHash = await approve(NEOX_ONEO_CA, NEOX_HEIMDALL_CA);
          await waitForTransactionReceipt(wagmiConfig, {
            hash: tokenApprovalHash,
            chainId: NEOX_MAINNET.id,
          });
        } catch (e: any) {
          setStatus({
            stage: "approve",
            status: "error",
            message: e.message ? e.message : "Failed to approve token",
          });
          return;
        }
      }

      if (allowances[1] < ethers.parseUnits("1", 18)) {
        try {
          feeApprovalHash = await approve(NEOX_NEO_PIE_CA, NEOX_HEIMDALL_CA);
          await waitForTransactionReceipt(wagmiConfig, {
            hash: tokenApprovalHash,
            chainId: NEOX_MAINNET.id,
          });
        } catch (e: any) {
          setStatus({
            stage: "approve",
            status: "error",
            message: e.message ? e.message : "Failed to approve fee",
          });
          return;
        }
      }

      setStatus({
        stage: "teleport",
        status: "waiting",
      });

      try {
        burnHash = await burn(
          NEOX_ONEO_CA,
          neutralizeN3Address(neoWallet.connectedWallet.account.address),
          amount
        );

        setStatus({
          stage: "teleport",
          status: "processing",
        });

        const data = await waitForTransactionReceipt(wagmiConfig, {
          hash: burnHash,
          chainId: NEOX_MAINNET.id,
        });

        burnNo = getBurnNoFromLogs(data.logs);
      } catch (e: any) {
        console.error(e);
        setStatus({
          stage: "teleport",
          status: "error",
          message: e.message ? e.message : "Failed to teleport",
        });
        return;
      }

      setStatus({
        stage: "minting on N3",
        status: "processing",
      });
      try {
        await checkIfUnlocked(burnNo);
        setStatus({
          stage: "minting on N3",
          status: "success",
        });
      } catch (e: any) {
        console.error(e);
        setStatus({
          stage: "minting on N3",
          status: "error",
          message: e.message ? e.message : "Failed to mint on N3",
        });
        return;
      }
    }
  };
  console.log(evmWallet);
  useEffect(() => {
    (async () => {
      if (evmWallet.isConnected && evmWallet.address) {
        try {
          const balance = await getBalance(wagmiConfig, {
            address: evmWallet.address,
            token: NEOX_ONEO_CA,
          });
          setBalance(balance.formatted);
        } catch (e) {
          console.error(e);
        }
      }
    })();
  }, [evmWallet.isConnected]);
  return (
    <>
      <Header title="Heimdall" description="N3 -> Neo X" />
      <Space direction="vertical" style={{ maxWidth: "600px" }} size="large">
        <Space direction="vertical">
          <Card>
            <Space direction="vertical" style={{ width: "100%" }}>
              <SwapInput
                icon={"/neox.svg"}
                title={"Neo X chain"}
                tokenIcon={"/neo.svg"}
                tokenTitle={"$ONEO"}
                balance={balance}
                value={amount}
                setValue={setAmount}
              />
              {evmWallet.isConnected ? (
                <ConnectedWalletInput
                  address={evmWallet.address ? evmWallet.address : ""}
                  walletIcon={evmWallet.connector?.icon}
                  walletName={
                    evmWallet.connector ? evmWallet.connector.name : ""
                  }
                  onClear={disconnect}
                />
              ) : (
                <Button
                  loading={evmWallet.isConnecting}
                  type="dashed"
                  style={{
                    width: "100%",
                  }}
                  onClick={openEvmWalletModal}
                >
                  Connect wallet
                </Button>
              )}
            </Space>
          </Card>
          <div style={{ textAlign: "center", color: "white" }}>↓↓↓</div>
          <Card>
            <Space direction="vertical" style={{ width: "100%" }}>
              <SwapInput
                readOnly={true}
                icon={"/neo.svg"}
                title={"N3 chain"}
                tokenIcon={"/neo.svg"}
                tokenTitle={"$NEO"}
                value={amount}
                setValue={setAmount}
              />
              {neoWallet.connectedWallet ? (
                <ConnectedWalletInput
                  address={neoWallet.connectedWallet.account.address}
                  walletIcon={`/${neoWallet.connectedWallet.key}.svg`}
                  walletName={neoWallet.connectedWallet.name}
                  onClear={neoWallet.disConnectWallet}
                />
              ) : (
                <Button
                  type="dashed"
                  style={{
                    width: "100%",
                  }}
                  onClick={openNeoWalletModal}
                >
                  Connect wallet
                </Button>
              )}
            </Space>
          </Card>
        </Space>
        {status ? (
          <Alert
            message={
              <div>
                <Typography.Text>{status.stage}</Typography.Text>:{" "}
                <Typography.Text>{status.status}</Typography.Text>
              </div>
            }
            type="info"
            showIcon
            description={status.message}
            action={
              <Button onClick={() => setStatus(undefined)} size="small">
                Close
              </Button>
            }
          />
        ) : (
          <Button
            size="large"
            type="primary"
            style={{
              width: "100%",
            }}
            disabled={
              !neoWallet.connectedWallet || !evmWallet.isConnected || !amount
            }
            onClick={onHeimdall}
          >
            Transfer
          </Button>
        )}
      </Space>
    </>
  );
};

export default Heimdall;
