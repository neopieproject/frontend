import { Col, Row } from "antd";
import { Content } from "antd/lib/layout/layout";
import React, { ReactNode } from "react";

const ContentWrapper = ({ children }: { children: ReactNode }) => {
  return (
    <Row justify="center" style={{ background: "#141414" }}>
      <Col xs={24} sm={24} md={20} lg={8} xl={8} xxl={8}>
        <div>{children}</div>
        {/* <Content
          style={{
            background: "#141414",
            display: "flex",
            justifyContent: "center",
          }}
        >
          <div>{children}</div>
        </Content> */}
      </Col>
    </Row>
  );
};

export default ContentWrapper;
