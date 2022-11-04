import { FundViewOutlined } from "@ant-design/icons";
import React, { Fragment, useContext, useState } from "react";
import { DealContext } from "../../../context/DealCotext";
import { Skeleton } from "antd";

const StepsSummary = ({ data, datosPorEtapa }) => {
  const { monIsoBase, loadingSuma } = useContext(DealContext);

  let total = 0;
  let avance = 0;
  let totalNegocios = [];
  let totalAvance = 0;

  if (datosPorEtapa && datosPorEtapa.length > 0) {
    totalNegocios = datosPorEtapa.filter(
      (etapa) => etapa.etapa === Number(data.eta_id)
    );

    if (totalNegocios.length > 0) {
      // por cada elemento de totalNegocios lo suma y lo setea en total

      totalNegocios.map((etapa) => (total = total + etapa.total));
    }
    totalAvance = datosPorEtapa.filter((etapa) => etapa.etapa === data.eta_id);
    if (totalAvance.length > 0) {
      //
      // por cada elemento de totalAvance lo setea en avance
      totalAvance.map((etapa) => (avance = avance + etapa.pctje));
    }
  } else {
    totalNegocios = [];
    totalAvance = 0;
    total = 0;
  }

  const [hover, setHover] = useState(true);

  const onMouseEnter = () => {
    //
    setHover(false);
  };
  const onMouseLeave = () => {
    //
    setHover(true);
  };

  return (
    <Fragment>
      {!loadingSuma && (
        <div onMouseEnter={onMouseEnter} onMouseLeave={onMouseLeave}>
          {hover ? (
            <p
              style={{ margin: 0, fontSize: 12, fontWeight: 400 }}
              className="card_header_value"
            >
              {" "}
              <span>
                <FundViewOutlined />
              </span>{" "}
              {data.eta_avance} % de {monIsoBase}{" "}
              {total.toLocaleString("de-DE", { maximumFractionDigits: 0 })} •{" "}
              {totalNegocios.length > 1
                ? `${totalNegocios.length} Negocios`
                : `${totalNegocios.length} Negocio`}{" "}
            </p>
          ) : (
            <p
              style={{ margin: 0, fontSize: 12, fontWeight: 400 }}
              className="card_header_value"
            >
              {" "}
              <span>
                <FundViewOutlined />
              </span>{" "}
              {monIsoBase}{" "}
              {((total * data.eta_avance) / 100).toLocaleString("de-DE", {
                maximumFractionDigits: 0,
              })}{" "}
              •{" "}
              {totalNegocios.length > 1
                ? `${totalNegocios.length} Negocios`
                : `${totalNegocios.length} Negocio`}{" "}
            </p>
          )}
        </div>
      )}
      {loadingSuma && (
        <Skeleton
          active={loadingSuma}
          className="skeleton"
          paragraph={{ rows: 0 }}
          style={{ width: 300 }}
        />
      )}
    </Fragment>
  );
};

export default StepsSummary;
