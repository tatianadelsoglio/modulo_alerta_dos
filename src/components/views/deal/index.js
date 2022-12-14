/* eslint-disable array-callback-return */
/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-unused-vars */
import {
  CalendarOutlined,
  EditOutlined,
  FileDoneOutlined,
  FullscreenOutlined,
  MoreOutlined,
  PaperClipOutlined,
  PlusOutlined,
} from "@ant-design/icons";
import { useQuery } from "@apollo/react-hooks";
import {
  Button,
  Card,
  Col,
  Dropdown,
  Empty,
  Menu,
  Progress,
  Row,
  Steps,
  Tabs,
  Tooltip,
} from "antd";
import React, { Fragment, useContext, useEffect, useState } from "react";
import { useHistory } from "react-router-dom";
import { GET_HISTORIAL_POR_NEGOCIO } from "../../../Graphql/queries/historial";
import { GET_NEGOCIO_POR_ID } from "../../../Graphql/queries/negocios";
import { GET_TIMELINE_POR_NEGOCIO } from "../../../Graphql/queries/timeLine";
import DealCard from "../../card/deal/dealCard";
import { DealContext } from "../../context/DealCotext";
import { DrawerContext } from "../../context/DrawContext";
import Timeline from "../../timeline";
import NoteItem from "../../timeline/components/note/noteItem";
import TaskItem from "../../timeline/components/task/taskItem";
import UploadItem from "../../timeline/components/upload/uploadItem";
import Header from "./header/header";
import "./index.scss";
import TaskBar from "../../uiComponet/taskBar";
import SharedUsers from "./sharedUsers/sharedUsers";
import { useRouter } from "../../../hook/useRouter";
import queryString from "query-string";
import { GET_ETAPAS_EMBUDOS } from "../../../Graphql/queries/embudos";

