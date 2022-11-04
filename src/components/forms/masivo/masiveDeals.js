/* eslint-disable no-unused-vars */
/* eslint-disable react-hooks/exhaustive-deps */
import { useMutation, useQuery } from "@apollo/client";
import {
  Button,
  Col,
  DatePicker,
  Drawer,
  Form,
  Input,
  Row,
  Select,
  Transfer,
  Typography,
} from "antd";
import React, { useContext, useEffect, useState } from "react";
import { NEW_NEGOCIO_MASIVO } from "../../../Graphql/mutations/negocio";
import { GET_MONEDAS } from "../../../Graphql/queries/clientes";
import { GET_EMBUDOS_CON_ETAPAS } from "../../../Graphql/queries/embudos";
import { DealContext } from "../../context/DealCotext";
import { DrawerContext } from "../../context/DrawContext";
import FunnelStep from "../../funnelSteps/funnelStep";
import OpenNotification from "../../notifications/openNotification";
import DrawerClientes from "./drawerClientes";
import DrawerTareas from "./drawerTarea";
import {
  CalendarOutlined,
  CheckOutlined,
  ShopOutlined,
} from "@ant-design/icons";
import moment from "moment";

const MasiveDeals = () => {
  const [form] = Form.useForm();

  const [showDrawerClientes, setShowDrawerClientes] = useState(false);
  const [showDrawerTarea, setShowDrawerTarea] = useState(false);
  const [pipelines, setPipelines] = useState([]);
  const [monedas, setMonedas] = useState([]);

  const [stepsFinal, setStepsFinal] = useState([]);
  const [funnelStep, setFunnelStep] = useState(null);
  const [steps, setSteps] = useState([]);

  const { data: dataPipelines } = useQuery(GET_EMBUDOS_CON_ETAPAS);
  const { data: dataMonedas } = useQuery(GET_MONEDAS);

  const [newNegocioMasivoResolver] = useMutation(NEW_NEGOCIO_MASIVO);

  const {
    monConfig,
    pipelineName,
    idPipeline,
    allSteps,
    setPipelineSpin,
    etaIdParaForm,
    listadoClientesMasivo,
    idUser,
    masiveTask,
    setListadoClientesMasivo,
    setMasiveTask,
    usuAsigMasiveTask,
  } = useContext(DealContext);
  const { onClose } = useContext(DrawerContext);

  useEffect(() => {
    if (dataPipelines) {
      setPipelines(dataPipelines.getPipelineWithStagesResolver);
    }
    setStepsFinal(allSteps);
  }, [dataPipelines]);

  useEffect(() => {
    if (dataMonedas) {
      setMonedas(dataMonedas.getMonedasResolver);
    }
  }, [dataMonedas]);

  const onFinish = (v) => {
    if (listadoClientesMasivo.length === 0) {
    } else {
      newNegocioMasivoResolver({
        variables: {
          etaId: Number(etaIdParaForm),
          input: {
            neg_asunto: v.neg_asunto,
            cli_id: null, //! necesario enviar null en este caso para enviar aparte el listado de clientes
            con_id: null,
            neg_estado: 0,
            usu_id: idUser,
            usu_asig_id: usuAsigMasiveTask ? Number(usuAsigMasiveTask) : idUser,
            neg_fechacierre: moment(v.neg_fechacierre).format("YYYY-MM-DD"),
            neg_valor: Number(v.neg_valor),
            mon_id: Number(v.mon_id),
          },
          listadoClientes: JSON.stringify(listadoClientesMasivo), //! enviado como string para simplificar schema desde backend
          inputTarea: masiveTask,
        },
      });
      form.resetFields();
      onClose();
      OpenNotification(
        <h4>Se crearon {listadoClientesMasivo.length} negocios.</h4>,
        null,
        "topleft",
        <CheckOutlined style={{ color: "green" }} />,
        null
      );
      setPipelineSpin(3);
      setListadoClientesMasivo([]);
      setMasiveTask(null);
    }
  };

  return (
    <>
      <Form layout="vertical" form={form} name="dealMasivo" onFinish={onFinish}>
        <div className="layout-wrapper-masive">
          <Row
            style={{
              display: "flex",
              alignItems: "baseline",
              justifyContent: "space-between",
            }}
          >
            <Form.Item>
              <Button onClick={() => setShowDrawerClientes(true)}>
                <ShopOutlined /> Asignar a clientes
              </Button>
            </Form.Item>

            {listadoClientesMasivo.length > 0 && (
              <span>
                Clientes seleccionados: {listadoClientesMasivo.length}
              </span>
            )}
          </Row>

          {/* <Typography.Text type="danger">Ant Design (danger)</Typography.Text> */}

          <Form.Item
            name="neg_asunto"
            label="Asunto"
            rules={[
              {
                type: "string",
                required: true,
                message: "",
              },
            ]}
          >
            <Input />
          </Form.Item>

          <Row gutter={[8, 8]}>
            <Col xs={10}>
              <Form.Item
                name="neg_valor"
                label="Valor"
                rules={[
                  {
                    required: true,
                    message: "",
                  },
                ]}
              >
                <Input type="number" />
              </Form.Item>
            </Col>
            <Col xs={14}>
              <Form.Item
                name="mon_id"
                label="Moneda"
                initialValue={
                  monConfig && monConfig[0] && String(monConfig[0].mon_id)
                }
                rules={[
                  {
                    type: "string",
                    required: true,
                    message: "",
                  },
                ]}
              >
                <Select
                  placeholder="Seleccionar Moneda"
                  optionFilterProp="children"
                >
                  {monedas.length > 0 &&
                    monedas.map((moneda) => {
                      const { mon_id, mon_divisa, mon_iso } = moneda;

                      return (
                        <Select.Option
                          key={mon_id}
                          title={mon_divisa}
                          value={mon_id}
                        >
                          {mon_divisa} ({mon_iso})
                        </Select.Option>
                      );
                    })}
                </Select>
              </Form.Item>
            </Col>
          </Row>
          <Form.Item
            name="pip_id"
            label="Embudo"
            initialValue={pipelineName}
            rules={[
              {
                type: "string",
                required: true,
                message: "",
              },
            ]}
          >
            <Select
              showSearch
              placeholder="Seleccionar embudo"
              optionFilterProp="children"
              filterOption={(input, option) =>
                option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
              }
            >
              {pipelines &&
                pipelines.map((pipeline) => {
                  const { pip_nombre, pip_id } = pipeline;
                  return (
                    <Select.Option key={pip_id} value={pip_id}>
                      {pip_nombre}
                    </Select.Option>
                  );
                })}
            </Select>
          </Form.Item>

          <Form.Item>
            {stepsFinal && (
              <Row gutter={[8, 8]}>
                <Col xs={24}>
                  <Form.Item name="eta_id">
                    <FunnelStep
                      idPipeline={idPipeline}
                      steps={steps}
                      setFunnelStep={setFunnelStep}
                      stepsFinal={stepsFinal}
                    ></FunnelStep>
                  </Form.Item>
                </Col>
              </Row>
            )}
          </Form.Item>

          <Row gutter={[8, 8]}>
            <Col xs={24}>
              <Form.Item
                name="neg_fechacierre"
                label="Fecha prevista de cierre"
                rules={[
                  {
                    type: "date",
                    required: true,
                    message: "",
                  },
                ]}
              >
                <DatePicker format="DD/MM/YYYY" style={{ width: "100%" }} />
              </Form.Item>
            </Col>
          </Row>

          <Form.Item>
            <Button onClick={() => setShowDrawerTarea(true)} type={"dashed"}>
              <CalendarOutlined /> Crear tarea asignada al negocio
            </Button>
          </Form.Item>
          <div className="layout-footer-masive">
            <Row gutter={[8, 8]}>
              <Col xs={12}>
                <Button onClick={() => onClose()} type="default" block>
                  Cancelar
                </Button>
              </Col>
              <Col xs={12}>
                <Button htmlType="submit" block type="primary">
                  Guardar
                </Button>
              </Col>
            </Row>
          </div>
        </div>
      </Form>

      <DrawerClientes
        showDrawerClientes={showDrawerClientes}
        setShowDrawerClientes={setShowDrawerClientes}
      />
      <DrawerTareas
        showDrawerTarea={showDrawerTarea}
        setShowDrawerTarea={setShowDrawerTarea}
      />
    </>
  );
};

export default MasiveDeals;
