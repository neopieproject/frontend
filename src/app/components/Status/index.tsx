"use client";
import { Alert, Button, Typography } from "antd";
import React from "react";

interface StatusProps {
  stage: string;
  status: string;
  message?: string;
  onReset: () => void;
}
const Status = ({ stage, status, onReset }: StatusProps) => {
  return (
    <Alert
      type={["error", "success"].includes(status) ? status : ("info" as any)}
      message={
        <>
          <Typography.Text style={{ textTransform: "capitalize" }} strong>
            {stage}
          </Typography.Text>
          :{" "}
          <Typography.Text style={{ textTransform: "capitalize" }}>
            {status}
          </Typography.Text>
        </>
      }
      action={
        <Button color="default" variant="filled" onClick={onReset} size="small">
          Close
        </Button>
      }
    />
  );
};

export default Status;
