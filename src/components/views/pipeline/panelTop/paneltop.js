/* eslint-disable no-unused-vars */
/* eslint-disable array-callback-return */
/* eslint-disable react-hooks/exhaustive-deps */
import React, { Fragment, useEffect, useContext, useState } from "react";
import {
  Alert,
  Button,
  Drawer,
  Dropdown,
  Menu,
  Popover,
  Select,
  Skeleton,
  Space,
  Switch,
  Tooltip,
} from "antd";
import "./paneltop.style.scss";
import {
  MenuOutlined,
  PlusOutlined,
  ProjectOutlined,
  FunnelPlotOutlined,
  AreaChartOutlined,
  SettingOutlined,
  EditOutlined,
  DownOutlined,
  PushpinOutlined,
} from "@ant-design/icons";

import { GET_EMBUDOS } from "../../../../Graphql/queries/embudos";
import { DrawerContext } from "../../../context/DrawContext";
import { DealContext } from "../../../context/DealCotext";
import Filters from "../../../forms/filters";
import { useQuery } from "@apollo/react-hooks";
import AddConfig from "../../../forms/addConfig";
import Info from "../../../info";
import {
  GET_ETAPAS_POR_ID,
  GET_ETAPAS_SUMA,
} from "../../../../Graphql/queries/etapas";
import moment from "moment";
import EditPipelineAndSteps from "../../../forms/EditPipelineAndSteps";
import { useHistory, useLocation } from "react-router";
import AnalyticsFilter from "../../../forms/AnalyticsFilter";

