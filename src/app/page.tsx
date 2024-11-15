import Title from "antd/lib/typography/Title";
import Paragraph from "antd/lib/typography/Paragraph";
import Header from "./components/Header";
import { Button, Divider, Space, Timeline, Typography } from "antd";

export default function Home() {
  return (
    <div>
      <Header
        title="Neo Pie: No DeFi. We are the PIE!"
        description="Neo is an undervalued blockchain that has proven its dual-token model over many years. Many dApps should recognize the great potential of utilizing $GAS rewards. Neo Pie aims to introduce the first DeFi protocol, ThePie, bridging N3 (L1) and NeoX (EVM). "
      />
      <Space direction="vertical" style={{ maxWidth: "600px" }} size="large">
        <Typography style={{ color: "white" }}>
          <Title level={5} style={{ color: "white" }}>
            !Note
          </Title>
          <Paragraph style={{ color: "white" }}>
            This project is for Neo X Grind Hackathon. It is on mainnet and
            working so please use it beawared. We will officially if we can win
            a prize to get proper audits.
          </Paragraph>
          <Title level={5} style={{ color: "white" }}>
            Links
          </Title>
          <Space>
            <Button
              type="link"
              href="https://x.com/defi_thepie"
              target="_blank"
            >
              X
            </Button>
            <Divider type="vertical" style={{ background: "white" }} />
            <Button
              type="link"
              href="https://github.com/neopieproject/neopie"
              target="_blank"
            >
              GitHub
            </Button>
          </Space>
          <Title level={5} style={{ color: "white" }}>
            Roadmap
          </Title>
          <Timeline
            style={{ color: "white" }}
            items={[
              {
                color: "blue",
                children: "Neo X Grind Hackathon",
              },
              {
                color: "gray",
                children: "Audit",
              },
              {
                color: "gray",
                children: "Official Launch & Promotion",
              },
              {
                color: "gray",
                children: "Support more tokens between Neo and EVM",
              },
            ]}
          />
        </Typography>
      </Space>
    </div>
  );
}
