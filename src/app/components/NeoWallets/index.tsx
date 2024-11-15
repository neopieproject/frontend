import { useApp } from "@/hooks";
import { NEO_LINE } from "@/utils/neo";
import { useNeoWallets } from "@/utils/neo/hook";
import { IWalletType } from "@/utils/neo/interfaces";
import { Avatar, Button, Divider, List, Modal } from "antd";
import React from "react";

const WALLETS: {
  key: IWalletType;
  label: string;
}[] = [
  {
    key: NEO_LINE,
    label: "NeoLine",
  },
];

const NeoWallets = () => {
  const { neoWalletModalStatus, closeNeoWalletModal } = useApp();
  const { connectWallet } = useNeoWallets();
  return (
    <Modal
      title="Neo Wallets"
      open={neoWalletModalStatus}
      footer={[]}
      onCancel={closeNeoWalletModal}
    >
      <Divider />
      <List
        dataSource={WALLETS}
        renderItem={(item) => (
          <List.Item>
            <List.Item.Meta
              avatar={<Avatar src={`/${item.key}.svg`} />}
              title={item.label}
            />
            <Button
              type="dashed"
              onClick={() => connectWallet(item.key, closeNeoWalletModal)}
            >
              Connect
            </Button>
          </List.Item>
        )}
      />
    </Modal>
  );
};

export default NeoWallets;