const Deal = () => {
  // Copy timeline
  const [notes, setNotes] = useState([]);
  const [tasks, setTasks] = useState([]);
  const [tags, setTags] = useState([]);
  //const [idNegocioURL, setIdNegocioURL] = useState('')
  // const [usuarios, setUsuarios] = useState([]);
  const [AnchorTasks, setAnchorTasks] = useState([]);
  const [AnchorNotes, setAnchorNotes] = useState([]);
  const [AnchorUploads, setAnchorUploads] = useState([]);
  const [filter, setFilter] = useState("");

  const [uploads, setUploads] = useState([]);
  // Historial temporal
  const [historial, setHistorial] = useState([]);
  const [historyFilter, setHistoryFilter] = useState([]);

  const [stateGonzalo, setStateGonzalo] = useState();
  // historial construido
  const router = useRouter();
  const { TabPane } = Tabs;
  const { Step } = Steps;
  const {
    negId,
    setDeal,
    deal,
    setEtaId,
    idPipeline,
    etaId,
    dealCompetitors,
    dealProducts,
    setDealCompetitors,
    dealTotalProducts,
    setDealTotalProducts,
    setDealProducts,
    setNegId,
    idUser,
    sharedUsers,
    setProducts,
    products,
    setSharedUsers,
  } = useContext(DealContext);

  const { setDrawerName, showDrawer } = useContext(DrawerContext);
  //

  //*original
  // const url = window.location.pathname;
  // const lastSlashPosition = url.lastIndexOf("/");
  // const idNegocioURL = Number(url.slice(lastSlashPosition + 1));

  //const url = window.location;
  const url = window.location.search;
  const parsed = queryString.parse(url);
  const lastSlashPosition = parsed.negId;
  const idNegocioURL = Number(lastSlashPosition);
  //setIdNegocioURL(Number(lastSlashPosition));
  setNegId(idNegocioURL);

  //setNegId(138)//para probar desde local

  const { data: negocio } = useQuery(GET_NEGOCIO_POR_ID, {
    variables: { idNegocio: idNegocioURL },
    pollInterval: 2000,
  });
  const { data } = useQuery(GET_TIMELINE_POR_NEGOCIO, {
    variables: { idNegocio: idNegocioURL },
    pollInterval: 2000,
  });
  const { data: getHistorial } = useQuery(GET_HISTORIAL_POR_NEGOCIO, {
    variables: { idNegocio: idNegocioURL },
    pollInterval: 2000,
  });

  //console.log(historial)
  const history = useHistory();

  useEffect(() => {
    if (!data) return;

    if (Object.keys(data).length) {
      setNotes(JSON.parse(data.getTimeLineByNegocioResolver).dataNot);
      const anchorNote = JSON.parse(
        data.getTimeLineByNegocioResolver
      ).dataNot.filter((item) => {
        return item.not_anclado === 1;
      });

      

      setAnchorNotes(anchorNote);

      setTasks(JSON.parse(data.getTimeLineByNegocioResolver).dataTar);
      // setUsuarios(JSON.parse(data.getTimeLineByNegocioResolver).dataUsu);

      const anchorTask = JSON.parse(
        data.getTimeLineByNegocioResolver
      ).dataTar.filter((item) => {
        return item.tar_anclado === 1 && item.est_id === 1;
      });

      setAnchorTasks(anchorTask);


      setUploads(JSON.parse(data.getTimeLineByNegocioResolver).dataUp);
      const anchorUploads = JSON.parse(
        data.getTimeLineByNegocioResolver
      ).dataUp.filter((item) => {
        return item.up_anclado === 1;
      });
      setAnchorUploads(anchorUploads);

      // etiquetas de negocios
    }

    if (!getHistorial) return;
    // if (historyFilter.length > 0) return;
    setHistorial(getHistorial.getHistorialByNegocioResolver);

    setHistoryFilter(setTypeFilter(filter));
  }, [getHistorial, data, filter, historial, deal]);

  const setTypeFilter = (filter) => {
    let f;
    if (filter === "") {
      f = historial;
    }
    f = historial.filter((item) => {
      return item.his_detalle.startsWith(filter);
    });
    return f;
  };



  useEffect(() => {
    // if (!negId) {
    //   // Cuando el id del negocio no existe lleva la app a la vista principal.
    //   history.push("/");
    // }
   


    if (negocio) {
      setProducts([]);
      const dataResult = JSON.parse(negocio.getNegocioByIdResolver);
      setStateGonzalo(dataResult.dataNeg);
      // console.log(stateGonzalo)


      setDeal(dataResult.dataNeg);
      setSharedUsers(dataResult.dataUsu);

      if (dataResult.dataNeg.eta_id) {
        setEtaId(dataResult.dataNeg.eta_id);
      }
      if (dataResult.dataProd.length > 0) {
        const Products = dataResult.dataProd;
        let total = 0;

        if (Products.length > 0) {
          Products.map((prod) => {
            total += prod.cantidad * Number(prod.valor) || 0;
            setDealTotalProducts(total);
            setDealProducts(Products);
            setProducts(Products);
          });
        } else {
          setDealTotalProducts(total);
          setDealProducts([]);
        }

        // setProducts(dataResult.dataProd);
        setEtaId(deal.eta_id);
      } else {
        setDealProducts([]);
        setDealTotalProducts(0);
      }

      if (dataResult.dataComp.length > 0) {
        setDealCompetitors(dataResult.dataComp);
      } else {
        setDealCompetitors([]);
      }

      setTags(JSON.parse(negocio.getNegocioByIdResolver).dataTags);
    }
  }, [data, deal.eta_id, history, idNegocioURL, negocio, setEtaId]);

  const showProducts = () => {
    setDrawerName("Productos");
    showDrawer();
  };

  const showCompetitors = () => {
    setDrawerName("Competidores");
    showDrawer();
  };

  const onClickNotas = () => {
    setDrawerName("Nueva Nota");
    showDrawer();
  };
  const onClickTareas = () => {
    setDrawerName("Nueva Tarea");
    showDrawer();
  };
  const onClickAdjunto = () => {
    setDrawerName("Nuevo Adjunto");
    showDrawer();
  };

  const menu = (
    <Menu>
      <Menu.Item onClick={onClickTareas}>
        <span>
          <CalendarOutlined style={{ marginRight: 5 }} />
          Tarea
        </span>
      </Menu.Item>
      <Menu.Item onClick={onClickNotas}>
        <span>
          <FileDoneOutlined style={{ marginRight: 5 }} />
          Nota
        </span>
      </Menu.Item>
      <Menu.Item onClick={onClickAdjunto}>
        <span>
          <PaperClipOutlined style={{ marginRight: 5 }} />
          Adjunto
        </span>
      </Menu.Item>
    </Menu>
  );

  const filterAll = () => {
    // Mostrat todo

    setFilter("");
  };
  const filterTask = () => {
    // Mostrar s??lo tareas

    setFilter("####T");
  };
  const filterNotes = () => {
    // Mostrar s??lo notas

    setFilter("####N");
  };
  const FilterUploads = () => {
    // Mostrar s??lo adjuntos

    setFilter("####A");
  };

  const menuCompleted = (
    <Menu>
      <Menu.Item onClick={filterAll}>
        <span>
          <FullscreenOutlined style={{ marginRight: 5 }} />
          Mostrar todo
        </span>
      </Menu.Item>
      <Menu.Item onClick={filterTask}>
        <span>
          <CalendarOutlined style={{ marginRight: 5 }} />
          S??lo tareas
        </span>
      </Menu.Item>
      <Menu.Item onClick={filterNotes}>
        <span>
          <FileDoneOutlined style={{ marginRight: 5 }} />
          S??lo notas
        </span>
      </Menu.Item>
      <Menu.Item onClick={FilterUploads}>
        <span>
          <PaperClipOutlined style={{ marginRight: 5 }} />
          S??lo adjuntos
        </span>
      </Menu.Item>
    </Menu>
  );

  const dealEdit = () => {
    setNegId(idNegocioURL);
    showDrawer();
    setDrawerName("Editar Negocio");
  };

  const filterCompletaed = () => {
    return (
      <Fragment>
        <Dropdown overlay={menuCompleted} placement="bottomRight">
          <Button type="ghost" disabled={deal.neg_estado !== 0 ? true : false}>
            <MoreOutlined style={{ fontWeight: 800 }} />
          </Button>
        </Dropdown>
      </Fragment>
    );
  };

  return (
    <div className="deal_wrapper">
      <Row gutter={[20, 20]}>
        <Col xs={24}>
          <Header history={history} tags={tags} stateGonzalo={stateGonzalo} />
        </Col>
      </Row>

      <Row gutter={[20, 20]}>
        <Col xs={24} md={7}>
          <DealCard title="">
            <Row gutter={[8, 8]}>
              <Col xs={24}>
                {deal.neg_estado === 0 && (
                  <Button
                    type="primary"
                    block
                    onClick={() => dealEdit()}
                    disabled={deal.usu_asig_id !== idUser && idUser !== 1}
                  >
                    <EditOutlined /> Editar Negocio
                  </Button>
                )}
              </Col>

              <Col xs={12}>
                <Tooltip
                  placement="top"
                  title={`${dealProducts.length} Productos (USD ${
                    dealTotalProducts
                      ? dealTotalProducts.toLocaleString("de-DE", {
                          maximumFractionDigits: 2,
                        })
                      : 0
                  }) `}
                >
                  <Button
                    type="dashed"
                    onClick={showProducts}
                    block
                    disabled={deal.usu_asig_id !== idUser && idUser !== 1}
                  >
                    <span style={{fontSize:"13px"}}>
                      Productos ({`${dealProducts.length}`})
                    </span>
                  </Button>
                </Tooltip>
              </Col>
              <Col xs={12}>
                <Tooltip
                  placement="top"
                  title={` ${dealCompetitors.length} Competidores `}
                >
                  <Button
                    type="dashed"
                    onClick={showCompetitors}
                    block
                    disabled={deal.usu_asig_id !== idUser && idUser !== 1}
                  >
                    <span style={{marginLeft:"-10px", fontSize:"13px"}}>
                      Competidores ({`${dealCompetitors.length}`})
                    </span>
                  </Button>
                </Tooltip>
              </Col>
            </Row>
          </DealCard>
          <DealCard title="Estad??sticas">
            <div className="progress_info">
              <span>Antig??edad del negocio</span>
              <span>
                {deal.antiguedadTrato}{" "}
                {deal.antiguedadTrato > 1 ? `d??as` : `d??a`}
              </span>
            </div>
            <div className="progress">
              <Progress
                strokeColor={{
                  "0%": "#87d068",
                  "85%": "#f0db24",
                  "100%": "#f11515",
                }}
                percent={100}
                showInfo={false}
              />
            </div>
            {tasks.length > 0 && (
              <Fragment>
                <div className="progress_info-tasks">
                  <span>Tareas</span>
                  <span>
                    {/* {deal.antiguedadTrato} {deal.antiguedadTrato > 1 ? `d??as` : `d??a`} */}
                    %
                  </span>
                </div>
                <div className="progress">
                  <TaskBar tasks={tasks}></TaskBar>
                </div>
              </Fragment>
            )}
          </DealCard>
          <DealCard title="Usuarios compartidos">
            <Row gutter={[8, 8]}>
              <Col xs={24}>
                <SharedUsers usuarios={sharedUsers} />
              </Col>
            </Row>
          </DealCard>
        </Col>
        <Col xs={24} md={17}>
          <Row>
            <Col xs={24}>
              <Card title="DESTACADO">
                <Tabs defaultActiveKey="1">
                  <div className="add_wrapper"></div>
                  <TabPane
                    tab={
                      <span>
                        <CalendarOutlined />
                        Tareas ({AnchorTasks.length})
                      </span>
                    }
                    key="1"
                  >
                    <Fragment>
                      {AnchorTasks.length === 0 && (
                        <Empty
                          image={Empty.PRESENTED_IMAGE_SIMPLE}
                          description="No hay tareas fijadas"
                        />
                      )}
                      {AnchorTasks.map((task) => {
                        if (task.est_id === 1) {
                          if (task.tar_anclado !== 0) {
                            // Si tiene nota
                            // Si tiene adjunto

                            if (
                              task.not_desc !== null &&
                              task.up_detalle === null
                            ) {
                              let note = {
                                not_desc: task.not_desc,
                                not_fechahora: task.not_fechahora,
                                not_id: task.not_id,
                                pri_desc: task.pri_desc,
                              };

                              return (
                                <div className="anchor_task_wrapper">
                                  <TaskItem
                                    task={task}
                                    note={note}
                                    upload={false}
                                  ></TaskItem>
                                </div>
                              );
                            }
                            if (
                              task.up_detalle !== null &&
                              task.not_desc === null
                            ) {
                              let upload = {
                                up_detalle: task.up_detalle,
                                up_fechaupload: task.up_fechaupload,
                                up_filename: task.up_filename,
                                up_hashname: task.up_hashname,
                                up_id: task.up_id,
                                up_mimetype: task.up_mimetype,
                                up_size: task.up_size,
                                usu_nombre: task.usu_nombre,
                              };

                              return (
                                <div className="anchor_task_wrapper">
                                  <TaskItem
                                    task={task}
                                    note={false}
                                    upload={upload}
                                  ></TaskItem>
                                </div>
                              );
                            }
                            if (
                              task.not_desc !== null &&
                              task.up_detalle !== null
                            ) {
                              let upload = {
                                up_detalle: task.up_detalle,
                                up_fechaupload: task.up_fechaupload,
                                up_filename: task.up_filename,
                                up_hashname: task.up_hashname,
                                up_id: task.up_id,
                                up_mimetype: task.up_mimetype,
                                up_size: task.up_size,
                                usu_nombre: task.usu_nombre,
                              };
                              let note = {
                                not_desc: task.not_desc,
                                not_fechahora: task.not_fechahora,
                                not_id: task.not_id,
                                pri_desc: task.pri_desc,
                              };

                              return (
                                <div className="anchor_task_wrapper">
                                  <TaskItem
                                    task={task}
                                    note={note}
                                    upload={upload}
                                  ></TaskItem>
                                </div>
                              );
                            }
                            return (
                              <div className="anchor_task_wrapper">
                                <TaskItem
                                  task={task}
                                  note={false}
                                  upload={false}
                                ></TaskItem>
                              </div>
                            );
                          }
                          // else {
                          // }
                        }
                      })}
                    </Fragment>
                  </TabPane>
                  <TabPane
                    tab={
                      <span>
                        <FileDoneOutlined />
                        Notas ({AnchorNotes.length})
                      </span>
                    }
                    disabled={false}
                    key="2"
                  >
                    {AnchorNotes.length === 0 && (
                      <Empty
                        image={Empty.PRESENTED_IMAGE_SIMPLE}
                        description="No hay notas fijadas"
                      />
                    )}
                    {AnchorNotes.map((note) => {
                      return (
                        <div className="note_wrapper_anchor">
                          <NoteItem note={note} attached={false}></NoteItem>
                        </div>
                      );
                    })}
                  </TabPane>

                  <TabPane
                    tab={
                      <span>
                        <PaperClipOutlined />
                        Adjuntos ({AnchorUploads.length})
                      </span>
                    }
                    key="6"
                  >
                    {AnchorUploads.length === 0 && (
                      <Empty
                        image={Empty.PRESENTED_IMAGE_SIMPLE}
                        description="No hay adjuntos fijados"
                      />
                    )}
                    {AnchorUploads.map((upload) => {
                      return (
                        <div className="upload_wrapper_anchor">
                          <UploadItem
                            upload={upload}
                            attached={false}
                          ></UploadItem>
                        </div>
                      );
                    })}
                  </TabPane>
                </Tabs>
                <div className="add">
                  <Dropdown
                    overlay={menu}
                    placement="topRight"
                    disabled={deal.neg_estado !== 0}
                  >
                    <Button shape="circle" type="primary">
                      <PlusOutlined />
                    </Button>
                  </Dropdown>
                </div>
              </Card>

              <Col xs={24}>
                <div className="historial_wrapper">
                  <DealCard title="Planificado">
                    <Timeline
                      tasks={tasks}
                      taskStatus={1}
                      notes={notes}
                      uploads={uploads}
                      historial={historial}
                    ></Timeline>
                  </DealCard>
                  <DealCard title="Completado" extra={filterCompletaed()}>
                    <Timeline
                      tasks={tasks}
                      filter={filter}
                      taskStatus={2}
                      notes={notes}
                      uploads={uploads}
                      historial={
                        historyFilter.length === 0 ? historial : historyFilter
                      }
                    ></Timeline>
                  </DealCard>
                  {/* <h3 className="completed"> Completado</h3> */}
                </div>
              </Col>
            </Col>
          </Row>
        </Col>
      </Row>
    </div>
  );
};

export default Deal;
