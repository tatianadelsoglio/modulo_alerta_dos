import { useMutation, useQuery } from "@apollo/react-hooks";
import {
  Button,
  Col,
  DatePicker,
  Form,
  Input,
  Row,
  Select,
  InputNumber,
} from "antd";
import locale from "antd/es/date-picker/locale/es_ES";
import moment from "moment";
import "moment/locale/es";
import React, { Fragment, useContext, useEffect, useState } from "react";
import { UPDATE_NEGOCIO } from "../../Graphql/mutations/negocio";
import { GET_MONEDAS } from "../../Graphql/queries/clientes";
import { DealContext } from "../context/DealCotext";
import { DrawerContext } from "../context/DrawContext";
import "./form.styles.scss";

const EditDealForm = ({ deal }) => {
  const [form] = Form.useForm();
  const { onClose } = useContext(DrawerContext);
  const [monedas, setMonedas] = useState([]);
  const { negId, idUser } = useContext(DealContext);
  const { data } = useQuery(GET_MONEDAS);
  const [updateNegocioResolver] = useMutation(UPDATE_NEGOCIO);
  const [fechaCierre, setFechaCierre] = useState();

  const Option = Select.Option;
  useEffect(() => {
    if (data) {
      setMonedas(data.getMonedasResolver);
    }
  }, [data]);

  const determinarMoneda = () => {
    //Debido a que la info viene por props (deal) contamos con mon_iso por lo tanto debemos hacer un case para que devuelva la moneda
    switch (true) {
      case deal.mon_iso === "ARS":
        return 1;
      case deal.mon_iso === "USD":
        return 2;
      case deal.mon_iso === "BRS":
        return 3;
      default:
        break;
    }
  };

  const onFinish = (value) => {
    const input = {
      neg_asunto: value.neg_asunto,
      neg_valor: Number(value.neg_valor),
      neg_fechacierre:
        fechaCierre || moment(value.neg_fechacierre).format("YYYY-MM-DD"),
      mon_id: Number(value.mon_id),
    };

    // Guardar los cambios
    updateNegocioResolver({
      variables: {
        // usuId: Number(localStorage.getItem("usuario")),
        usuId: idUser,
        etaId: deal.eta_id,
        idNegocio: negId,
        input,
      },
    });

    form.resetFields();
    onClose();
  };
  const cancelForm = () => {
    form.resetFields();
    onClose();
  };

  // const onChangeDate = (v) => {
  //   const date = moment(v).format("YYYY-MM-DD");

  //   // Setea la fecha de cierre
  //   fecha_cierre = date;
  // };

  return (
    <Fragment>
      <Form
        layout="vertical"
        form={form}
        onFinish={onFinish}
        //requiredMark="optional"
      >
        <div className="layout-wrapper">
          <div className="layout-form">
            <Row>
              <Col xs={24}>
                <Form.Item
                  name="neg_asunto"
                  label="Asunto"
                  initialValue={deal.neg_asunto}
                  //initialValue={negocio.neg_asunto}
                >
                  <Input size="middle" placeholder="" />
                </Form.Item>
              </Col>
            </Row>
            <Row gutter={[8, 8]}>
              <Col xs={10}>
                <Form.Item
                  name="neg_valor"
                  label="Valor"
                  initialValue={deal.neg_valor && deal.neg_valor}
                >
                  <InputNumber type="number" />
                </Form.Item>
              </Col>
              <Col xs={14}>
                <Form.Item
                  name="mon_id"
                  label="Moneda"
                  initialValue={String(determinarMoneda())}
                >
                  <Select
                    placeholder="Seleccionar Moneda"
                    optionFilterProp="children"
                  >
                    {monedas &&
                      monedas.length > 0 &&
                      monedas.map((moneda) => {
                        const { mon_id, mon_divisa, mon_iso } = moneda;

                        return (
                          <Option
                            key={mon_id}
                            title={mon_divisa}
                            value={mon_id}
                          >
                            {mon_divisa} ({mon_iso})
                          </Option>
                        );
                      })}
                  </Select>
                </Form.Item>
              </Col>
            </Row>

            <Row gutter={[8, 8]}>
              <Col xs={24}>
                <Form.Item
                  name="neg_fechacierre"
                  label="Fecha prevista de cierre"
                  initialValue={
                    deal.neg_fechacierre && moment(deal.neg_fechacierre)
                  }
                >
                  <DatePicker
                    locale={locale}
                    format="DD/MM/YYYY"
                    style={{ width: "100%" }}
                    onChange={(value, v) => {
                      const fechaCierreFormat = v
                        .split("/")
                        .reverse()
                        .join("-");
                      setFechaCierre(fechaCierreFormat);
                    }}
                  />
                </Form.Item>
              </Col>
            </Row>
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
export default EditDealForm;
