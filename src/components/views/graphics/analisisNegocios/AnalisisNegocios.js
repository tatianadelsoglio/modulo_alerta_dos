import { useQuery } from "@apollo/client";
import { Col, Row } from "antd";
import { useContext, useEffect, useState } from "react";
import {
  GET_G_BARRA_HORIZONTAL,
  GET_G_STACKED_ACA,
  GET_G_STACKED_PG,
  GET_G_TORTA_ACA,
  GET_G_TORTA_PG,
} from "../../../../Graphql/queries/graficos";
import PanelACA from "./panels/panelACA/PanelACA";
import PanelTotal from "./panels/panelTotal/PanelTotal";
import PanelPG from "./panels/panelPG/PanelPG";
import { DealContext } from "../../../context/DealCotext";

const AnalisisNegocios = () => {
  const { pipelineSelected, filterDate, filterTypeDate } =
    useContext(DealContext);

  const [dataGBarraHorizontal, setDataGBarraHorizontal] = useState();
  const [dataGTortaACA, setDataGTortaACA] = useState();
  const [dataGTortaPG, setDataGTortaPG] = useState();
  const [dataStackedACA, setDataStackedACA] = useState();
  const [dataStackedPG, setDataStackedPG] = useState();

  const { data: dataTotal } = useQuery(GET_G_BARRA_HORIZONTAL, {
    variables: {
      idPipeline: pipelineSelected,
      fechaDesde: filterDate[0],
      fechaHasta: filterDate[1],
      tipoFecha: filterTypeDate,
    },
  });
  const { data: tortaACA } = useQuery(GET_G_TORTA_ACA, {
    variables: {
      idPipeline: pipelineSelected,
      fechaDesde: filterDate[0],
      fechaHasta: filterDate[1],
      tipoFecha: filterTypeDate,
    },
  });
  const { data: tortaPG } = useQuery(GET_G_TORTA_PG, {
    variables: {
      idPipeline: pipelineSelected,
      fechaDesde: filterDate[0],
      fechaHasta: filterDate[1],
      tipoFecha: filterTypeDate,
    },
  });
  const { data: stackACA } = useQuery(GET_G_STACKED_ACA, {
    variables: { idPipeline: pipelineSelected },
  });
  const { data: stackPG } = useQuery(GET_G_STACKED_PG, {
    variables: { idPipeline: pipelineSelected },
  });

  useEffect(() => {
    if (stackPG) {
      setDataStackedPG(JSON.parse(stackPG.getGStackedPGResolver));
    }
  }, [stackPG]);

  useEffect(() => {
    if (stackACA) {
      setDataStackedACA(JSON.parse(stackACA.getGStackedACAResolver));
    }
  }, [stackACA]);

  useEffect(() => {
    if (dataTotal) {
      setDataGBarraHorizontal(
        JSON.parse(dataTotal.getGBarraHorizontalResolver)
      );
    }
  }, [dataTotal]);

  useEffect(() => {
    if (tortaACA) {
      setDataGTortaACA(JSON.parse(tortaACA.getGTortaACAResolver)[0]);
    }
  }, [tortaACA]);

  useEffect(() => {
    if (tortaPG) {
      setDataGTortaPG(JSON.parse(tortaPG.getGTortaPGResolver)[0]);
    }
  }, [tortaPG]);

  return (
    <Row gutter={[8, 16]}>
      <Col
        lg={8}
        md={12}
        sm={24}
        style={{ padding: "0px 4px", borderRadius: "5px" }}
      >
        <PanelTotal data={dataGBarraHorizontal} />
      </Col>
      <Col
        lg={8}
        md={12}
        sm={24}
        style={{ padding: "0px 4px", borderRadius: "5px" }}
      >
        <PanelACA data={dataGTortaACA} stackedData={dataStackedACA} />
      </Col>
      <Col
        lg={8}
        md={12}
        sm={24}
        style={{ padding: "0px 4px", borderRadius: "5px" }}
      >
        <PanelPG data={dataGTortaPG} stackedData={dataStackedPG} />
      </Col>
    </Row>
  );
};

export default AnalisisNegocios;
