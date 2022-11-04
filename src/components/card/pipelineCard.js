import {
  CalendarOutlined,
  ClockCircleOutlined,
  EditOutlined,
  EyeOutlined,
  InfoCircleOutlined,
  LockOutlined,
  PushpinOutlined,
  ShareAltOutlined,
  ShopOutlined,
  TagsOutlined,
  UserAddOutlined,
  UserOutlined,
  UserSwitchOutlined,
} from "@ant-design/icons";
import { useLazyQuery } from "@apollo/client";
import { Button, Dropdown, Menu, Popover, Tooltip } from "antd";
import React, { Fragment, useContext, useEffect, useState } from "react";
import { GET_ETAPA_POR_NEGOCIO } from "../../Graphql/queries/etapas";
import "../../scss/styles.scss";
import { DealContext } from "../context/DealCotext";
import { DrawerContext } from "../context/DrawContext";
import MenuRigth from "./footer/menuRight";
import "./pipelineCard.style.scss";
import moment from "moment";
import { timeDiff } from "../../utils/timeDiff";
import TagsList from "../tags/tagsList";
import TagItem from "../tags/tagItem";
import queryString from "query-string";

const PipelineCard = ({ deal, history }) => {
  const [getEtapa, { data }] = useLazyQuery(GET_ETAPA_POR_NEGOCIO, {
    variables: { idNegocio: deal.neg_id },
  });
  const {
    setEtaId,
    setNegId,
    setPathname,
    setTagsList,
    setTagsNegId,
    setDeal,
    idEstado,
    esUsuarioAdmin,
  } = useContext(DealContext);
  const { showDrawer, setDrawerName } = useContext(DrawerContext);

  const [iconsColor, setIconsColor] = useState("");

  useEffect(() => {
    if (!deal) return;

    switch (true) {
      case deal.idEstado === 1:
        setIconsColor("#00b33c");
        break;

      case deal.idEstado === 2:
        setIconsColor("#F44336");
        break;

      case deal.idEstado === 3:
        setIconsColor("#000000");
        break;
      default:
        break;
    }
  }, [deal]);

  const titleLength = deal.neg_asunto.length;

  const onClick = () => {
    getEtapa();
    if (data) {
      setEtaId(data.getEtapaByNegocioResolver[0].eta_id);
    }
  };

  const onClickCard = () => {
    const parsed = queryString.parse(window.location.search);
    const { userId } = parsed;
    setNegId(deal.neg_id);
    setEtaId(deal.eta_id);
    history.push({
      pathname: `/deal/${deal.neg_id}?userId=${userId}`,
      state: { name: "pipeline" },
    });
    setPathname(history.location.pathname);
  };

  const dealEdit = () => {
    // setNegId(deal.neg_id);
    // setDeal(deal);
    // showDrawer();
    // setDrawerName("Editar Negocio");
    //TODO abrir menu
  };

  const colorDeadLine = (closeDate) => {
    const close = new Date(closeDate).getTime();
    const now = Date.now();
    const diff = timeDiff(close, now);

    switch (true) {
      case diff <= 0:
        return "#F44336";
      case diff > 0 && diff <= 5:
        return "#faad14";

      default:
        return "#00b33c";
    }
  };

  const addTags = (deal) => {
    const dealTagsList = deal.tags;
    let tags;
    if (dealTagsList) {
      tags = dealTagsList.map((tag) => {
        //
        return { etq_id: tag.etq_id };
      });
    }
    setTagsNegId(Number(deal.neg_id));
    setTagsList(tags);

    setDrawerName("Administrar etiquetas");
    showDrawer();
  };

  return (
    <Fragment>
      <div
        className={`card_wrapper ${deal.tipo === 2 ? ` shared-card` : null}`}
        style={{
          borderColor:
            deal.tipo === 3 ? "#00b33c" : deal.idEstado === 3 && "#000000",
        }}
      >
        {deal.tipo === 2 && (
          <span className="item_shared">
            <Tooltip
              title="Negocio compartido"
              color="#555"
              mouseEnterDelay={1}
            >
              <ShareAltOutlined style={{ color: "#333" }} />
            </Tooltip>
          </span>
        )}

        <div className="card_body" style={{ width: "100%" }}>
          <div className="card-linea-titulo">
            {titleLength >= 25 ? (
              <Tooltip title={deal.neg_asunto} color="#555" mouseEnterDelay={1}>
                <h3 className="card_title">{deal.neg_asunto}</h3>
              </Tooltip>
            ) : (
              <h3 className="card_title">{deal.neg_asunto}</h3>
            )}
            {deal.assigned && (
              <span className="item_asig">
                <Tooltip
                  title="Negocio asignado"
                  color="#555"
                  mouseEnterDelay={1}
                >
                  <UserAddOutlined style={{ color: "#333" }} />
                </Tooltip>
              </span>
            )}

            {deal.elementosAnclados && deal.elementosAnclados.length > 0 && (
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
          </div>
          <Tooltip title={deal.cli_nombre} color="#555" mouseEnterDelay={1}>
            <p className="card_description">
              <ShopOutlined style={{ marginRight: 5 }} />
              {deal.cli_nombre}
            </p>
          </Tooltip>
        </div>
        <div className="card_footer">
          <p className="card_value">
            <span className="card_value_content">
              {deal.mon_iso}{" "}
              {deal.neg_valor.toLocaleString("de-DE", {
                maximumFractionDigits: 0,
              })}
            </span>
            <span className="card_value_info">
              {deal.con_nombre && (
                <Tooltip placement="top" title={deal.con_nombre}>
                  <UserOutlined style={{ marginLeft: 10, color: " #00b33c" }} />
                </Tooltip>
              )}

              <Tooltip
                placement="top"
                title={` Fecha estimada de cierre: ${moment(
                  deal.neg_fechacierreestimado
                ).format("DD/MM/YYYY")}`}
              >
                <ClockCircleOutlined
                  style={{
                    marginLeft: 10,
                    color: `${colorDeadLine(deal.neg_fechacierreestimado)}`,
                  }}
                />
              </Tooltip>
              {deal.task && deal.task.length > 0 && (
                <Tooltip
                  placement="top"
                  title={`${deal.task[0].cantTareas} Tareas`}
                >
                  <CalendarOutlined
                    style={{
                      marginLeft: 10,
                      color: `black`,
                    }}
                  />
                </Tooltip>
              )}
            </span>
          </p>
          {deal.tags && (
            <TagsList>
              {deal.tags.map((tag) => {
                const { etq_color, etq_id, etq_nombre } = tag;
                return (
                  <TagItem title={etq_nombre} key={etq_id} color={etq_color} />
                );
              })}
            </TagsList>
          )}

          <div className="divider"></div>
          <div className="card_buttons_wrapper">
            <div className="card_button br ">
              <Button size="small" type="link" block onClick={onClickCard}>
                <EyeOutlined />
              </Button>
            </div>
            <div className="card_button br">
              {deal.idEstado === 0 && (
                <Dropdown
                  size="small"
                  overlay={() => {
                    return (
                      <Menu>
                        <Menu.Item>
                          <Button
                            type={"link"}
                            onClick={() => {
                              setNegId(deal.neg_id);
                              setDeal(deal);
                              showDrawer();
                              setDrawerName("Editar Negocio");
                            }}
                            style={{ color: "black" }}
                          >
                            <EditOutlined style={{ color: "green" }} />
                            Editar negocio
                          </Button>
                        </Menu.Item>
                        <Menu.Item>
                          <Button
                            disabled={esUsuarioAdmin ? false : true}
                            type={"link"}
                            onClick={() => {
                              setNegId(deal.neg_id);
                              setDeal(deal);
                              showDrawer();
                              setDrawerName("Reasignar Negocio");
                            }}
                            style={{ color: "black" }}
                          >
                            <UserSwitchOutlined style={{ color: "blue" }} />
                            Reasignar negocio
                          </Button>
                        </Menu.Item>
                      </Menu>
                    );
                  }}
                  placement="bottomRight"
                  trigger={["click"]}
                >
                  <Button
                    type="link"
                    size="small"
                    block
                    onClick={dealEdit}
                    disabled={deal.tipo === 1 ? false : true}
                  >
                    <EditOutlined style={{ fontSize: "1.1rem" }} />
                  </Button>
                </Dropdown>
              )}

              {(deal.idEstado === 1 ||
                deal.idEstado === 2 ||
                deal.idEstado === 3) && (
                <EditOutlined style={{ color: "#c8c8c8" }} />
              )}
            </div>

            <div className="card_button br">
              <Button
                size="small"
                type="link"
                block
                onClick={() => addTags(deal)}
              >
                <TagsOutlined />
              </Button>
            </div>

            <div className="card_button">
              {deal.tipo !== 1 && idEstado === 0 && (
                <LockOutlined
                  style={{
                    fontSize: "13px",
                    color: "#c8c8c8",
                    cursor: "not-allowed",
                  }}
                />
              )}

              {deal.tipo === 1 && idEstado === 0 && (
                <Dropdown
                  size="small"
                  onClick={onClick}
                  overlay={() => {
                    return <MenuRigth deal={deal} />;
                  }}
                  placement="bottomRight"
                  trigger={["click"]}
                >
                  <Button type="link" block>
                    <LockOutlined style={{ fontSize: "13px" }} />
                  </Button>
                </Dropdown>
              )}

              {idEstado !== 0 && (
                <Popover
                  title={
                    <strong>
                      {deal.idEstado === 1 && `Cerrado Ganado •`}
                      {deal.idEstado === 2 && `Cerrado Perdido •`}
                      {deal.idEstado === 3 && `Anulado •`}

                      <span
                        style={{
                          color: iconsColor,
                        }}
                      >
                        {" "}
                        {deal.motivoCierre && deal.motivoCierre.cie_desc}
                      </span>
                    </strong>
                  }
                  placement="top"
                  trigger={"click"}
                  content={() => {
                    return (
                      <span>
                        <strong>
                          {deal.idEstado === 3
                            ? `Motivo de anulación`
                            : "Motivo de cierre"}
                        </strong>
                        <br />
                        {deal.motivoCierre && deal.motivoCierre.cxn_desc}
                        <br />
                        <strong>
                          {" "}
                          {deal.idEstado === 3
                            ? `Fecha de anulación`
                            : "Fecha de cierre"}
                        </strong>
                        <br />
                        {deal.neg_fechacierre &&
                          moment(deal.neg_fechacierre).format("DD/MM/YYYY")}
                        <br />
                        {deal.neg_valorcierre && (
                          <>
                            <strong>Valor real de cierre</strong>
                            <br />
                            {deal.mon_iso} {deal.neg_valorcierre}
                          </>
                        )}
                      </span>
                    );
                  }}
                >
                  <InfoCircleOutlined
                    style={{
                      fontSize: "13px",
                      color: iconsColor,
                    }}
                  />
                </Popover>
              )}
            </div>
          </div>
        </div>
      </div>
    </Fragment>
  );
};
export default PipelineCard;
