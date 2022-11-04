import { Empty } from "antd";
import React from "react";
import { Fragment } from "react";
import { ResponsiveFunnel } from "@nivo/funnel";

const FunnelChart = ({ config, data }) => {
  return (
    <Fragment>
      {data && data.length > 0 ? (
        <ResponsiveFunnel data={data} {...config} />
      ) : (
        <Empty />
      )}
    </Fragment>
  );
};

export default FunnelChart;
