/* eslint-disable no-unused-vars */
import React, { Fragment, useContext, useEffect, useState } from "react";
import { Form, Input, Button, Space, InputNumber, Row, Col } from "antd";
import { MinusCircleOutlined, PlusOutlined } from "@ant-design/icons";
import { useMutation } from "@apollo/client";
import { NEW_PIPELINE } from "../../Graphql/mutations/pipelines";
import { NEW_ETAPAS_POR_EMBUDO } from "../../Graphql/mutations/etapas";
import { DrawerContext } from "../context/DrawContext";
import { DealContext } from "../context/DealCotext";
import useNewPipelineSubs from "../../Graphql/subscriptions/usePollAlertSubscription";
import usePollAlertSubscription from "../../Graphql/subscriptions/usePollAlertSubscription";

const NewPipeline = ({ idPipeline }) => {
  const { startPollingEmbudos, stopPollingEmbudos, setPipelineFlag } =
    useContext(DealContext);

  const [form] = Form.useForm();
  const {
    onClose,
    setDrawerName,
    setDrawerDetail,
    newPipelineState,
    setNewPipelineState,
  } = useContext(DrawerContext);

  const [showStepForm, setShowStepForm] = useState(newPipelineState);
  const [idNewPipeline, setIdNewPipeline] = useState(0);
  const [newPipelineResolver] = useMutation(NEW_PIPELINE, {
    onCompleted: () => {
      setPipelineFlag(true);
      // setTimeout(() => {
      //   startPollingEmbudos(500);
      // }, 1000);
      // setTimeout(() => {
      //   stopPollingEmbudos();
      // }, 2000);
    },
  });

  const [newEtapaPipelineResolver] = useMutation(NEW_ETAPAS_POR_EMBUDO);

  useEffect(() => {
    setShowStepForm(newPipelineState);
  }, [newPipelineState]);

  const saveSteps = (values, idPipeline) => {
    let arrayEtapas = [];
    values.etapas.forEach((etapa, i) => {
      const input = {
        ...etapa,
        eta_diasinactivos: Number(etapa.eta_diasinactivos),
        eta_orden: i + 1,
        pip_id: idPipeline,
      };
      arrayEtapas = [...arrayEtapas, input];
    });
    newEtapaPipelineResolver({
      variables: { input: { etapaIndividual: arrayEtapas } },
    }).then(() => {
      // setTimeout(() => {
      // 	getEmbudos.startPolling(500);
      // 	getEtapasSuma.startPolling(500);
      // }, 1000);
      // setTimeout(() => {
      // 	getEmbudos.stopPolling();
      // 	getEtapasSuma.stopPolling();
      // }, 2000);
    });
  };
  const onFinish = (values) => {
    // saveSteps(values, idPipeline);
    if (newPipelineState && idNewPipeline === 0) {
      // Crear etapa para un pipeline credo
      saveSteps(values, idPipeline);
      form.resetFields();
      onClose();
      setDrawerDetail("");
      setNewPipelineState(true);
    } else {
      // Crear pipeline y etapa desde cero
      if (idNewPipeline === 0) {
        setDrawerName(`Agregar Etapas`);
        setDrawerDetail(` - ${values.pip_nombre}`);
        const input = {
          pip_nombre: values.pip_nombre.toUpperCase(),
          usu_id: 1,
        };
        newPipelineResolver({
          variables: {
            input,
          },
        }).then((item) => {
          let { pip_id } = item.data.newPipelineResolver;
          pip_id = Number(pip_id);
          setIdNewPipeline(pip_id);
          setNewPipelineState(true);
        });
        // .finally(() => {
        //   // setIdNewPipeline(null);
        //   // setNewPipelineState(false);
        // });
        // setDrawerName(`Crear Etapas`);
        // setRenameDrawer(`Crear Etapas - ${values.pip_nombre}`);
        // setNewPipelineState(true);
      } else {
        saveSteps(values, idNewPipeline);
        form.resetFields();
        setNewPipelineState(false);
        onClose();
        setDrawerDetail("");
        setIdNewPipeline(0);
        // StartPolling
      }
    }
    // embudos.startPolling(500);
    // etapas.startPolling(500);
  };

  return (
    <Fragment>
      <Form
        form={form}
        requiredMark="optional"
        name="etapas"
        layout="vertical"
        onFinish={onFinish}
        autoComplete="off"
      >
        <div className="layout-wrapper">
          <div className="layout-form">
            {!showStepForm && (
              <Fragment>
                <Form.Item
                  label="Nombre del Embudo"
                  name="pip_nombre"
                  rules={[{ required: true, message: "Nombre requerido" }]}
                >
                  <Input placeholder="Nombre del Embudo" type="text" />
                </Form.Item>
                <Form.Item>
                  <Button type="primary" htmlType="submit" block>
                    Siguiente
                  </Button>
                </Form.Item>
              </Fragment>
            )}

            {showStepForm && (
              <Form.List name="etapas">
                {(fields, { add, remove }) => {
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
                              { required: true, message: "campo obligatorio" },
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
                            <InputNumber min={0} max={100} placeholder="%" />
                          </Form.Item>
                          <Form.Item
                            {...field}
                            name={[field.name, "eta_diasinactivos"]}
                            fieldKey={[field.fieldKey, "eta_diasinactivos"]}
                            rules={[{ required: true, message: "obligatorio" }]}
                          >
                            <Input placeholder="días" style={{ width: 60 }} />
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
                    </div>
                  );
                }}
              </Form.List>
            )}
          </div>
          <div className="layout-footer">
            <Row gutter={[8, 8]}>
              <Col xs={12}>
                <Button type="default" onClick={onClose} block>
                  Cancelar
                </Button>
              </Col>
              <Col xs={12}>
                <Button type="primary" htmlType="submit" block>
                  Guardar
                </Button>
              </Col>
            </Row>
          </div>
        </div>
      </Form>
    </Fragment>
  );
};

export default NewPipeline;
