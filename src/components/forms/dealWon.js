/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react/jsx-no-undef */
import { useMutation, useQuery } from "@apollo/react-hooks";
import {
  Button,
  Col,
  Input,
  Row,
  Form,
  Select,
  DatePicker,
  InputNumber,
} from "antd";
import moment from "moment";
import React, { Fragment, useContext, useEffect, useState } from "react";
import { NEW_HISTORIAL_NEGOCIO } from "../../Graphql/mutations/historial";
import { UPDATE_ESTADO_NEGOCIO } from "../../Graphql/mutations/negocio";
import { GET_TIPO_CIERRE_PERDIDO } from "../../Graphql/queries/tipoDecierresPerdidos";
import { setHistorial } from "../../utils/setHistorial";
import { DealContext } from "../context/DealCotext";
import { DrawerContext } from "../context/DrawContext";

const DealWon = () => {
  const [form] = Form.useForm();
  const { onClose } = useContext(DrawerContext);
  const [updateEstadoNegocioResolver] = useMutation(UPDATE_ESTADO_NEGOCIO, {
    onCompleted: () => {
      pollNegocios.initial(1000);
      pollValoresEtapa.initial(1000);

      setTimeout(() => {
        pollNegocios.close();
        pollValoresEtapa.close();
      }, 2000);
    },
  });
  const [newHistorialNegocioResolver] = useMutation(NEW_HISTORIAL_NEGOCIO);
  const { negId, setIdEstado, idUser, pollNegocios, pollValoresEtapa } =
    useContext(DealContext);
  const [fechaCierreReal, setFechaCierreReal] = useState(
    moment().format("YYYY-MM-DD")
  );
  const [tipoCierres, setTipoCierres] = useState([]);

  const { data, loading } = useQuery(GET_TIPO_CIERRE_PERDIDO);
  const Option = Select.Option;

  useEffect(() => {
    if (!data) return;

    if (data) {
      setTipoCierres(data.getTipoCierresPerdidosResolver);
    }
  }, [loading, tipoCierres]);

  const onFinish = (v) => {
    const input = {
      idNegocio: negId,
      idEstado: 1,
      motivo: v.motivo,
      cie_id: v.cie_id,
      fechaCierreReal: fechaCierreReal,
      neg_valorcierre: Number(v.neg_valorcierre),
    };

    const fechaCierreFormateada = moment(fechaCierreReal).format("DD/MM/YYYY");

    updateEstadoNegocioResolver({ variables: { input } }).then(() => {
      setIdEstado(0);
      setHistorial(
        newHistorialNegocioResolver,
        idUser,
        negId,
        0,
        `Negocio cerrado ganado ${fechaCierreFormateada}`,
        // etaId,
        1
      );
      onClose();
    });
  };

  const cancelForm = () => {
    form.resetFields();
    onClose();
  };

  const onChange = (value) => {};

  const onBlur = () => {};

  const onFocus = () => {};

  const onSearch = (val) => {};

  return (
    <Fragment>
      <Form
        layout="vertical"
        form={form}
        onFinish={onFinish}
        requiredMark="optional"
      >
        <div className="layout-wrapper">
          <div className="layout-form">
            <Row>
              <Col xs={24}>
                <Form.Item
                  name="cie_id"
                  label="Tipo"
                  rules={[
                    {
                      type: "number",
                      required: true,
                      message: "Campo obligatorio",
                    },
                  ]}
                >
                  <Select
                    showSearch
                    placeholder="Tipo de cierre"
                    optionFilterProp="children"
                    onChange={onChange}
                    onFocus={onFocus}
                    onBlur={onBlur}
                    onSearch={onSearch}
                    filterOption={(input, option) =>
                      option.children
                        .toLowerCase()
                        .indexOf(input.toLowerCase()) >= 0
                    }
                  >
                    {tipoCierres.length > 0 &&
                      tipoCierres.map((item) => {
                        const { cie_id, cie_desc } = item;
                        return (
                          <Option key={cie_id} value={cie_id} title={cie_desc}>
                            {cie_desc}
                          </Option>
                        );
                      })}
                  </Select>
                </Form.Item>
              </Col>
            </Row>
            <Row>
              <Col xs={24}>
                <Form.Item
                  name="motivo"
                  label="Motivo"
                  rules={[
                    {
                      type: "string",
                      required: true,
                      message: "Campo obligatorio",
                    },
                  ]}
                >
                  <Input.TextArea placeholder="¿Cuál fue el motivo de la pérdida del negocio?" />
                </Form.Item>
              </Col>
            </Row>
            <Form.Item name="neg_valorcierre" label="Valor de cierre" required>
              <InputNumber />
            </Form.Item>

            <Form.Item name="fechaCierreReal" label="Fecha de cierre" required>
              <DatePicker
                format={"YYYY-MM-DD"}
                onChange={(v, d) => {
                  setFechaCierreReal(d);
                }}
                picker="date"
              />
            </Form.Item>
          </div>
          <div className="layout-footer">
            <Form.Item>
              <Row gutter={[8, 8]}>
                <Col xs={12}>
                  <Button onClick={cancelForm} type="default" block>
                    Cancelar
                  </Button>
                </Col>
                <Col xs={12}>
                  <Button htmlType="submit" type="primary" block>
                    Guardar
                  </Button>
                </Col>
              </Row>
            </Form.Item>
          </div>
        </div>
      </Form>
    </Fragment>
  );
};

export default DealWon;
