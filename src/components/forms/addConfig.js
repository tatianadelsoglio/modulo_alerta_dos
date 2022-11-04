import { useMutation, useQuery } from "@apollo/react-hooks";
import React, { useContext, useEffect, useState } from "react";
import { GET_MONEDAS } from "../../Graphql/queries/clientes";
import { Select, Row, Col, Button, Popconfirm } from "antd";
import { Fragment } from "react";
import { Form } from "antd";
import "./form.styles.scss";
import { DealContext } from "../context/DealCotext";
import { NEW_CONGIG } from "../../Graphql/mutations/config";
import TagsConfig from "./tagsConfig";
import { CheckOutlined } from "@ant-design/icons";

const AddConfig = () => {
  const getMonedas = useQuery(GET_MONEDAS);
  const [monedas, setMonedas] = useState([]);
  const Option = Select.Option;
  const [form] = Form.useForm();
  const {
    monConfig,
    setIdMonConfig,
    setShowFilter,
    setCambioMoneda,
    setMonIsoBase,
    setReloadingApp,
    autorizado,
  } = useContext(DealContext);

  const [monId, setMonId] = useState();
  const [setConfiguracionResolver] = useMutation(NEW_CONGIG);
  useEffect(() => {
    if (!monConfig) return;
    if (getMonedas.data) {
      const { getMonedasResolver } = getMonedas.data;
      setMonedas(getMonedasResolver);
    }
  }, [getMonedas.data, monedas, monConfig]);

  const onChangeMoneda = (v) => {
    setMonId(Number(v));
  };

  const onFinish = (v) => {
    setReloadingApp(true);
    setCambioMoneda(true);
    setIdMonConfig(v);
    switch (v) {
      case 1:
        setMonIsoBase("AR$");
        break;
      case 2:
        setMonIsoBase("USD");
        break;
      case 3:
        setMonIsoBase("BRL");
        break;

      default:
        break;
    }
    setConfiguracionResolver({ variables: { monId: v } }).then((value) => {
      setCambioMoneda(false);

      setTimeout(() => {
        setReloadingApp(false);
      }, 5000);
    });
    setShowFilter(false);
  };

  const onCancel = () => {};
  return (
    <Fragment>
      {monedas.length > 0 && monConfig && (
        <Form
          layout="vertical"
          form={form}
          onFinish={onFinish}
          requiredMark="optional"
        >
          <Row gutter={[8, 8]} align="bottom">
            <Col sm={20}>
              <Form.Item
                name="mon_id"
                label="Moneda"
                initialValue={monConfig[0].mon_desc}
                rules={[
                  {
                    type: "string",
                    required: true,
                    message: "Campo obligatorio",
                  },
                ]}
              >
                {monConfig && (
                  <Select
                    className="mon_config"
                    // style={{ width: 200 }}
                    placeholder="Seleccionar Moneda"
                    optionFilterProp="children"
                    onChange={onChangeMoneda}
                  >
                    {monedas.length > 0 &&
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
                )}
              </Form.Item>
            </Col>

            <Col xs={4}>
              <Popconfirm
                title="¿Deseas cambiar de divisa?"
                onConfirm={() => onFinish(monId)}
                onCancel={onCancel}
                okText="Si"
                cancelText="No"
                placement="topRight"
              >
                <Button
                  type="link"
                  htmlType="submit"
                  icon={<CheckOutlined />}
                  style={{ marginBottom: 8 }}
                ></Button>
              </Popconfirm>
            </Col>
          </Row>
          <Row gutter={[8, 8]}>
            <Col xs={24}>
              <TagsConfig autorizado={autorizado}></TagsConfig>
            </Col>
          </Row>
        </Form>
      )}
    </Fragment>
  );
};

export default AddConfig;
