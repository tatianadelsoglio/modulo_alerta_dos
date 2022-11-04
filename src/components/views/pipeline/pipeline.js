/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable array-callback-return */
import { useQuery } from "@apollo/react-hooks";
import { Button, Result, Spin } from "antd";
import React, { Fragment, useContext, useEffect, useState } from "react";

import GridLayout from "react-grid-layout";
import { useHistory } from "react-router";
import { GET_EMBUDOS } from "../../../Graphql/queries/embudos";
import useWindowSize from "../../../hook/useWindowSize";
import { setHistorial } from "../../../utils/setHistorial";
import PipelineCard from "../../card/pipelineCard";
import { DealContext } from "../../context/DealCotext";
import { DrawerContext } from "../../context/DrawContext";
import "./pipeline.styles.scss";
import PipelineHeader from "./pipelineHeader/pipelineHeader";
import { GET_NEGOCIOS_POR_EMBUDO } from "../../../Graphql/queries/negocios";

const Pipeline = ({ steps, setHistory, setSteps, allSteps, datosPorEtapa }) => {
  const [cardsLayout, setCardsLayout] = useState([]);
  const [changeLayoutView, setChangeLayoutView] = useState(false);
  const [layout, setLayout] = useState([]);

  const { setDrawerName, setNewPipelineState, setDrawerDetail, showDrawer } =
    useContext(DrawerContext);
  const {
    setEtaId,
    setEtaPreviaId,
    setNegId,
    newHistorialNegocioResolver,
    updateEtapaxNegocioResolver,
    setDeal,
    deal,
    idUser,
    idPipeline,
    idEstado,
    filterDate,
    setLoadingSuma,
    filterIdUser,
    filterTypeDate,
    setCards,
    tagsListFilter,
    pipelineSpin,
    setPipelineSpin,
    pipelineFlag,
    etapasFlag,
    filterCliente,
    setPollNegocios,
    pollValoresEtapa,
    filterDestacadas,
  } = useContext(DealContext);

  const { data, startPolling, stopPolling } = useQuery(
    GET_NEGOCIOS_POR_EMBUDO,
    {
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
    }
  );

  const getEmbudos = useQuery(GET_EMBUDOS);

  const size = useWindowSize();
  const history = useHistory();
  setHistory(history);

  useEffect(() => {
    setPollNegocios({ initial: startPolling, close: stopPolling });
    if (data) {
      let cardList = [];
      let layout = [];
      let negociosParaIterar = [];
      let elementosDestacados = [];
      const fullData = JSON.parse(data.getNegocioResolver);

      elementosDestacados = fullData.elementosDestacados;

      negociosParaIterar = fullData.dataNeg;
      negociosParaIterar.map((card) => {
        let tags;
        let task;
        let motivoCierre;
        let elementosAnclados;

        if (fullData.dataTags.length) {
          // filtro los tags
          tags = fullData.dataTags.filter((tags) => {
            return tags.neg_id === card.neg_id;
          });
        }

        if (fullData.dataTask) {
          task = fullData.dataTask.filter((task) => {
            return task.neg_id === card.neg_id;
          });
        }

        if (elementosDestacados) {
          elementosAnclados = elementosDestacados.filter((not) => {
            return not.neg_id === card.neg_id;
          });
        }

        if (
          fullData.dataMotivosCierre &&
          fullData.dataMotivosCierre.length > 0
        ) {
          motivoCierre = fullData.dataMotivosCierre.filter((motivos) => {
            return motivos.neg_id === card.neg_id;
          });
        }
        let shared;
        if (idUser !== 1) {
          shared = card.usu_asig_id !== idUser ? true : false;
        } else {
          shared = false;
        }
        const c = {
          ...card,
          layoutPosition: {
            x: card.eta_orden - 1,
            y: 0,
            w: 1,
            h: 4,
            minW: 1,
            maxW: 1,
            static: idEstado !== 0 || shared ? true : false,
          },
          idEstado,
          tags,
          task,
          motivoCierre: motivoCierre && motivoCierre[0],
          elementosAnclados,
        };
        layout.push(c.layoutPosition);
        cardList.push(c);
      });

      //* Filtrar para ver destacados directo desde el cliente

      if (filterDestacadas === true) {
        const filtrados = cardList.filter(
          (neg) => neg.elementosAnclados.length > 0
        );
        setCardsLayout(filtrados);
        //! setCards modifica el length del array de cards por lo tanto modifica headers
        // setCards(filtrados);
      } else {
        setCardsLayout(cardList);
        setCards(cardList);
      }

      setLayout(layout);
    }
    setSteps(allSteps);
  }, [
    allSteps,
    idPipeline,
    setSteps,
    data,
    changeLayoutView,
    tagsListFilter,
    filterTypeDate,
    idEstado,
    steps,
    filterIdUser,
    filterCliente,
    filterDestacadas,
  ]);

  const changeLayout = () => {
    setChangeLayoutView(!changeLayoutView);
  };

  const onDrop = (layout, itemFrom, itemTo) => {
    const eta_orden = itemTo.x + 1;
    const eta_orden_prev = itemFrom.x + 1;
    //TODO ARREGLAR NEG_ID PEGA EN TODOS LOS STATES

    // const neg_id = Number(itemTo.i);
    const negIdWithKey = itemTo.i;
    const neg_id = Number(negIdWithKey.split("-")[0]);

    const etapa = steps.filter(
      (etapa) => etapa.eta_orden === Number(eta_orden)
    );
    const etapaPrevia = steps.filter(
      (etapa) => etapa.eta_orden === Number(eta_orden_prev)
    );
    const eta_id = Number(etapa[0].eta_id);
    const negocio = {
      eta_id,
      neg_id,
    };

    if (itemTo.x === itemFrom.x) {
      return;
    }

    setEtaId(eta_id);
    setNegId(neg_id);

    setDeal({ ...deal, eta_id });
    updateEtapaxNegocioResolver({ variables: { input: negocio } }).then(() => {
      pollValoresEtapa.initial(1000);
      setLoadingSuma(true);

      setTimeout(() => {
        setLoadingSuma(false);
        pollValoresEtapa.close();
      }, 5000);
    });
    // .catch((error) =>

    setEtaPreviaId(eta_orden_prev);

    // setear el cambio de etapa desede hacia...

    const template = `Cambio de etapa desde ${etapaPrevia[0].eta_nombre} hacia ${etapa[0].eta_nombre}`;
    setHistorial(
      newHistorialNegocioResolver,
      idUser,
      negocio.neg_id,
      negocio.eta_id,
      template,
      itemFrom.x + 1
    );
  };

  const newSteps = () => {
    setDrawerName("Agregar Etapas");
    const pipeline = getEmbudos.data.getPipelinesResolver.filter(
      (item) => Number(item.pip_id) === idPipeline
    );

    setNewPipelineState(true);
    setDrawerDetail(` - ${pipeline[0].pip_nombre}`);
    showDrawer();
  };
  const onClickNewPipeline = () => {
    setDrawerName("Nuevo Embudo");
    setDrawerDetail("");
    showDrawer();
    setNewPipelineState(false);
  };

  useEffect(() => {
    if (pipelineSpin > 0) {
      setTimeout(() => {
        setPipelineSpin(pipelineSpin - 1);
      }, 1000);
    } else {
      setPipelineSpin(0);
    }
  });

  return (
    <Fragment>
      {!etapasFlag && pipelineFlag && (
        <Result
          status="404"
          title="No hay etapas"
          subTitle="De momento este embudo no tiene ninguna etapa."
          extra={
            <Button onClick={newSteps} type="primary">
              Crear Etapas
            </Button>
          }
        />
      )}
      {!pipelineFlag && (
        <Result
          status="404"
          title="No hay Embudos"
          subTitle="De momento no tienes ningún embudo creado."
          extra={
            <Button onClick={onClickNewPipeline} type="primary">
              Crear Embudo
            </Button>
          }
        />
      )}

      {steps.length ? (
        <>
          {pipelineSpin > 0 ? (
            <div className="spin-wrapper">
              <Spin tip="Cargando" />
            </div>
          ) : (
            <>
              <PipelineHeader steps={steps} datosPorEtapa={datosPorEtapa} />
              <GridLayout
                className="layout"
                autoSize
                cols={steps.length}
                onDragStop={onDrop}
                onLayoutChange={changeLayout}
                rowHeight={38}
                margin={[10, 5]}
                width={size.width | 0}
                layout={layout}
              >
                {cardsLayout.map((item, idx) => {
                  const {
                    neg_id,
                    neg_asunto,
                    cli_nombre,
                    con_nombre,
                    mon_iso,
                    layoutPosition,
                    neg_fechacierre,
                    neg_valor,
                    eta_id,
                    idEstado,
                    usu_asig_id,
                    usu_id,
                    tipo,
                    tags,
                    motivoCierre,
                    neg_fechacierreestimado,
                    neg_valorcierre,
                    task,
                    elementosAnclados,
                  } = item;

                  const deal = {
                    neg_id,
                    neg_asunto,
                    cli_nombre,
                    con_nombre,
                    mon_iso,
                    layoutPosition,
                    neg_fechacierre,
                    neg_valor,
                    eta_id,
                    idEstado,
                    usu_asig_id,
                    usu_id,
                    assigned: usu_asig_id !== usu_id ? true : false,
                    tipo,
                    tags,
                    task,
                    motivoCierre,
                    neg_fechacierreestimado,
                    neg_valorcierre,
                    elementosAnclados,
                  };

                  return (
                    <div
                      className="card-container"
                      key={neg_id + "-" + idx}
                      data-grid={layoutPosition}
                    >
                      <PipelineCard deal={deal} history={history} />
                    </div>
                  );
                })}
              </GridLayout>
            </>
          )}
        </>
      ) : null}
    </Fragment>
  );
};

export default Pipeline;
