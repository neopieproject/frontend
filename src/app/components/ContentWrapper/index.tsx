import { Col, Row } from "antd";
import React, { ReactNode } from "react";

const ContentWrapper = ({ children }: { children: ReactNode }) => {
  return (
    <Row justify="center" style={{ background: "#141414" }}>
      <Col xs={24} sm={24} md={20} lg={7} xl={7} xxl={7}>
        <div>{children}</div>
      </Col>
    </Row>
  );
};

export default ContentWrapper;
