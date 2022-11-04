import { Card, Col, Empty, Row } from "antd";
import { ResponsiveFunnel } from "@nivo/funnel";
import { useQuery } from "@apollo/client";
import { GET_G_FUNNEL } from "../../../../Graphql/queries/graficos";
import { useContext, useEffect, useState } from "react";
import { DealContext } from "../../../context/DealCotext";
import "../../graphics/styles.funnel.scss";
import FunnelHeaderItem from "../funnelHeaderItem";
import FunnelHeader from "../funnelHeader";
import { GET_EMBUDOS } from "../../../../Graphql/queries/embudos";

const AnalisisEtapas = () => {
  const [pipelines, setPipelines] = useState([]);

  const {
    pipelineSelected,
    totalAcumulado,
    estadoSelected,
    currentTab,
    setPipelineSelected,
  } = useContext(DealContext);

  const { data: dataEmbudos } = useQuery(GET_EMBUDOS);

  useEffect(() => {
    if (dataEmbudos) {
      setPipelines(dataEmbudos.getPipelinesResolver);
    }
  }, [dataEmbudos]);

  useEffect(() => {
    //* Gestiona id embudo inicial para la tab 2, -1 para el tab 1
    if (currentTab === "2") {
      if (pipelines && pipelines.length > 0) {
        setPipelineSelected(Number(pipelines[0].pip_id));
      }
    } else {
      setPipelineSelected(-1);
    }
  }, [pipelines, currentTab]);

  const { data } = useQuery(GET_G_FUNNEL, {
    variables: { idPipeline: pipelineSelected, estado: estadoSelected },
  });
  const [funnelData, setFunnelData] = useState([]);
  const [cantNegocios, setCantNegocios] = useState(0);

  useEffect(() => {
    if (data) {
      const dataFunnel = JSON.parse(data.getGFunnelResolver);
      if (dataFunnel) {
        let cantTotalNegocios = 0;
        let cantTotalU$S = 0;
        const dataFinal = dataFunnel.map((item) => {
          cantTotalNegocios = cantTotalNegocios + item.cantNegocios;
          cantTotalU$S = cantTotalU$S + item.total;

          return {
            id: item.eta_id,
            value: item.cantNegocios,
            label: item.eta_nombre,
          };
        });
        setCantNegocios(cantTotalNegocios);
        setFunnelData(dataFinal);
      }
    }
  }, [data]);

  return (
    <>
      <Row gutter={[12]}>
        <Col span={6}>
          <Card>
            U$S{" "}
            {totalAcumulado.toLocaleString("de-DE", {
              maximumFractionDigits: 0,
            })}
          </Card>
        </Col>
        <Col span={6}>
          <Card>Cantidad de negocios {cantNegocios}</Card>
        </Col>
      </Row>

      <div className="funnel_wrapper_graph">
        {funnelData && funnelData.length > 0 ? (
          <>
            <FunnelHeader>
              {funnelData && (
                <FunnelHeaderItem
                  data={funnelData}
                  total={cantNegocios}
                  maxLength={funnelData.length}
                />
              )}
            </FunnelHeader>

            <ResponsiveFunnel
              data={funnelData}
              shapeBlending={0}
              margin={{ top: 20, right: 20, bottom: 20, left: 20 }}
              direction="horizontal"
              valueFormat=">-.4"
              colors={{ scheme: "spectral" }}
              labelColor={{
                from: "color",
                modifiers: [["darker", 3]],
              }}
              beforeSeparatorLength={100}
              beforeSeparatorOffset={20}
              afterSeparatorLength={100}
              afterSeparatorOffset={20}
              currentPartSizeExtension={10}
              currentBorderWidth={40}
              animate={false}
              motionConfig="molasses"
            />
          </>
        ) : (
          <Empty />
        )}
      </div>
    </>
  );
};

export default AnalisisEtapas;
