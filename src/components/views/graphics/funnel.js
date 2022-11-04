/* eslint-disable array-callback-return */
/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-unused-vars */
import React, { useEffect, useContext, useState } from "react";
import {
  GET_BARRA_APILADA_ABIERTOS_CERRADOS,
  GET_GRAFICOS,
  GET_TORTA_ABIERTOS_CERRADOS,
  GET_TORTA_GANADOS_PERDIDOS,
  GET_BARRA_APILADA_GANADOS_PERDIDOS,
  GET_ALL_DATA_GRAFICOS,
  GET_ALL_DATA_GRAFICOS_GANADOS_PERDIDOS,
} from "../../../Graphql/queries/graficos";
import { DealContext } from "../../context/DealCotext";
import { useQuery } from "@apollo/react-hooks";
import ChartBar from "../../nivoGraph/bar";
import { Fragment } from "react";
import FunnelHeader from "./funnelHeader";
import FunnelHeaderItem from "./funnelHeaderItem";
import {
  barConfig,
  funnelConfig,
  pieChartConfig,
} from "../../nivoGraph/nivoConfig";
import { Row, Col, Card, Skeleton, Spin } from "antd";
import FunnelChart from "../../nivoGraph/funnel";
import ChartPie from "../../nivoGraph/pie";
import { maxValueScaleCalculate } from "../../../utils/maxValueScaleCalculate";
import { GET_NEGOCIOS_POR_EMBUDO } from "../../../Graphql/queries/negocios";

