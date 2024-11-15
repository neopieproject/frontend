import Title from "antd/es/typography/Title";
import Paragraph from "antd/lib/typography/Paragraph";
import React from "react";

interface HeaderProps {
  title: string;
  description: string;
}
const Header = ({ title, description }: HeaderProps) => {
  return (
    <header>
      <Title level={3} style={{ color: "white" }}>
        {title}
      </Title>
      <Paragraph style={{ color: "white" }}>{description}</Paragraph>
    </header>
  );
};

export default Header;
