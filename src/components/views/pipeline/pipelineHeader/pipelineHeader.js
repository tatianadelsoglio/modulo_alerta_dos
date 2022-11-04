import React, { Fragment } from "react";
import useWindowSize from "../../../../hook/useWindowSize";
import BannerHeader from "./bannerHeader";
import "./pipelineHeader.styles.scss";
import StepsSummary from "./stepsSummary";

const PipelineHeader = ({ steps, style, datosPorEtapa }) => {
  const size = useWindowSize();
  let width = {
    width: (size.width / steps.length) | 0,
  };

  return (
    <Fragment>
      <BannerHeader />
      <div className="card-header-wrapper">
        {steps.map((item) => {
          const { eta_id, eta_nombre } = item;

          return (
            <div
              key={eta_id}
              className="card-header"
              style={{ ...style, width: width.width }}
            >
              <p style={{ margin: 0, color: "black" }}>
                <strong>{eta_nombre}</strong>
              </p>
              <StepsSummary data={item} datosPorEtapa={datosPorEtapa} />
            </div>
          );
        })}
      </div>
    </Fragment>
  );
};

export default PipelineHeader;