const FunnelView = ({ totalDeals }) => {
  const {
    idUser,
    idEstado,
    filterDate,
    filterTypeDate,
    dealNumber,
    filterIdUser,
    totalAcumulado,
    monIsoBase,
    porcentajeTotal,
    cards,
    allSteps,
    loadingSuma,
    setEtaId,
    setEtaPreviaId,
    setNegId,
    newHistorialNegocioResolver,
    updateEtapaxNegocioResolver,
    setDeal,
    deal,
    idPipeline,
    setLoadingSuma,
    setCards,
    tagsListFilter,
    pipelineSpin,
    setPipelineSpin,
    pipelineFlag,
    etapasFlag,
    loadingHeader,
    setLoadingHeader,
    filterCliente,
  } = useContext(DealContext);
  const [dataPieCerradosAbiertos, setDataPieCerradosAbiertos] = useState([]);
  const [dataPieGanadosPerdidos, setDataPieGanadosPerdidos] = useState([]);
  const [dataBarAbiertosCerrados, setDataBarAbiertosCerrados] = useState([]);
  const [dataBarGanadosPerdidos, setDataBarGanadosPerdidos] = useState([]);

  const [cantNegocios, setCantNegocios] = useState(0);
  const [montoTotalNegocios, setMontoTotalNegocios] = useState(0);

  const [funnelData, setFunnelData] = useState([]);

  const { data, loading, refetch } = useQuery(GET_GRAFICOS, {
    variables: {
      idPipeline: idPipeline,
      idUsuario: filterIdUser ? filterIdUser : idUser,
      idEstado,
      fechaDesde: filterDate ? filterDate[0] : "",
      fechaHasta: filterDate ? filterDate[1] : "",
      tipoFecha: filterTypeDate,
    },
    // fetchPolicy: "network-only",
  });

  const { data: dataTorta } = useQuery(GET_TORTA_ABIERTOS_CERRADOS, {
    variables: {
      idPipeline: idPipeline,
      idUsuario: filterIdUser ? filterIdUser : idUser,
      fechaDesde: filterDate ? filterDate[0] : "",
      fechaHasta: filterDate ? filterDate[1] : "",
      tipoFecha: filterTypeDate,
    },
  });
  const { data: dataTortaGanadosPerdidos } = useQuery(
    GET_TORTA_GANADOS_PERDIDOS,
    {
      variables: {
        idPipeline: idPipeline,
        idUsuario: filterIdUser ? filterIdUser : idUser,
        fechaDesde: filterDate ? filterDate[0] : "",
        fechaHasta: filterDate ? filterDate[1] : "",
        tipoFecha: filterTypeDate,
      },
    }
  );
  const { data: dataBarraApiladaAbiertosCerrados } = useQuery(
    GET_BARRA_APILADA_ABIERTOS_CERRADOS,
    {
      variables: {
        idPipeline: idPipeline,
        idUsuario: filterIdUser ? filterIdUser : idUser,
        fechaDesde: filterDate ? filterDate[0] : "",
        fechaHasta: filterDate ? filterDate[1] : "",
        tipoFecha: filterTypeDate,
      },
    }
  );
  const { data: dataBarraApiladaGanadosPerdidos } = useQuery(
    GET_BARRA_APILADA_GANADOS_PERDIDOS,
    {
      variables: {
        idPipeline: idPipeline,
        idUsuario: filterIdUser ? filterIdUser : idUser,
        fechaDesde: filterDate ? filterDate[0] : "",
        fechaHasta: filterDate ? filterDate[1] : "",
        tipoFecha: filterTypeDate,
      },
    }
  );

  const { data: dataNegocios } = useQuery(GET_NEGOCIOS_POR_EMBUDO, {
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
      idCliente: filterCliente,
      usuarioFiltro: filterIdUser,
    },
    // pollInterval: 500,
  });

  const { data: allDataGraficos } = useQuery(GET_ALL_DATA_GRAFICOS, {
    variables: {
      idPipeline: idPipeline,
      idEstado,
      fechaDesde: filterDate ? filterDate[0] : null,
      fechaHasta: filterDate ? filterDate[1] : null,
      idUsuario: idUser,
      tipoFecha: filterTypeDate,
      listadoEtiquetas: {
        listaIdEtiqueta: tagsListFilter,
      },
    },
  });

  const { data: allDataGraficosGanadosPerdidos } = useQuery(
    GET_ALL_DATA_GRAFICOS_GANADOS_PERDIDOS,
    {
      variables: {
        idPipeline: idPipeline,
        idEstado,
        fechaDesde: filterDate ? filterDate[0] : null,
        fechaHasta: filterDate ? filterDate[1] : null,
        idUsuario: idUser,
        tipoFecha: filterTypeDate,
        listadoEtiquetas: {
          listaIdEtiqueta: tagsListFilter,
        },
      },
    }
  );

  useEffect(() => {
    if (allDataGraficos && allDataGraficosGanadosPerdidos) {
      const data = JSON.parse(allDataGraficos.getDataAllGraficosResolver);

      const dataGanadosPerdidos = JSON.parse(
        allDataGraficosGanadosPerdidos.getDataAllGraficosGanadosPerdidosResolver
      );

      const idUsuarios = data.map((item) => {
        return item.usu_asig_id;
      });

      const listadoUsuariosAbiertosCerrados = [...new Set(idUsuarios)];

      const idUsuariosGanadosPerdidos = dataGanadosPerdidos.map((item) => {
        return item.usu_asig_id;
      });

      const listadoUsuariosGanadosPerdidos = [
        ...new Set(idUsuariosGanadosPerdidos),
      ];

      determinarGraficosAbiertosCerrados(listadoUsuariosAbiertosCerrados, data);

      determinarGraficosGanadosPerdidos(
        listadoUsuariosGanadosPerdidos,
        dataGanadosPerdidos
      );
    }

    if (dataNegocios) {
      const fullData = JSON.parse(dataNegocios.getNegocioResolver);

      setCantNegocios(fullData.dataNeg.length);
      let suma = 0;

      fullData.dataNeg.map((item) => {
        suma = suma + item.neg_valor;
      });

      setMontoTotalNegocios(suma);
    }

    if (dataNegocios) {
      const negocios = JSON.parse(dataNegocios.getNegocioResolver);
      setFunnelData(
        allSteps.map((item) => {
          const cantNegocios = negocios.dataNeg.filter(
            (neg) => Number(neg.eta_id) === Number(item.eta_id)
          );
          let temp = {
            id: item.eta_nombre,
            value: cantNegocios.length,
            label: item.eta_nombre,
            percent: (cantNegocios.length * 100) / totalDeals,
          };

          return temp;
        })
      );
    }
  }, [
    idPipeline,
    data,
    tagsListFilter,
    filterTypeDate,
    idEstado,
    dataNegocios,
    allDataGraficos,
    allDataGraficosGanadosPerdidos,
  ]);

  const determinarGraficosGanadosPerdidos = (listadoUsuarios, data) => {
    let dataAgrupadaGanadosPerdidos = [];

    listadoUsuarios.map((usuario) => {
      const dataPorUsuario = data.filter(
        (item) => item.usu_asig_id === usuario
      );

      let cantidadAbiertos = [];
      let cantidadCerrados = [];

      let numeroAbiertos = 0;
      let numeroCerrados = 0;

      cantidadAbiertos = dataPorUsuario.filter((item) => {
        return item.ganados > 0;
      });

      cantidadCerrados = dataPorUsuario.filter((item) => {
        return item.perdidos > 0;
      });

      if (cantidadAbiertos.length > 0) {
        numeroAbiertos = cantidadAbiertos[0].ganados;
      }

      if (cantidadCerrados.length > 0) {
        numeroCerrados = cantidadCerrados[0].perdidos;
      }

      let temp = {};

      temp = {
        Ganados: numeroAbiertos,
        Perdidos: numeroCerrados,
        total: numeroAbiertos + numeroCerrados,
        usuario: dataPorUsuario[0].usu_nombre,
        idUsuario: dataPorUsuario[0].usu_asig_id,
      };

      dataAgrupadaGanadosPerdidos.push(temp);
    });

    let abiertosAcumulado = 0;
    let cerradosAcumulado = 0;

    let sumatoria = 0;

    dataAgrupadaGanadosPerdidos.map((item) => {
      if (item.Ganados > 0) {
        abiertosAcumulado = abiertosAcumulado + item.Ganados;
      }
      if (item.Perdidos > 0) {
        cerradosAcumulado = cerradosAcumulado + item.Perdidos;
      }
    });

    sumatoria = abiertosAcumulado + cerradosAcumulado;

    let pctGanados = (100 * abiertosAcumulado) / sumatoria;
    let pctPerdidos = (100 * cerradosAcumulado) / sumatoria;

    let dataGanadosPerdidosPie = [
      {
        id: `Ganados (${Math.round(pctGanados)}%)`,
        label: "Ganados",
        color: "#333333",
        value: abiertosAcumulado,
      },
      {
        id: `Perdidos (${Math.round(pctPerdidos)}%)`,
        label: "Perdidos",
        value: cerradosAcumulado,
      },
    ];

    setDataBarGanadosPerdidos(dataAgrupadaGanadosPerdidos);
    setDataPieGanadosPerdidos(dataGanadosPerdidosPie);
  };

  const determinarGraficosAbiertosCerrados = (listadoUsuarios, data) => {
    let dataAgrupadaAbiertosCerrados = [];

    listadoUsuarios.map((usuario) => {
      const dataPorUsuario = data.filter(
        (item) => item.usu_asig_id === usuario
      );

      let cantidadAbiertos = [];
      let cantidadCerrados = [];

      let numeroAbiertos = 0;
      let numeroCerrados = 0;

      cantidadAbiertos = dataPorUsuario.filter((item) => {
        return item.abiertos > 0;
      });

      cantidadCerrados = dataPorUsuario.filter((item) => {
        return item.cerrados > 0;
      });

      if (cantidadAbiertos.length > 0) {
        numeroAbiertos = cantidadAbiertos[0].abiertos;
      }

      if (cantidadCerrados.length > 0) {
        numeroCerrados = cantidadCerrados[0].cerrados;
      }

      let temp = {};

      temp = {
        Abiertos: numeroAbiertos,
        Cerrados: numeroCerrados,
        total: numeroAbiertos + numeroCerrados,
        usuario: dataPorUsuario[0].usu_nombre,
        idUsuario: dataPorUsuario[0].usu_asig_id,
      };

      dataAgrupadaAbiertosCerrados.push(temp);
    });

    let abiertosAcumulado = 0;
    let cerradosAcumulado = 0;

    let sumatoria = 0;

    dataAgrupadaAbiertosCerrados.map((item) => {
      if (item.Abiertos > 0) {
        abiertosAcumulado = abiertosAcumulado + item.Abiertos;
      }
      if (item.Cerrados > 0) {
        cerradosAcumulado = cerradosAcumulado + item.Cerrados;
      }
    });

    sumatoria = abiertosAcumulado + cerradosAcumulado;

    let pctAbiertos = (100 * abiertosAcumulado) / sumatoria;
    let pctCerrados = (100 * cerradosAcumulado) / sumatoria;

    let dataAbiertosPerdidosPie = [
      {
        id: `Abiertos (${Math.round(pctAbiertos)}%)`,
        label: "Abiertos",
        color: "#333333",
        value: abiertosAcumulado,
      },
      {
        id: `Cerrados (${Math.round(pctCerrados)}%)`,
        label: "Cerrados",
        value: cerradosAcumulado,
      },
    ];

    setDataBarAbiertosCerrados(dataAgrupadaAbiertosCerrados);
    setDataPieCerradosAbiertos(dataAbiertosPerdidosPie);
  };

  useEffect(() => {
    setAbiertosCerrados();
    setGanadosPerdidos();
    setBarraApiladaAbiertoCerrado();
    setBarraApiladaGanadosPerdidios();

    setTimeout(() => {
      setLoadingHeader(false);
    }, 3500);
  }, [
    idPipeline,
    idUser,
    idEstado,
    filterDate,
    filterTypeDate,
    dataTorta,
    dataTortaGanadosPerdidos,
    dataBarraApiladaGanadosPerdidos,
    dataBarraApiladaAbiertosCerrados,
    allDataGraficos,
    allDataGraficosGanadosPerdidos,
    cards,
    funnelData,
  ]);
  if (loading) return "";

  function setBarraApiladaAbiertoCerrado() {
    if (dataBarraApiladaAbiertosCerrados !== undefined) {
      if (
        !JSON.parse(
          dataBarraApiladaAbiertosCerrados.getBarraApiladaAbiertosCerradosResolver
        )
      ) {
        setDataBarAbiertosCerrados([]);
        return;
      }
      // Solicita la data de la query.
      const dataNegociosPorUsuario = JSON.parse(
        dataBarraApiladaAbiertosCerrados.getBarraApiladaAbiertosCerradosResolver
      ).dataGrafico;

      let usersId = [];
      // Recorre el array para buscar los id de usuarios y crea un array sólo de los id de usuarios
      dataNegociosPorUsuario.map((item) => {
        var booleanValue = usersId.filter((element) => element === item.usu_id);

        if (booleanValue.length === 0) {
          usersId = [...usersId, item.usu_id];
        }
      });

      // filtrar por cada usu id la canditad de negocios abiertos y cerrados
      const negociosPorUsuario = usersId.map((usuario) => {
        return dataNegociosPorUsuario.filter((item) => item.usu_id === usuario);
      });
      // esta funcion me agrupa en un array los negocios cerrados y abiertos. va a devolver un array de uno o dos elementos
      let totalNegociosAbiertosCerradosPorUsuario = negociosPorUsuario.map(
        (usu, i) => {
          let dataTemp = {
            usuario: "",
            Abiertos: 0,
            Cerrados: 0,
          };
          usu.map((u) => {
            dataTemp.usuario = u.usu_nombre;

            if (u.tipo === 1) {
              dataTemp.Abiertos = u.cantidadNegocios;
            } else {
              dataTemp.Cerrados = u.cantidadNegocios;
            }
          });
          // dataTemp.usuario = usu.usu_nombre;
          dataTemp.Totales = dataTemp.Abiertos + dataTemp.Cerrados;
          return dataTemp;
        }
      );
      // setea el state de la gráfica
      // setDataBarAbiertosCerrados(totalNegociosAbiertosCerradosPorUsuario);
    }
  }

  // setea barra Apilada por usuario para Ganados perdidos

  function setBarraApiladaGanadosPerdidios() {
    if (!dataBarraApiladaGanadosPerdidos) return;
    if (dataBarraApiladaGanadosPerdidos !== undefined) {
      if (
        !JSON.parse(
          dataBarraApiladaGanadosPerdidos.getBarraApiladaGanadosPerdidosResolver
        )
      ) {
        // setDataBarGanadosPerdidos([]);
        return;
      }

      const dataNegociosGanadosPerdidos = JSON.parse(
        dataBarraApiladaGanadosPerdidos.getBarraApiladaGanadosPerdidosResolver
      ).dataGrafico;
      let usersId = [];
      // Recorre el array para buscar los id de usuarios y crea un array sólo de los id de usuarios
      dataNegociosGanadosPerdidos.map((item) => {
        var booleanValue = usersId.filter((element) => element === item.usu_id);

        if (booleanValue.length === 0) {
          usersId = [...usersId, item.usu_id];
        }
      });

      // filtrar por cada usu id la canditad de negocios Ganados y perdidos.
      const negociosPorUsuario = usersId.map((usuario) => {
        return dataNegociosGanadosPerdidos.filter(
          (item) => item.usu_id === usuario
        );
      });
      // esta funcion me agrupa en un array los negocios cerrados y abiertos. va a devolver un array de uno o dos elementos
      let totalNegociosGanadosPerdidossPorUsuario = negociosPorUsuario.map(
        (usu) => {
          let dataTemp = {
            usuario: "",
            Ganados: 0,
            Perdidos: 0,
          };
          usu.map((u) => {
            dataTemp.usuario = u.usu_nombre;

            if (u.tipo === 1) {
              dataTemp.Ganados = u.cantidadNegocios;
            } else {
              dataTemp.Perdidos = u.cantidadNegocios;
            }
          });
          // dataTemp.usuario = usu.usu_nombre;
          dataTemp.Totales = dataTemp.Ganados + dataTemp.Perdidos;

          return dataTemp;
        }
      );
      // setea el state de la gráfica
      // setDataBarGanadosPerdidos(totalNegociosGanadosPerdidossPorUsuario);
    } else {
      return;
    }
  }

  // setea el dato de cerradosAbiertos
  function setAbiertosCerrados() {
    if (dataTorta) {
      let abiertos = JSON.parse(dataTorta.getTortaAbiertosCerradosResolver)[0]
        .abiertos;
      let cerrados = JSON.parse(dataTorta.getTortaAbiertosCerradosResolver)[0]
        .cerrados;
      let total = abiertos + cerrados;
      let porcentajeAbiertos = (abiertos * 100) / total;
      let porcentajeCerrados = 100 - porcentajeAbiertos;

      let data = [
        {
          id: `Abiertos (${porcentajeAbiertos.toLocaleString("de-DE", {
            maximumFractionDigits: 0,
          })}%)`,
          label: "Abiertos",
          color: "#333333",
          value: abiertos,
        },
        {
          id: `Cerrados (${porcentajeCerrados.toLocaleString("de-DE", {
            maximumFractionDigits: 0,
          })}%)`,
          label: "Cerrados",
          value: cerrados,
        },
      ];
      // setDataPieCerradosAbiertos(abiertos > 0 || cerrados > 0 ? data : null);
    }
  }
  function setGanadosPerdidos() {
    if (dataTortaGanadosPerdidos) {
      let ganados = JSON.parse(
        dataTortaGanadosPerdidos.getTortaGanadosPerdidosResolver
      )[0].ganados;
      let perdidos = JSON.parse(
        dataTortaGanadosPerdidos.getTortaGanadosPerdidosResolver
      )[0].perdidos;
      let total = ganados + perdidos;

      let porcentajeGanados = (ganados * 100) / total;
      let porcentajePerdidos = 100 - porcentajeGanados;

      let data = [
        {
          id: `Ganados (${porcentajeGanados.toLocaleString("de-DE", {
            maximumFractionDigits: 0,
          })}%)`,
          label: "Ganados",
          color: "#333333",
          value: ganados,
        },
        {
          id: `Perdidos (${porcentajePerdidos.toLocaleString("de-DE", {
            maximumFractionDigits: 0,
          })}%)`,
          label: "Perdidos",
          value: perdidos,
        },
      ];

      // setDataPieGanadosPerdidos(ganados > 0 || perdidos > 0 ? data : null);
    }
  }

  let temp = [];
  const d = data.getDataEmbudoResolver.map((item) => {
    let temp = {
      cantidadNegocios: Number(item.cantidadNegocios),
      eta_nombre: `${item.eta_nombre} · (${item.porcentajeEtapa}%)`,
    };

    return temp;
  });

  //TODO LOGICA PARA FUNNEL

  let total = 0;
  cards.map((item) => {
    total += Number(item.neg_valor);
  });

  const keysAbiertosCerrados = ["Abiertos", "Cerrados"];
  const keysGanadosPerdidos = ["Ganados", "Perdidos"];

  return (
    <Fragment>
      <Row gutter={[10, 10]} justify="start" align="middle">
        <Col xs={24} md={6}>
          <Card
            title="Monto total según moneda base "
            style={{ height: "180px" }}
          >
            <div className="total_wrapper">
              {loadingHeader ? (
                <Spin className="total" />
              ) : (
                <div className="total">
                  {totalAcumulado &&
                    totalAcumulado.toLocaleString("de-DE", {
                      maximumFractionDigits: 0,
                    })}{" "}
                  {monIsoBase}{" "}
                  <div className="avance_wrapper">
                    <span>
                      ({monIsoBase}{" "}
                      {porcentajeTotal.toLocaleString("de-DE", {
                        maximumFractionDigits: 0,
                      })}
                      )
                    </span>
                    <span className="avance">avance</span>
                  </div>
                </div>
              )}
            </div>
          </Card>
        </Col>
        <Col xs={24} md={6}>
          <Card title="Cantidad de negocios" style={{ height: "180px" }}>
            {loadingHeader ? (
              <div className="total">
                <Spin />
              </div>
            ) : (
              <div className="deals">{cantNegocios && cantNegocios}</div>
            )}
          </Card>
        </Col>
      </Row>
      <Row gutter={[10, 10]}>
        <Col xs={24}>
          <div className="funnel_wrapper_graph">
            {loadingHeader ? (
              <Spin />
            ) : (
              <>
                <FunnelHeader>
                  {funnelData &&
                    funnelData.map((item) => (
                      <FunnelHeaderItem
                        title={item.label}
                        percent={item.percent}
                      ></FunnelHeaderItem>
                    ))}
                </FunnelHeader>
                <FunnelChart config={funnelConfig} data={funnelData} />
              </>
            )}
          </div>
        </Col>
      </Row>
      <Row gutter={[10, 10]}>
        <Col xs={16}>
          <Card title="Abiertos vs. Cerrados (por usuario)">
            <div className="bar_wrapper">
              <ChartBar
                keys={keysAbiertosCerrados}
                config={barConfig}
                data={dataBarAbiertosCerrados}
                maxValueScale={maxValueScaleCalculate(dataBarAbiertosCerrados)}
                // maxValueScale={15}
              ></ChartBar>
            </div>
          </Card>
        </Col>
        <Col xs={8}>
          <Card title=" Abiertos vs. Cerrados" style={{ marginBottom: "10px" }}>
            <div className="bar_wrapper">
              <ChartPie
                config={pieChartConfig}
                data={dataPieCerradosAbiertos}
              />
            </div>
          </Card>
        </Col>
      </Row>
      <Row gutter={[10, 10]}>
        <Col xs={16}>
          <Card title="Perdidos vs. Ganados (por usuario)">
            <div className="bar_wrapper">
              <ChartBar
                keys={keysGanadosPerdidos}
                config={barConfig}
                data={dataBarGanadosPerdidos}
                maxValueScale={maxValueScaleCalculate(dataBarGanadosPerdidos)}
                // maxValueScale={15}
              ></ChartBar>
            </div>
          </Card>
        </Col>
        <Col xs={8}>
          <Card title="Perdidos vs. Ganados">
            <div className="bar_wrapper">
              <ChartPie config={pieChartConfig} data={dataPieGanadosPerdidos} />
            </div>
          </Card>
        </Col>
      </Row>
    </Fragment>
  );
};

export default FunnelView;
