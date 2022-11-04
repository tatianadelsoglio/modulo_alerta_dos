/* eslint-disable no-unused-vars */
/* eslint-disable array-callback-return */
/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useContext } from "react";
import {
  Col,
  Row,
  Table,
  Button,
  Input,
  Space,
  Tooltip,
  Popover,
  Drawer,
} from "antd";
import { Fragment } from "react";
import "./styles.scss";
import { useState } from "react";
import { useHistory } from "react-router";
import { DealContext } from "../../context/DealCotext";
import {
  PushpinOutlined,
  SearchOutlined,
  ShareAltOutlined,
  UserAddOutlined,
} from "@ant-design/icons";
import { GET_NEGOCIOS_POR_EMBUDO } from "../../../Graphql/queries/negocios";
import { useQuery } from "@apollo/react-hooks";
import moment from "moment";
import { conversionMonedaBase } from "../../../utils/conversionMonedaBase";
import TagsItemTable from "../../tags/tagsItemTable";
import BannerHeader from "../pipeline/pipelineHeader/bannerHeader";
import PanelTop from "../pipeline/panelTop/paneltop";

const ViewTable = ({ setHistory }) => {
  const PORT = window.location.port ? window.location.port : 80;
  const PROTOCOL = window.location.protocol;
  const HOSTNAME = window.location.hostname;
  const loc = window.location.pathname;
  const DIR = loc.substring(0, loc.lastIndexOf("/"));
  const URL = `${PROTOCOL}//${HOSTNAME}:${PORT}`;

  const [dataDestacada, setDataDestacada] = useState([]);
  const [data, setData] = useState([]);
  const history = useHistory();
  const [sortedInfo, setSortedInfo] = useState({});
  const [cardsLength, setCardsLength] = useState();
  const [etapasParaFilter, setEtapasParaFilter] = useState({});
  const [drawerURL, setDrawerURL] = useState("");
  const {
    setDeal,
    setNegId,
    setEtaId,
    setView,
    idPipeline,
    setShowPanelTop,
    idMonConfig,
    cotizacionDolar,
    cotizacionReal,
    monIsoBase,
    idEstado,
    filterDate,
    filterIdUser,
    filterTypeDate,
    idUser,
    tagsListFilter,
    allSteps,
    filterCliente,
    filterDestacadas,
  } = useContext(DealContext);

  const [drawerConfig, setDrawerConfig] = useState({
    visible: false,
    idC: "",
    nombreC: "",
  });

  const { data: negocios } = useQuery(GET_NEGOCIOS_POR_EMBUDO, {
    variables: {
      idPipeline: idPipeline,
      idEstado,
      fechaDesde: filterDate ? filterDate[0] : null,
      fechaHasta: filterDate ? filterDate[1] : null,
      idUsuario: filterIdUser ? filterIdUser : idUser,
      tipoFecha: filterTypeDate,
      listadoEtiquetas: {
        listaIdEtiqueta: tagsListFilter,
      },
      usuarioFiltro: filterIdUser,
      idCliente: filterCliente,
    },
  });

  setHistory(history);

  useEffect(() => {
    setView("/table");
    if (!negocios) return;
    let c = [];
    let filtradosDestacados = [];

    const fullData = JSON.parse(negocios.getNegocioResolver);
    setCardsLength(fullData.dataNeg.length);

    const dataDestacado = fullData.elementosDestacados;

    fullData.dataNeg.map((item) => {
      const tags = fullData.dataTags.filter((tag) => {
        return tag.neg_id === item.neg_id;
      });

      const task = fullData.dataTask.filter((t) => {
        return t.neg_id === item.neg_id;
      });

      dataDestacado.filter((element) => {
        if (item.neg_id === element.neg_id) {
          filtradosDestacados.push(item);
        }
      });

      setData([...data, item]);
      const i = {
        ...item,
        key: String(item.neg_id),
        tags,
        task,
      };

      c.push(i);
    });

    setEtapasParaFilter(
      allSteps.map((item) => {
        return { value: item.eta_id, text: item.eta_nombre };
      })
    );

    c.sort((a, b) => a.neg_fechacierre.localeCompare(b.neg_fechacierre));

    setData(c);
    setDataDestacada(filtradosDestacados);
  }, [idPipeline, negocios, filterDestacadas]);

  const handleSearch = (selectedKeys, confirm, dataIndex) => {
    confirm();
  };

  const handleReset = (clearFilters, confirm) => {
    clearFilters();
    handleSearch([""], confirm);
  };

  const getColumnSearchProps = (dataIndex) => ({
    filterDropdown: ({
      setSelectedKeys,
      selectedKeys,
      confirm,
      clearFilters,
    }) => (
      <div style={{ padding: 8 }}>
        <Input
          placeholder={"Buscar ..."}
          value={selectedKeys[0]}
          onChange={(e) =>
            setSelectedKeys(e.target.value ? [e.target.value] : [])
          }
          onPressEnter={() => handleSearch(selectedKeys, confirm, dataIndex)}
          style={{ width: 188, marginBottom: 8, display: "block" }}
        />
        <Space>
          <Button
            type="primary"
            onClick={() => handleSearch(selectedKeys, confirm, dataIndex)}
            icon={<SearchOutlined />}
            size="small"
            style={{ width: 90 }}
          >
            Buscar
          </Button>
          <Button
            onClick={() => handleReset(clearFilters, confirm)}
            size="small"
            style={{ width: 90 }}
          >
            Reiniciar
          </Button>
        </Space>
      </div>
    ),
    filterIcon: (filtered) => (
      <SearchOutlined style={{ color: filtered ? "#1890ff" : undefined }} />
    ),
    onFilter: (value, record) =>
      record[dataIndex]
        ? record[dataIndex]
            .toString()
            .toLowerCase()
            .includes(value.toLowerCase())
        : "",
  });

  const handleChange = (pagination, filters, sorter) => {
    setSortedInfo(sorter);
  };

  const columns = [
    {
      title: "Etapa",
      onFilter: (value, record) => {
        return Number(record.eta_id) === Number(value);
      },
      key: "eta_id",
      ellipsis: true,
      responsive: ["xs", "sm", "md", "lg", "xl", "xxl"],
      align: "left",
      width: "10%",
      render: (data, all) => {
        let etapaActual = "";
        if (allSteps && allSteps.length > 0) {
          etapaActual = allSteps.filter((item) => {
            return Number(item.eta_id) === data.eta_id;
          });
        }

        return (
          <span>
            {etapaActual && etapaActual[0] && etapaActual[0].eta_nombre}
          </span>
        );
      },
    },
    {
      title: "Asunto",
      dataIndex: "neg_asunto",
      key: "neg_asunto",
      ellipsis: true,
      sorter: (a, b) => a.neg_asunto.localeCompare(b.neg_asunto),
      sortOrder: sortedInfo.columnKey === "neg_asunto" && sortedInfo.order,
      showSorterTooltip: true,
      render: (data, all) => {
        const esDestacado = dataDestacada.filter(
          (x) => x.neg_id === all.neg_id
        );
        switch (true) {
          case all.usu_asig_id !== all.usu_id:
            return (
              <Fragment>
                <div className="subjec_wrapper">
                  <Button
                    type="link"
                    onClick={() => onClickCard(all)}
                    style={{ padding: 0 }}
                  >
                    <Tooltip
                      title="Negocio Asignado"
                      color="#555"
                      mouseEnterDelay={1}
                    >
                      <UserAddOutlined
                        style={{ color: "#333", cursor: "help" }}
                      />
                    </Tooltip>

                    {esDestacado.length > 0 && (
                      <Tooltip
                        title="Elementos anclados"
                        color="#555"
                        mouseEnterDelay={1}
                      >
                        <PushpinOutlined
                          style={{
                            marginLeft: "5px",
                            color: "#fcba03",
                            cursor: "help",
                          }}
                        />
                      </Tooltip>
                    )}

                    {data}
                  </Button>
                  <div className="tags_table_wrapper">
                    {/* {all.tags.map((tag) => {
                      return <TagsItemTable color={tag.etq_color} />;
                    })} */}
                  </div>
                </div>
              </Fragment>
            );
          case all.tipo === 2:
            return (
              <Fragment>
                <div className="subjec_wrapper">
                  <Button
                    type="link"
                    onClick={() => onClickCard(all)}
                    style={{ padding: 0 }}
                  >
                    <Tooltip
                      title="Negocio compartido"
                      color="#555"
                      mouseEnterDelay={1}
                    >
                      <ShareAltOutlined
                        style={{ color: "#333", cursor: "help" }}
                      />
                    </Tooltip>
                    {data}
                  </Button>
                  <div className="tags_table_wrapper">
                    {all.tags.map((tag) => {
                      return <TagsItemTable color={tag.etq_color} />;
                    })}
                  </div>
                </div>
              </Fragment>
            );

          default:
            return (
              <Fragment>
                <div className="subjec_wrapper">
                  <Button
                    type="link"
                    onClick={() => onClickCard(all)}
                    style={{ padding: 0 }}
                  >
                    <Tooltip title="" color="#555" mouseEnterDelay={1}>
                      <ShareAltOutlined style={{ color: "white" }} />
                    </Tooltip>
                    {data}
                  </Button>
                  <div className="tags_table_wrapper">
                    {all.tags.map((tag) => {
                      return <TagsItemTable color={tag.etq_color} />;
                    })}
                  </div>
                </div>
              </Fragment>
            );
        }
      },

      responsive: ["xs", "sm", "md", "lg", "xl", "xxl"],
      ...getColumnSearchProps("neg_asunto"),
    },
    {
      title: "Valor",
      dataIndex: "neg_valor",
      key: "neg_valor",
      ellipsis: true,
      responsive: ["xs", "sm", "md", "lg", "xl", "xxl"],
      align: "right",
      width: "10%",
      render: (data, all) => {
        const formatoValor = data.toLocaleString("de-DE");
        return (
          <span>
            {all.mon_iso} {formatoValor}
          </span>
        );
      },
    },
    {
      title: "Conversión",
      dataIndex: "neg_valor",
      key: "neg_valor",
      sorter: (a, b) => a.neg_valor - b.neg_valor,
      sortOrder: sortedInfo.columnKey === "neg_valor" && sortedInfo.order,
      ellipsis: true,
      showSorterTooltip: true,
      responsive: ["xs", "sm", "md", "lg", "xl", "xxl"],
      align: "right",
      width: "8%",

      render: (data, all) => {
        const formatoValor = data.toLocaleString("de-DE");

        const valor = conversionMonedaBase(
          idMonConfig,
          all.mon_id,
          Number(data),
          cotizacionDolar,
          cotizacionReal
        );

        return (
          <span>
            {monIsoBase}{" "}
            {valor.toLocaleString("de-DE", { maximumFractionDigits: 2 })}
          </span>
        );
      },
    },

    {
      title: "Empresa",
      dataIndex: "cli_nombre",
      key: "cli_nombre",
      ellipsis: true,
      // sorter: (a, b) => a.cli_nombre.localeCompare(b.cli_nombre),
      sorter: (a, b) => a.cli_nombre.localeCompare(b.cli_nombre),
      sortOrder: sortedInfo.columnKey === "cli_nombre" && sortedInfo.order,
      showSorterTooltip: true,
      // width: '20%',
      responsive: ["xs", "sm", "md", "lg", "xl", "xxl"],
      ...getColumnSearchProps("cli_nombre"),
      render: (data, all) => {
        return (
          <div className="subjec_wrapper">
            <Button
              type="link"
              onClick={() => {
                setDrawerConfig({
                  visible: true,
                  idC: all.cli_id,
                  nombreC: all.cli_nombre,
                });
              }}
            >
              {data}
            </Button>
          </div>
        );
      },
    },

    {
      title: "Contacto",
      dataIndex: "con_nombre",
      key: "con_nombre",
      ellipsis: true,
      responsive: ["xs", "sm", "md", "lg", "xl", "xxl"],
      ...getColumnSearchProps("con_nombre"),
    },
    {
      title: "Usuario Asignado",
      dataIndex: "nombreUsuAsig",
      key: "nombreUsuAsig",
      sorter: (a, b) => a.nombreUsuAsig.localeCompare(b.nombreUsuAsig),
      sortOrder: sortedInfo.columnKey === "nombreUsuAsig" && sortedInfo.order,
      showSorterTooltip: true,
      ellipsis: true,
      responsive: ["xs", "sm", "md", "lg", "xl", "xxl"],
      ...getColumnSearchProps("nombreUsuAsig"),
    },
    {
      title: "Tareas",
      dataIndex: "task",
      key: "task",
      showSorterTooltip: true,
      ellipsis: true,
      responsive: ["xs", "sm", "md", "lg", "xl", "xxl"],
      width: "5%",
      render: (d, v) => {
        if (d && d.length > 0) {
          return <span>{d[0].cantTareas}</span>;
        } else {
          return <span>0</span>;
        }
      },
    },
    {
      title: "Fecha cierre",
      dataIndex: "neg_fechacierre",
      key: "neg_fechacierre",
      width: "8%",
      ellipsis: true,
      sorter: (a, b) => a.neg_fechacierre.localeCompare(b.neg_fechacierre),
      sortOrder: sortedInfo.columnKey === "neg_fechacierre" && sortedInfo.order,
      showSorterTooltip: true,
      render: (data, neg_id) => {
        const formatoFecha = moment(data).format("DD/MM/YYYY");
        return <span>{formatoFecha}</span>;
      },
    },
  ];

  const onChange = (pagination, filters, sorter) => {
    setSortedInfo(sorter);
  };

  const onClickCard = (neg) => {
    setDeal(neg);
    setNegId(neg.neg_id);
    setEtaId(neg.eta_id);
    history.push({
      pathname: `/deal/${neg.neg_id}?userId=1`,
      state: { name: "pipeline" },
    });
    setShowPanelTop(false);
  };

  return (
    <Fragment>
      <div className="view-wrapper">
        <PanelTop
          // totalAcumulado={totalAcumulado}
          // porcentajeTotal={porcentajeTotal}
          // cards={cards}
          // setDrawerName={setDrawerName}
          // setIdPipeline={setIdPipeline}
          // setSteps={setSteps}
          allSteps={allSteps}
          // steps={steps}
          idPipeline={idPipeline}
          history={history}
          // onClickNewPipeline={onClickNewPipeline}
          negLengthForTable={cardsLength}
        />
        <BannerHeader />

        <Row align="middle" justify="start">
          <Col xs={24}>
            {data && (
              <Table
                rowKey={"neg_id"}
                className="noSelect"
                size="small"
                columns={columns}
                dataSource={filterDestacadas ? dataDestacada : data}
                onChange={onChange}
              />
            )}
          </Col>
        </Row>
        <Drawer
          placement={"bottom"}
          title={drawerConfig.nombreC}
          height="600"
          closable={true}
          onClose={() =>
            setDrawerConfig({ visible: false, idC: "", nombreC: "" })
          }
          visible={drawerConfig.visible}
          key={"drawerNegociosClientes"}
        >
          <iframe
            loading="lazy"
            src={`${URL}/duoc/modulos/negocios_clientes/?idC=${drawerConfig.idC}`}
            width={"100%"}
            height={"620px"}
            style={{ border: "none" }}
            title="drawer"
          ></iframe>
        </Drawer>
      </div>
    </Fragment>
  );
};

export default ViewTable;
