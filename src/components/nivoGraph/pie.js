import React from "react";
// import { generateCountriesData } from '@nivo/generators';
import { ResponsivePie } from "@nivo/pie";
import { Fragment } from "react";
import { Empty } from "antd";

const ChartPie = ({ config, data }) => {
  return (
    <Fragment>
      {data ? <ResponsivePie data={data} {...config} /> : <Empty />}
    </Fragment>
  );
};

export default ChartPie;