const PanelTop = ({
  steps,
  // cards,
  onClickNewPipeline,
  negLengthForTable,
}) => {
  const history = useHistory();

  // , onClose, showChildrenDrawer, onChildrenDrawerClose, stateDrawer

  // const [negocios, setNegocios] = useState(cards.length);
  // const [show, setShow] = useState(false);

  const Option = Select.Option;

  const [drawerVisible, setDrawerVisible] = useState(false);
  const [embudos, setEmbudos] = useState([]);

  const [filterDrawer, setFilterDrawer] = useState(false);

  const { showDrawer, setDrawerName } = useContext(DrawerContext);
  const {
    filterCliente,
    idUser,
    idPipeline,
    setIdPipeline,
    setPipelineName,
    pipelineName,
    autorizado,
    showFilter,
    setShowFilter,
    totalAcumulado,
    porcentajeTotal,
    monIsoBase,
    setReloadingApp,
    cotizacionDolar,
    cotizacionReal,
    fechaCotizacion,
    setAllSteps,
    setDatosPorEtapa,
    setTotalAcumulado,
    setPorcentajeTotal,
    idEstado,
    filterDate,
    filterTypeDate,
    filterIdUser,
    tagsListFilter,
    dealNumber,
    setDealNumber,
    setEtapasFinal,
    setPipelineSpin,
    setEtapasFlag,
    loadingHeader,
    setLoadingHeader,
    setPollValoresEtapa,
    setTotalNegociosPorEtapa,
    setPollEtapas,
    cards,

    setFilterDestacadas,
  } = useContext(DealContext);

  const location = useLocation();

  const {
    data: etapasPorId,
    startPolling: startEtaPolling,
    stopPolling: stopEtaPolling,
  } = useQuery(GET_ETAPAS_POR_ID, {
    variables: { id: idPipeline },
  });

  const { data } = useQuery(GET_EMBUDOS);

  const {
    data: getEtapasSuma,
    startPolling,
    stopPolling,
  } = useQuery(GET_ETAPAS_SUMA, {
    variables: {
      idEstado,
      fechaDesde: filterDate ? filterDate[0] : null,
      fechaHasta: filterDate ? filterDate[1] : null,
      idPipeline,
      idUsuario: filterIdUser ? filterIdUser : idUser,
      tipoFecha: filterTypeDate,
      listadoEtiquetas: {
        listaIdEtiqueta: tagsListFilter,
      },
      usuarioFiltro: null,
      idCliente: filterCliente,
    },
  });

  useEffect(() => {
    setPollValoresEtapa({ initial: startPolling, close: stopPolling });
    setPollEtapas({ initial: startEtaPolling, close: stopEtaPolling });

    setTimeout(() => {
      setLoadingHeader(false);
    }, 1500);

    if (!data) return;
    setReloadingApp(true);

    if (getEtapasSuma) {
      // recibe la info que necesita StepHeader

      let allData = JSON.parse(getEtapasSuma.getEtapasSumResolver);

      setAllSteps(etapasPorId.getEtapaPorIdResolver);

      if (etapasPorId.getEtapaPorIdResolver.length > 0) {
        setEtapasFlag(true);
      } else {
        setEtapasFlag(false);
      }

      setEtapasFinal(etapasPorId.getEtapaPorIdResolver);

      if (allData) {
        // setAllSteps(allData.data);

        setTotalNegociosPorEtapa(allData.data);
        setDatosPorEtapa(allData.datosPorEtapa);
        setTotalAcumulado(allData.totalAcumulado);
        setPorcentajeTotal(allData.porcentajeTotal);
      }

      setReloadingApp(false);
    }

    if (cards) {
      setDealNumber(cards.length);
    }

    if (data && data.getPipelinesResolver.length > 0) {
      setEmbudos(data.getPipelinesResolver);
      const embudoSeleccionado = data.getPipelinesResolver.filter((item) => {
        if (Number(item.pip_id) === idPipeline) return item;
      });

      setPipelineName(embudoSeleccionado[0].pip_nombre);
    }
  }, [
    getEtapasSuma,
    idPipeline,
    idEstado,
    filterDate,
    idPipeline,
    idUser,
    filterTypeDate,
    tagsListFilter,
    etapasPorId,
    filterIdUser,
  ]);

  const onChange = (value) => {
    setLoadingHeader(true);
    if (value !== "editar") {
      //! solo carga cuando se cambia de embudo, si elegi editar no hay spin
      setPipelineSpin(2);
      setIdPipeline(Number(value));
      let pipeline = data.getPipelinesResolver.find(
        (pipeline) => pipeline.pip_id === value
      );
      setPipelineName(pipeline.pip_nombre);
    } else {
      setDrawerVisible(true);
    }
  };

  const dinamicSelect = (embudoSeleccionado) => {
    return (
      <Fragment>
        {data.getPipelinesResolver.length > 0 && (
          <Select
            showSearch
            style={{ width: 200 }}
            placeholder="Embudo"
            optionFilterProp="children"
            onChange={onChange}
            onFocus={onFocus}
            onBlur={onBlur}
            onSearch={onSearch}
            // value={pi}
            value={embudoSeleccionado}
            // filterOption={(input, option) =>
            //   option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
            // }
          >
            {data &&
              data.getPipelinesResolver.map((pipeline) => {
                const { pip_id, pip_nombre } = pipeline;
                return (
                  <Option key={pip_id} value={pip_id}>
                    {pip_nombre}
                  </Option>
                );
              })}

            {autorizado && (
              <Option key={"editar"} value={"editar"}>
                <span style={{ color: "#00b33c" }}>
                  <EditOutlined /> EDITAR EMBUDOS
                </span>
              </Option>
            )}
          </Select>
        )}
      </Fragment>
    );
  };

  function onBlur() {}

  function onFocus() {}

  function onSearch(val) {}

  const toggleDrawer = () => {
    setDrawerName("Agregar Negocio");
    showDrawer();
  };

  const handleNegocioMasivo = () => {
    setDrawerName("Negocio Masivo");
    showDrawer();
  };

  const onTableView = () => {
    setFilterDestacadas(false);
    history.push(`/table?userId=${idUser}`);
  };
  const onPipelineView = () => {
    setFilterDestacadas(false);
    history.push(`/?userId=${idUser}`);
  };
  const onGraphicView = () => {
    setFilterDestacadas(false);
    history.push(`/funnel?userId=${idUser}`);
  };

  const onClickFilter = () => {
    setShowFilter(!showFilter);
  };

  const infoCotizacion = () => {
    // Devuelve el componente correspondiente según la moneda base.

    switch (monIsoBase) {
      case "AR$":
        //1. Si la moneda base es Pesos: moneda 1 = Dolar, moneda2= Real , cotizacion1=cotizacionDolar, Cotizacion2=Cotizacion real
        return cotizacionSegunMonedaBase(
          "1 USD =",
          "1 BRL =",
          cotizacionDolar,
          cotizacionReal
        );

      //2. Si la moneda base es Dolares:Moneda 1= AR$ moneda= 2 BRL, 1/cotizacion dolar , cotizacionReal/cotizacionDolar
      case "USD":
        return cotizacionSegunMonedaBase(
          "1 AR$ =",
          "1 BRL =",
          1 / cotizacionDolar,
          cotizacionReal / cotizacionDolar
        );
      //3. Si la moneda base es REAL:Moneda 1= AR$ moneda= 2 USD, 1/cotizacionReal , 1/cotizacionReal*cotizacionDolar
      case "BRL":
        return cotizacionSegunMonedaBase(
          "1 AR$ =",
          "1 USD =",
          1 / cotizacionReal,
          (1 / cotizacionReal) * cotizacionDolar
        );

      default:
        break;
    }
  };

  const cotizacionSegunMonedaBase = (
    moneda1,
    moneda2,
    cotizacion1,
    cotizacion2
  ) => {
    return (
      <div className="cotizaciones">
        {cotizacion2 ? (
          <Fragment>
            <p>
              <span className="cotizacion">{moneda1}</span> {`${monIsoBase} `}{" "}
              {cotizacion1.toLocaleString("de-DE", {
                maximumFractionDigits: 2,
              })}
            </p>
            <p>
              <span className="cotizacion">{moneda2}</span> {`${monIsoBase} `}{" "}
              {cotizacion2.toLocaleString("de-DE", {
                maximumFractionDigits: 2,
              })}
            </p>
            <p className="info_data">
              Ultima actualizacion:{" "}
              <strong>
                {moment(fechaCotizacion).format("DD/MM/YYYY HH:mm")} hs
              </strong>
            </p>
          </Fragment>
        ) : (
          <p className="info_data">
            Momentaneamente el servicio de cotizaciones se encuentra{" "}
            <strong>suspendido.</strong>
          </p>
        )}
      </div>
    );
  };

  const menu = (
    <Menu
      onClick={(v) => {
        switch (true) {
          case v.key === "1":
            toggleDrawer();
            break;
          case v.key === "2":
            handleNegocioMasivo();
            break;
          default:
            break;
        }
      }}
      items={[
        {
          label: "Negocio",
          key: "1",
          // icon: <PlusOutlined />,
        },
        {
          label: "Negocio masivo",
          key: "2",
          // icon: <PlusOutlined />,
        },
      ]}
    />
  );

  return (
    <Fragment>
      <div className="top-panel-wrapper">
        <div className="top-panel-buttons">
          <div className="filter-data">
            {location.pathname !== "/funnel" && (
              <Fragment>
                {loadingHeader ? (
                  <Skeleton
                    className="skeleton"
                    paragraph={{ rows: 0 }}
                    style={{ width: 300 }}
                  />
                ) : (
                  <>
                    <span style={{ fontWeight: 700 }}>
                      {monIsoBase}{" "}
                      {totalAcumulado
                        ? totalAcumulado.toLocaleString("de-DE", {
                            maximumFractionDigits: 0,
                          })
                        : 0}{" "}
                      &bull;{" "}
                    </span>
                    <span style={{ fontWeight: 700 }}>
                      {monIsoBase}{" "}
                      {porcentajeTotal
                        ? porcentajeTotal.toLocaleString("de-DE", {
                            maximumFractionDigits: 0,
                          })
                        : 0}{" "}
                      &bull;
                    </span>{" "}
                    <span style={{ fontWeight: 700 }}>
                      {cards || negLengthForTable > 1
                        ? `${negLengthForTable || cards.length} Negocios`
                        : `${negLengthForTable || cards.length} Negocio`}{" "}
                    </span>
                    <Info
                      title={`Cotización ${monIsoBase}`}
                      placement="rightTop"
                    >
                      {infoCotizacion()}
                    </Info>
                  </>
                )}
              </Fragment>
            )}
          </div>
        </div>
        <div className="top-panel-filters">
          {autorizado && location.pathname !== "/funnel" && (
            <Tooltip title="Ver destacados">
              <Switch
                style={{ marginRight: "10px" }}
                defaultChecked={false}
                onChange={(v) => {
                  setFilterDestacadas(v);
                  setPipelineSpin(1);
                }}
                checkedChildren={<PushpinOutlined />}
                unCheckedChildren={<PushpinOutlined />}
              />
            </Tooltip>
          )}
          {data &&
            location.pathname !== "/funnel" &&
            dinamicSelect(pipelineName)}

          {autorizado && location.pathname !== "/funnel" && (
            <Button
              onClick={onClickNewPipeline}
              type="primary"
              icon={<FunnelPlotOutlined />}
              style={{ marginLeft: "10px" }}
            >
              Nuevo Embudo
            </Button>
          )}

          <Button onClick={onPipelineView} style={{ marginLeft: 8 }}>
            <ProjectOutlined />
          </Button>
          <Button onClick={onTableView}>
            <MenuOutlined />
          </Button>
          <Button onClick={onGraphicView}>
            <AreaChartOutlined />
          </Button>
          {location.pathname !== "/funnel" && (
            <Dropdown overlay={menu} trigger={"click"}>
              <Button
                type="primary"
                // onClick={handleNegocioMasivo}
                style={{ marginLeft: 5 }}
              >
                <Space>
                  <PlusOutlined />
                  Negocio
                  <DownOutlined />
                </Space>
              </Button>
            </Dropdown>
          )}

          <Button
            style={{ marginLeft: 4 }}
            type="ghost"
            onClick={() => setFilterDrawer(!filterDrawer)}
          >
            Filtros
          </Button>
          {autorizado && location.pathname !== "/funnel" && (
            <Popover
              placement="bottomRight"
              title={"Configuración"}
              content={AddConfig}
              trigger="click"
            >
              <Button
                style={{ marginLeft: 4 }}
                type="ghost"
                onClick={onClickFilter}
              >
                <SettingOutlined />
              </Button>
            </Popover>
          )}
        </div>
        <EditPipelineAndSteps
          setVisible={setDrawerVisible}
          visible={drawerVisible}
          embudos={embudos}
        />

        <Drawer
          visible={filterDrawer}
          onClose={() => setFilterDrawer(false)}
          width={400}
        >
          {location.pathname === "/funnel" ? <AnalyticsFilter /> : <Filters />}
        </Drawer>
      </div>
    </Fragment>
  );
};

export default PanelTop;
