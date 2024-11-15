import { Avatar, Input, Space } from "antd";
import React from "react";
import Text from "antd/lib/typography/Text";
interface IConnectedWalletInputProps {
  address: string;
  walletIcon?: string;
  walletName: string;
  onClear: () => void;
}
const ConnectedWalletInput = ({
  address,
  walletIcon,
  walletName,
  onClear,
}: IConnectedWalletInputProps) => {
  return (
    <Input
      style={{ width: "100%" }}
      size="large"
      value={address}
      allowClear={true}
      suffix={
        <Space>
          <Avatar size="small" src={walletIcon} />
          <Text style={{ fontSize: "12px" }}>{walletName}</Text>
        </Space>
      }
      // readOnly={true}
      onClear={onClear}
    />
  );
};

export default ConnectedWalletInput;
