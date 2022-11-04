import React, { useContext } from "react";
import { Tabs } from "antd";
import BannerHeader from "../pipeline/pipelineHeader/bannerHeader";
import AnalisisNegocios from "./analisisNegocios/AnalisisNegocios";
import AnalisisEtapas from "./analisisEtapas/AnalisisEtapas";
import "./styles.funnel.scss";
import FunnelView from "./funnel";
import { DealContext } from "../../context/DealCotext";

const Graphics = ({ idPipeline, totalDeals }) => {
  const { setCurrentTab } = useContext(DealContext);

  return (
    <div>
      <BannerHeader />
      <div className="funnel_wrapper">
        {/* <FunnelView
          idPipeline={idPipeline}
          totalDeals={totalDeals}
        ></FunnelView> */}
        <Tabs defaultActiveKey="1" onChange={(v) => setCurrentTab(v)}>
          <Tabs.TabPane tab="ANALISIS DE NEGOCIOS" key="1">
            <AnalisisNegocios />
          </Tabs.TabPane>
          <Tabs.TabPane tab="ANALISIS DE ETAPAS" key="2">
            <AnalisisEtapas />
          </Tabs.TabPane>
        </Tabs>
      </div>
    </div>
  );
};

export default Graphics;
