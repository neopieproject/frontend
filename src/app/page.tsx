import Title from "antd/lib/typography/Title";
import Paragraph from "antd/lib/typography/Paragraph";
import Header from "./components/Header";
import { Button, Divider, Space, Timeline, Typography } from "antd";

export default function Home() {
  return (
    <div>
      <Header
        title="Neo Pie: We are ThePIE (DeFi)!"
        description="Neo is an undervalued blockchain that has proven its dual-token model over many years. Many dApps should recognize the great potential of utilizing $GAS rewards. Neo Pie aims to introduce the first DeFi protocol, ThePie, bridging N3 (L1) and NeoX (EVM). "
      />
      <Space direction="vertical" style={{ maxWidth: "600px" }} size="large">
        <Typography style={{ color: "white" }}>
          <Title level={5} style={{ color: "white" }}>
            !Note
          </Title>
          <Paragraph style={{ color: "white" }}>
            This project is for the Neo X Grind Hackathon. It is live on the
            mainnet and fully functional, so feel free to use it. However,
            please be aware that it has not yet undergone formal audits. We will
            proceed with official audits if we win a prize.
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
            <Divider type="vertical" style={{ background: "white" }} />
            <Button
              type="link"
              href="https://docs.google.com/document/d/1FURkKHQ-I-lTkVvhUQhTxULn71WwzOFb1xSbVtxto7g/edit?usp=sharing"
              target="_blank"
            >
              Whitepaper
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
