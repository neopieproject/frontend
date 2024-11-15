"use client";
import React, { useEffect } from "react";
import Header from "../components/Header";
import { Alert, Button, Card, Space, Typography } from "antd";
import SwapInput from "../components/SwapInput";
import { useAccount, useDisconnect } from "wagmi";
import ConnectedWalletInput from "../components/ConnectedWalletInput";
import { useApp } from "@/hooks";
import { claim, getClaimableAmount } from "@/utils/neox/ neopie";
import { waitForTransactionReceipt } from "wagmi/actions";
import { NEOX_MAINNET, wagmiConfig } from "@/wagmi-config";

const ClaimNeoPie = () => {
  const evmWallet = useAccount();
  const { openEvmWalletModal } = useApp();
  const { disconnect } = useDisconnect();
  const [status, setStatus] = React.useState<{
    stage: "claiming";
    status: "signing" | "waiting" | "processing" | "success" | "error";
    message?: string;
  }>();
  const [amount, setAmount] = React.useState<string>();

  const onClaim = async () => {
    try {
      setStatus({
        stage: "claiming",
        status: "signing",
      });
      const _txid = await claim();

      setStatus({
        stage: "claiming",
        status: "processing",
      });

      await waitForTransactionReceipt(wagmiConfig, {
        hash: _txid,
        chainId: NEOX_MAINNET.id,
      });

      setStatus({
        stage: "claiming",
        status: "success",
      });
    } catch (e: any) {
      console.error(e);
      setStatus({
        stage: "claiming",
        status: "error",
        message: e.message ? e.message : "An error occurred",
      });
    }
  };

  useEffect(() => {
    (async () => {
      if (evmWallet.address) {
        setAmount(await getClaimableAmount(evmWallet.address));
      }
    })();
  }, [status]);
  return (
    <>
      <Header title="Claim PIE" description="Claim your PIE from ONEO" />
      <Space direction="vertical" size="large">
        <Card>
          <Space direction="vertical" style={{ width: "100%" }}>
            <SwapInput
              readOnly={true}
              title={"Claimable PIE"}
              tokenIcon={"/neopie.svg"}
              tokenTitle={"$PIE"}
              value={amount}
              setValue={() => {}}
            />
            {evmWallet.isConnected ? (
              <ConnectedWalletInput
                address={evmWallet.address ? evmWallet.address : ""}
                walletIcon={`/${evmWallet.connector?.name}.svg`}
                walletName={evmWallet.connector ? evmWallet.connector.name : ""}
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
            onClick={onClaim}
          >
            Claim
          </Button>
        )}
      </Space>
    </>
  );
};

export default ClaimNeoPie;
