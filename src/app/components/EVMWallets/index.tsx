import { useApp } from "@/hooks";
import { Avatar, Button, Divider, List, Modal, message } from "antd";
import React from "react";
import { useConnect } from "wagmi";

const EVMWallets = () => {
  const { evmWalletModalStatus, closeEvmWalletModal } = useApp();
  const { connectAsync, connectors, error } = useConnect();

  // Function to handle wallet connection
  const connectWallet = async (walletKey: string, onSuccess: () => void) => {
    try {
      const connector = connectors.find((conn) => conn.id === walletKey);
      if (!connector) {
        message.error("Connector not found");
        return;
      }

      await connectAsync({ connector });
      message.success("Connected successfully");
      onSuccess(); // Close modal on successful connection
    } catch (err) {
      console.error(err);
      message.error("Failed to connect");
    }
  };

  return (
    <Modal
      title="EVM Wallets"
      open={evmWalletModalStatus}
      footer={null}
      onCancel={closeEvmWalletModal}
    >
      <Divider />
      <List>
        {connectors.map((connector) => (
          <List.Item>
            <List.Item.Meta
              avatar={<Avatar src={`${connector.icon}`} />}
              title={connector.name}
            />
            <Button
              type="dashed"
              onClick={() => connectWallet(connector.id, closeEvmWalletModal)}
            >
              Connect
            </Button>
          </List.Item>
        ))}
      </List>
      {error && <p style={{ color: "red" }}>{error.message}</p>}
    </Modal>
  );
};

export default EVMWallets;
