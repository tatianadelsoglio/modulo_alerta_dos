/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-unused-vars */
import React, { Fragment, useContext, useEffect, useState } from "react";
import {
  Form,
  Input,
  Row,
  Col,
  Drawer,
  Select,
  Button,
  Popconfirm,
  InputNumber,
  Space,
  Empty,
} from "antd";
import {
  CalendarOutlined,
  CheckOutlined,
  DeleteOutlined,
  MinusCircleOutlined,
  PercentageOutlined,
  PlusOutlined,
  SaveOutlined,
} from "@ant-design/icons";
import { useLazyQuery, useMutation, useQuery } from "@apollo/react-hooks";
import {
  GET_ETAPAS_EMBUDOS_TODOS,
  GET_PIPELINE_POR_BORRAR,
} from "../../Graphql/queries/embudos";
import {
  DELETE_ETAPA,
  NEW_ETAPAS_POR_EMBUDO,
  UPDATE_NOMBRE_ETAPA,
} from "../../Graphql/mutations/etapas";
import {
  DELETE_PIPELINE_Y_ETAPAS,
  UPDATE_NOMBRE_PIPELINE,
} from "../../Graphql/mutations/pipelines";
import OpenNotification from "../notifications/openNotification";
import { DealContext } from "../context/DealCotext";

