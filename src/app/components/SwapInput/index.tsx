import { Avatar, Button, Input, Space } from "antd";
import React from "react";
import Text from "antd/lib/typography/Text";
import Paragraph from "antd/lib/typography/Paragraph";

interface SwapInputProps {
  icon?: string;
  title: string;
  tokenIcon: string;
  tokenTitle: string;
  balance?: string;
  value: any;
  setValue: any;
  readOnly?: boolean;
}
const SwapInput = ({
  icon,
  title,
  tokenIcon,
  tokenTitle,
  balance,
  value,
  readOnly,
  setValue,
}: SwapInputProps) => {
  // Handle input changes to ensure only integers are entered
  const handleInputChange = (value: string) => {
    // Allow only digits by removing any non-numeric characters
    if (/^\d*$/.test(value)) {
      setValue(value);
    }
  };

  return (
    <div>
      <Space>
        {icon && <Avatar size="large" src={icon} />}
        <Text style={{ fontSize: "12px" }}>{title}</Text>
      </Space>
      <Input
        width={"100%"}
        readOnly={readOnly}
        value={value}
        onChange={(e) => handleInputChange(e.target.value)}
        size="large"
        placeholder="0"
        style={{
          textAlign: "right",
        }}
        suffix={
          <Space>
            <Avatar
              size="small"
              src={tokenIcon}
              // style={{ width: 12 }}
            />
            <Text style={{ fontSize: "12px" }}>{tokenTitle}</Text>
          </Space>
        }
      />
      {balance && (
        <div style={{ textAlign: "right" }}>
          <Button
            type="text"
            size="small"
            style={{ fontSize: "12px" }}
            // type="secondary"
            onClick={() => setValue(balance)}
          >
            Balance: {balance}
          </Button>
        </div>
      )}
    </div>
  );
};

export default SwapInput;
