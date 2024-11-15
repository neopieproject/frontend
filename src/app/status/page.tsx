"use client";
import React, { useEffect } from "react";
import Header from "../components/Header";
import { Space, Typography } from "antd";
import { getToken } from "@wagmi/core";
import { N3_TELEPORT_CA, NEOX_HEIMDALL_CA, NEOX_NEO_PIE_CA } from "@/consts";
import { NEOX_MAINNET, wagmiConfig } from "@/wagmi-config";
import { getRewardsPerBlock } from "@/utils/neox/ neopie";
import { getBalance } from "@/utils/neo/helpers";
import { NATIVE_CONTRACT_HASH } from "@cityofzion/neon-core/lib/consts";
import { formatEther } from "ethers";

const Status = () => {
  const [status, setStatus] = React.useState<{
    pie: {
      totalSupply: string;
      emission: string;
    };
    oneo: {
      locked: string;
    };
  }>();
  useEffect(() => {
    (async () => {
      const pie = await getToken(wagmiConfig, {
        address: NEOX_NEO_PIE_CA,
        chainId: NEOX_MAINNET.id,
      });
      const rewardsPerBlock = await getRewardsPerBlock();
      const lockedNeo = await getBalance(
        N3_TELEPORT_CA,
        NATIVE_CONTRACT_HASH.NeoToken
      );
      setStatus({
        pie: {
          totalSupply: pie.totalSupply.formatted,
          emission: formatEther(rewardsPerBlock),
        },
        oneo: {
          locked: lockedNeo,
        },
      });
    })();
  }, []);
  return (
    <>
      <Header
        title="PIE Status"
        description="Numbers you should to know for PIE"
      />
      <Space direction="vertical" style={{ maxWidth: "600px" }} size="large">
        <Typography style={{ color: "white" }}>
          <ul>
            <li>Total supply of PIE: {status?.pie.totalSupply}</li>
            <li>PIE emissions per day: {status?.pie.emission} </li>
            <li>ONEO APR: --%</li>
            <li>ONEO Locked: {status?.oneo.locked}</li>
          </ul>
        </Typography>
      </Space>
    </>
  );
};

export default Status;