const EditPipelineAndSteps = ({ setVisible, visible, embudos }) => {
  const { setPipelineName, setPipelineFlag } = useContext(DealContext);
  const [form] = Form.useForm();
  const [formEtapas] = Form.useForm();
  const { Option } = Select;
  //! state que tiene todas las etapas, para luego filtrar por embudo
  const [etapas, setEtapas] = useState([]);
  //! state que contiene etapas del embudo seleccionado para render en el DOM
  const [etapasFiltradas, setEtapasFiltradas] = useState([]);
  //! nombre embudo elegido
  const [embudoElegido, setEmbudoElegido] = useState({});
  //! value del onchange de cada etapa
  const [valueEtapa, setValueEtapa] = useState("");
  //! value del onchange del nombre del embudo
  const [valueEmbudo, setValueEmbudo] = useState("");
  //! show detalle una vez elegido un embudo
  const [showDetail, setShowDetail] = useState(false);

  //! booleano para determinar si es borrable el embudo
  const [esBorrable, setEsBorrable] = useState(false);

  const [updateNombreEtapaResolver] = useMutation(UPDATE_NOMBRE_ETAPA, {
    onCompleted: () => {
      OpenNotification(
        <h4>Se modificó el nombre de la etapa correctamente.</h4>,
        null,
        "topleft",
        <CheckOutlined style={{ color: "green" }} />,
        null
      );
      //* limpio el state que escucha el cambio del campo del nombre de la etapa
      setValueEtapa("");
    },
  });

  const [updateNombrePipelineResolver] = useMutation(UPDATE_NOMBRE_PIPELINE, {
    onCompleted: () => {
      OpenNotification(
        <h4>Se modificó correctamente el embudo.</h4>,
        null,
        "topleft",
        <CheckOutlined style={{ color: "green" }} />,
        null
      );
      //* limpio el state que escucha el cambio del campo del nombre del embudo
      setPipelineName(valueEmbudo);
      setValueEmbudo("");
    },
  });

  const [deletePipelineResolver] = useMutation(DELETE_PIPELINE_Y_ETAPAS, {
    onCompleted: () => {
      OpenNotification(
        <h4>Se elimino correctamente el embudo.</h4>,
        null,
        "topleft",
        <DeleteOutlined style={{ color: "green" }} />,
        null
      );
      setPipelineName(valueEmbudo);
      setValueEmbudo("");
      setEmbudoElegido({});
      setShowDetail(false);
      setVisible(false);
    },
  });

  const [deleteEtapaResolver] = useMutation(DELETE_ETAPA, {
    onCompleted: () => {
      OpenNotification(
        <h4>Se elimino correctamente la etapa.</h4>,
        null,
        "topleft",
        <DeleteOutlined style={{ color: "green" }} />,
        null
      );
      setShowDetail(false);
      setVisible(false);
    },
  });

  const [newEtapaPipelineResolver] = useMutation(NEW_ETAPAS_POR_EMBUDO, {
    onCompleted: () => {
      OpenNotification(
        <h4>Se agregaron exitosamente las etapas</h4>,
        null,
        "topleft",
        <CheckOutlined style={{ color: "green" }} />,
        null
      );
      setShowDetail(false);
      setVisible(false);
    },
  });

  const { data } = useQuery(
    GET_ETAPAS_EMBUDOS_TODOS
    // { pollInterval: 500 }
  );

  useEffect(() => {
    if (!data) return;
    if (data) {
      setEtapas(data.getEtapasResolver);
    }
  }, [data, etapasFiltradas]);

  const handleChange = (v, d) => {
    setEmbudoElegido({ nombre: d.key, id: d.value });

    const idEmbudo = Number(v);
    //!determino si el embudo contiene negocios y seteo booleano para render delete
    const embudoFiltrado = embudos.filter((x) => x.pip_id === String(idEmbudo));
    if (embudoFiltrado[0].cantidadNegocios <= 0) {
      setEsBorrable(true);
    } else {
      setEsBorrable(false);
    }

    const result = etapas.filter((x) => x.pip_id === idEmbudo);

    result.sort((a, b) => {
      return a.eta_orden - b.eta_orden;
    });

    setEtapasFiltradas(result);
    setShowDetail(true);
  };

  const handleSaveEtapa = (formValues, item) => {
    updateNombreEtapaResolver({
      variables: {
        idEtapa: Number(item.eta_id),
        nombreEtapa: formValues.nombreEtapa,
        porcentajeEtapa: Number(formValues.pctEtapa),
        diasInactivos: Number(formValues.diasInactivos),
      },
    });
  };

  const handleSaveEmbudo = () => {
    updateNombrePipelineResolver({
      variables: {
        idPipeline: Number(embudoElegido.id),
        nombrePipeline: valueEmbudo,
      },
    });
  };

  const handleDelete = () => {
    const { id } = embudoElegido;
    deletePipelineResolver({ variables: { idPipeline: Number(id) } });

    if (embudos.length === 1) {
      setPipelineFlag(false);
    }
  };

  const handleDeleteEtapa = (item) => {
    deleteEtapaResolver({ variables: { idEtapa: Number(item.eta_id) } });
    setEtapasFiltradas(etapasFiltradas.filter((x) => x.eta_id !== item.eta_id));
  };

  const saveSteps = (values) => {
    let arrayEtapas = [];
    values.etapas.forEach((etapa, i) => {
      const input = {
        ...etapa,
        eta_diasinactivos: Number(etapa.eta_diasinactivos),
        eta_orden: etapasFiltradas.length + (i + 1),
        pip_id: Number(embudoElegido.id),
      };
      arrayEtapas = [...arrayEtapas, input];
    });
    newEtapaPipelineResolver({
      variables: { input: { etapaIndividual: arrayEtapas } },
    });
  };

  return (
    <Drawer
      visible={visible}
      onClose={() => {
        setShowDetail(false);
        setVisible(false);
      }}
      closable={false}
      destroyOnClose={true}
      width={600}
    >
      <Form
        form={form}
        requiredMark="optional"
        name="etapas"
        layout="vertical"
        autoComplete="off"
      >
        <div className="layout-wrapper">
          <div className="layout-form">
            <h4>Seleccione embudo para editar</h4>
            {embudos.length > 0 && (
              <Select
                showSearch
                style={{ width: 300, marginBottom: "10px" }}
                placeholder="Embudo"
                optionFilterProp="children"
                onChange={(v, d) => handleChange(v, d)}
              >
                {embudos &&
                  embudos.map((pipeline) => {
                    const { pip_id, pip_nombre } = pipeline;
                    return (
                      <Option key={pip_nombre} value={pip_id}>
                        {pip_nombre}
                      </Option>
                    );
                  })}
              </Select>
            )}
            {showDetail && (
              <>
                <h4>Nombre del embudo</h4>
                <Input
                  style={{ marginBottom: "10px" }}
                  suffix={
                    <>
                      <SaveOutlined
                        style={{ color: "green" }}
                        onClick={() => handleSaveEmbudo()}
                      />
                      {esBorrable ? (
                        <Popconfirm
                          placement="bottomRight"
                          title={"¿Desea borrar el embudo?"}
                          onConfirm={() => handleDelete()}
                          okText="Si"
                          cancelText="No"
                        >
                          <DeleteOutlined
                            style={{ color: "red", marginLeft: "10px" }}
                          />
                        </Popconfirm>
                      ) : null}
                    </>
                  }
                  key={embudoElegido.id}
                  defaultValue={embudoElegido.nombre}
                  onChange={(e) => {
                    setValueEmbudo(e.target.value);
                  }}
                />
                {etapasFiltradas && etapasFiltradas.length > 0 ? (
                  <h4>Etapas</h4>
                ) : (
                  <Empty
                    image={Empty.PRESENTED_IMAGE_SIMPLE}
                    description="No hay etapas"
                  />
                )}

                {etapasFiltradas &&
                  etapasFiltradas.length > 0 &&
                  etapasFiltradas.map((item, idx) => {
                    //* Fundamental resetar campos siempre que se itera el array de etapas del embudo elegido
                    // formEtapas.resetFields();
                    return (
                      <>
                        <Form
                          key={idx}
                          onFinish={(v) => handleSaveEtapa(v, item)}
                          style={{
                            marginBottom: "10px",
                            display: "flex",
                            flexDirection: "row",
                            alignItems: "base-line",
                          }}
                        >
                          <Input.Group
                            compact
                            key={item.eta_id}
                            id={item.eta_id}
                          >
                            <Form.Item
                              name={"nombreEtapa"}
                              initialValue={item.eta_nombre}
                            >
                              <Input
                                style={{ width: 270, textAlign: "left" }}
                                defaultValue={item.eta_nombre}
                              />
                            </Form.Item>
                            <Form.Item
                              name={"pctEtapa"}
                              initialValue={item.eta_avance}
                            >
                              <Input
                                style={{ width: 50, textAlign: "right" }}
                                defaultValue={item.eta_avance}
                                type="number"
                              />
                            </Form.Item>

                            <Input
                              className="site-input-right"
                              suffix={<PercentageOutlined />}
                              style={{
                                width: 40,
                                borderLeft: 0,
                                pointerEvents: "none",
                                textAlign: "center",
                              }}
                              disabled
                            />

                            <Form.Item
                              name={"diasInactivos"}
                              initialValue={item.eta_diasinactivos}
                            >
                              <Input
                                style={{ width: 50, textAlign: "right" }}
                                defaultValue={item.eta_diasinactivos}
                                type="number"
                              />
                            </Form.Item>

                            <Input
                              className="site-input-right"
                              suffix={<CalendarOutlined />}
                              style={{
                                width: 40,
                                borderLeft: 0,
                                pointerEvents: "none",
                                textAlign: "center",
                              }}
                              disabled
                            />
                          </Input.Group>
                          <Form.Item>
                            <Button
                              htmlType="submit"
                              style={{ color: "green" }}
                              type="text"
                            >
                              <SaveOutlined />
                            </Button>
                          </Form.Item>

                          {esBorrable && (
                            <Button
                              style={{ color: "red" }}
                              type="text"
                              onClick={() => handleDeleteEtapa(item)}
                            >
                              <DeleteOutlined />
                            </Button>
                          )}
                        </Form>
                      </>
                    );
                  })}
                <Form onFinish={(v) => saveSteps(v)}>
                  <Form.List name="etapas">
                    {(fields, { add, remove }) => {
                      const reset = () => {
                        remove(fields.map((item) => item.name));
                      };

                      return (
                        <div>
                          {fields.map((field) => (
                            <Space
                              key={field.key}
                              style={{ display: "flex", marginBottom: 8 }}
                              align="start"
                            >
                              <Form.Item
                                {...field}
                                name={[field.name, "eta_nombre"]}
                                fieldKey={[field.fieldKey, "eta_nombre"]}
                                rules={[
                                  {
                                    required: true,
                                    message: "campo obligatorio",
                                  },
                                ]}
                              >
                                <Input
                                  placeholder="Nombre de etapa"
                                  style={{ width: "100%" }}
                                />
                              </Form.Item>
                              <Form.Item
                                {...field}
                                name={[field.name, "eta_avance"]}
                                fieldKey={[field.fieldKey, "eta_avance"]}
                                rules={[
                                  {
                                    required: true,
                                    type: "number",
                                    message: "Obligatorio",
                                    max: 100,
                                    min: 0,
                                  },
                                ]}
                              >
                                <InputNumber
                                  min={0}
                                  max={100}
                                  placeholder="%"
                                />
                              </Form.Item>
                              <Form.Item
                                {...field}
                                name={[field.name, "eta_diasinactivos"]}
                                fieldKey={[field.fieldKey, "eta_diasinactivos"]}
                                rules={[
                                  { required: true, message: "obligatorio" },
                                ]}
                              >
                                <Input
                                  placeholder="días"
                                  style={{ width: 60 }}
                                />
                              </Form.Item>

                              <MinusCircleOutlined
                                style={{ margin: "10px 8px", color: "red" }}
                                onClick={() => {
                                  remove(field.name);
                                }}
                              />
                            </Space>
                          ))}

                          <Form.Item>
                            <Button
                              type="dashed"
                              onClick={() => {
                                add();
                              }}
                              block
                            >
                              <PlusOutlined /> Agregar Etapa
                            </Button>
                          </Form.Item>
                          {fields && fields.length > 0 && (
                            <div className="layout-footer">
                              <Row gutter={[8, 8]}>
                                <Col xs={12}>
                                  <Button type="default" onClick={reset} block>
                                    Cancelar
                                  </Button>
                                </Col>
                                <Col xs={12}>
                                  <Button
                                    type="primary"
                                    htmlType="submit"
                                    block
                                  >
                                    Guardar
                                  </Button>
                                </Col>
                              </Row>
                            </div>
                          )}
                        </div>
                      );
                    }}
                  </Form.List>
                </Form>
              </>
            )}
          </div>
        </div>
      </Form>
    </Drawer>
  );
};

export default EditPipelineAndSteps;
