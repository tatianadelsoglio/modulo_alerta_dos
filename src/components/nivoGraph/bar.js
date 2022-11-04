import React from "react";
// import { generateCountriesData } from '@nivo/generators';
import { ResponsiveBar } from "@nivo/bar";
import { Fragment } from "react";
import { Empty } from "antd";

const ChartBar = ({ keys, config, data, maxValueScale }) => {
  //
  return (
    <Fragment>
      {data.length > 0 ? (
        <ResponsiveBar
          data={data}
          keys={keys}
          {...config}
          // maxValue={maxValueScale ? maxValueScale : 50}
          maxValueScale={50}
        />
      ) : (
        <Empty />
      )}
    </Fragment>
  );
};

export default ChartBar;
