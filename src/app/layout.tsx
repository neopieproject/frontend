"use client";
import { AntdRegistry } from "@ant-design/nextjs-registry";
import { ConfigProvider } from "antd";
import "./globals.css";
import NavMenu from "./components/NavMenu";
import { WagmiProvider } from "wagmi";
import { wagmiConfig } from "@/wagmi-config";
import { NeoWalletProvider } from "@/utils/neo/hook";
import { AppContextProvider } from "@/hooks";
import NeoWallets from "./components/NeoWallets";
import EVMWallets from "./components/EVMWallets";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { theme } from "antd";
import { createStyles } from "antd-style";
import Content from "./components/ContentWrapper";

const useStyle = createStyles(({ prefixCls, css }) => ({
  linearGradientButton: css`
    &.${prefixCls}-btn-primary {
      border-width: 0;

      > span {
        position: relative;
      }

      &::before {
        content: "";
        background: linear-gradient(135deg, #6253e1, #04befe);
        position: absolute;
        inset: 0;
        opacity: 1;
        transition: all 0.3s;
        border-radius: inherit;
      }

      &:hover::before {
        opacity: 0;
      }

      &:disabled {
        cursor: not-allowed;
      }

      &:disabled::before {
        background: gray; /* Change to your preferred disabled color */
        opacity: 0.5; /* Reduce opacity to give a "disabled" look */
      }

      &:disabled > span {
        color: #bfbfbf; /* Light gray text color for disabled */
      }
    }
  `,
}));

const { compactAlgorithm } = theme;

const queryClient = new QueryClient();
export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const { styles } = useStyle();
  return (
    <html lang="en" style={{ background: "#141414" }}>
      <body>
        <AntdRegistry>
          <ConfigProvider
            button={{
              className: styles.linearGradientButton,
            }}
            theme={{
              algorithm: [compactAlgorithm],
              components: {
                Menu: {
                  darkItemBg: "#141414",
                  darkItemSelectedBg: "red",
                },
              },
              // token: {
              //   colorText: "#fff",
              // },
            }}
          >
            <AppContextProvider>
              <QueryClientProvider client={queryClient}>
                <WagmiProvider config={wagmiConfig}>
                  <NeoWalletProvider>
                    <Content>
                      <NavMenu />
                      <div style={{ padding: 18 }}> {children}</div>
                    </Content>
                    <NeoWallets />
                    <EVMWallets />
                  </NeoWalletProvider>
                </WagmiProvider>
              </QueryClientProvider>
            </AppContextProvider>
          </ConfigProvider>
        </AntdRegistry>
      </body>
    </html>
  );
}
