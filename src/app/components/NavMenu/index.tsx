"use client";
import React from "react";
import { MENU } from "@/consts";
import { Avatar, Menu } from "antd";
import Link from "next/link";
import { usePathname } from "next/navigation";
const NavMenu = () => {
  const pathname = usePathname(); //
  const menuItems = MENU.map((item) => ({
    key: item.key,
    label: <Link href={item.key}>{item.label}</Link>,
  }));

  return (
    <Menu
      theme="dark"
      mode="horizontal"
      selectedKeys={[ pathname]}
      style={{ flex: 1, minWidth: 0 }}
      items={[
        {
          key: "/",
          label: (
            <Link href="/" passHref>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  cursor: "pointer",
                }}
              >
                <Avatar
                  src="/neopie.svg"
                  size={24}
                  style={{ marginRight: 8 }}
                />
                Neo Pie
              </div>
            </Link>
          ),
        },
        ...menuItems, // Spread the rest of the menu items here
      ]}
    />
  );
};

export default NavMenu;
