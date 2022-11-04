import { DeleteOutlined, PlusOutlined } from "@ant-design/icons";
import { useMutation } from "@apollo/client";
import {
  Button,
  Card,
  Col,
  ConfigProvider,
  Empty,
  Form,
  Input,
  InputNumber,
  Popconfirm,
  Row,
  Table,
} from "antd";
import TextArea from "antd/lib/input/TextArea";
import React, { Fragment, useContext, useEffect } from "react";
import { NEW_COMPETIDORES_NEGOCIO } from "../../Graphql/mutations/competidores";
import { setHistorial } from "../../utils/setHistorial";
import { DealContext } from "../context/DealCotext";
import { DrawerContext } from "../context/DrawContext";

const empty = () => {
  return (
    <Empty
      // image="../../assets/empty.svg"
      imageStyle={{
        height: 60,
        color: "red",
      }}
      description={<span>Ningun competidor agregado.</span>}
    >
      {/* <Button type="primary">Create Now</Button> */}
    </Empty>
  );
};

const AddCompetitors = () => {
  const [form] = Form.useForm();
  const { onChildrenDrawerClose, onClose } = useContext(DrawerContext);
  const {
    competitors,
    dealCompetitors,
    setCompetitors,
    setDealCompetitors,
    pathname,
    negId,
    newHistorialNegocioResolver,
    deal,
    idUser,
  } = useContext(DealContext);
  const [newCompetidoresXNegocioResolver] = useMutation(
    NEW_COMPETIDORES_NEGOCIO
  );

  useEffect(() => {}, [pathname, competitors, dealCompetitors]);

  // Se crea el negocio y se agregan competidores.
  const onFinish = (val) => {
    // si competiors tiene length

    let index = 0;
    if (competitors.length > 0) {
      index = competitors.length;
    }
    const comp = {
      com_id: index,
      com_nombre: val.com_nombre,
      com_producto: val.com_producto,
      com_precio: Number(val.com_precio),
      com_fortalezas: val.com_fortalezas,
      com_debilidades: val.com_debilidades,
    };

    // if (pathname === "/") {
    //   setDealCompetitors([...dealCompetitors, comp]);
    //   setCompetitors([...competitors, comp]);
    // } else {
    //   setCompetitors([...competitors, comp]);
    //   setDealCompetitors([...dealCompetitors, comp]);
    // }
    setCompetitors([...competitors, comp]);
    setDealCompetitors([...dealCompetitors, comp]);

    form.resetFields();
  };

  const handleDelete = (key) => {
    const comp = competitors ? competitors : dealCompetitors;

    const item = comp.filter((item) => {
      return item.com_id !== key;
    });

    // if (pathname === "/") {
    setCompetitors(item);
    setDealCompetitors(item);
    // } else {
    //   setDealCompetitors(item);
    // }
  };

  const columns = [
    { title: "Nombre", dataIndex: "com_nombre", key: "com_id" },
    {
      title: "Producto",
      dataIndex: "com_producto",
      key: "producto",
    },
    {
      title: "Precio",
      dataIndex: "com_precio",
      key: "precio",
      render: (text, record) => {
        return (
          <span>
            U$D{" "}
            {Number(text).toLocaleString("de-DE", {
              maximumFractionDigits: 2,
            })}
          </span>
        );
      },
    },
    {
      title: "...",
      dataIndex: "",
      key: "com_id",
      align: "center",
      render: (text, record) => {
        return (
          <Popconfirm
            title="¿Deseas eliminar el competidor?"
            okText="Borrar"
            cancelText="Cerrar"
            onConfirm={() => handleDelete(record.com_id)}
          >
            <div
              style={{
                display: "flex",
                width: "100%",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Button type="link">
                <DeleteOutlined />
              </Button>
            </div>
          </Popconfirm>
        );
      },
    },
  ];

  // Se agregan competidores una vez creado el negocio
  const saveCompetitors = () => {
    if (competitors.length > 0 || dealCompetitors.length > 0) {
      let competitorsList = [];

      if (competitors.length > 0) {
        competitorsList = competitors.map((item) => {
          let {
            com_producto,
            com_nombre,
            com_precio,
            com_fortalezas,
            com_debilidades,
          } = item;
          const competitor = {
            com_fortalezas,
            com_debilidades,
            com_producto,
            com_nombre,
            com_precio: Number(com_precio),
          };

          return competitor;
        });
      }

      if (dealCompetitors.length > 0) {
        competitorsList = dealCompetitors.map((item) => {
          let {
            com_producto,
            com_nombre,
            com_precio,
            com_fortalezas,
            com_debilidades,
          } = item;
          const competitor = {
            com_fortalezas,
            com_debilidades,
            com_producto,
            com_nombre,
            com_precio: Number(com_precio),
          };

          return competitor;
        });
      }

      if (competitorsList.length === 0) return;
      newCompetidoresXNegocioResolver({
        variables: {
          input: { competidoresXNegIndividual: competitorsList },
          idNegocio: negId,
        },
      }).then(() => {
        setHistorial(
          newHistorialNegocioResolver,
          idUser,
          negId,
          deal.eta_id,
          "Se crearon competidores",
          -1
        );
        setCompetitors([]);
      });
    } else {
      newCompetidoresXNegocioResolver({
        variables: {
          input: { competidoresXNegIndividual: [] },
          idNegocio: negId,
        },
      }).then(() => {
        setHistorial(
          newHistorialNegocioResolver,
          idUser,
          negId,
          deal.eta_id,
          "Se eliminaron competidores",
          -1
        );
        setCompetitors([]);
      });
    }
    onChildrenDrawerClose();
    if (pathname === "/negocio") {
      onClose();
    }
  };

  return (
    <Fragment>
      <ConfigProvider renderEmpty={empty}>
        <Form
          name="competitors"
          layout="vertical"
          requiredMark="optional"
          form={form}
          onFinish={onFinish}
          autoComplete="off"
        >
          <div className="layout-wrapper">
            <div className="layout-form">
              <Row align="middle" justify="space-between" gutter={[5, 5]}>
                <Col xs={10}>
                  <Form.Item
                    name="com_nombre"
                    rules={[
                      {
                        type: "string",
                        required: true,
                        message: "Campo obligatorio",
                      },
                    ]}
                  >
                    <Input size="middle" placeholder="Nombre" />
                  </Form.Item>
                </Col>
                <Col xs={10}>
                  <Form.Item
                    name="com_producto"
                    rules={[
                      {
                        type: "string",
                        required: true,
                        message: "Campo obligatorio",
                      },
                    ]}
                  >
                    <Input size="middle" placeholder="Producto" />
                  </Form.Item>
                </Col>
                <Col xs={4}>
                  <Form.Item
                    name="com_precio"
                    rules={[
                      {
                        required: true,
                        message: "Campo obligatorio",
                      },
                    ]}
                  >
                    <InputNumber
                      placeholder="Valor"
                      decimalSeparator=","
                      min={0}
                    />
                  </Form.Item>
                </Col>
              </Row>
              <Row align="middle" justify="space-between" gutter={[5, 5]}>
                <Col xs={12}>
                  <Form.Item
                    name="com_fortalezas"
                    rules={[
                      {
                        type: "string",
                        required: true,
                        message: "Campo obligatorio",
                      },
                    ]}
                  >
                    <TextArea placeholder="Añade las fortalezas..." />
                  </Form.Item>
                </Col>
                <Col xs={12}>
                  <Form.Item
                    name="com_debilidades"
                    rules={[
                      {
                        type: "string",
                        required: true,
                        message: "Campo obligatorio",
                      },
                    ]}
                  >
                    <TextArea placeholder="Añade las debilidades..." />
                  </Form.Item>
                </Col>
              </Row>
              <Row align="middle" justify="center" gutter={[5, 5]}>
                <Col
                  xs={24}
                  style={{
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    width: "100%",
                  }}
                >
                  <Form.Item>
                    <Button
                      style={{ textAlign: "center" }}
                      htmlType="submit"
                      type="dashed"
                      shape="circle"
                    >
                      <PlusOutlined />
                    </Button>
                  </Form.Item>
                </Col>
                <Form.Item></Form.Item>
              </Row>

              <Row>
                <Col xs={24}>
                  <Table
                    pagination={false}
                    columns={columns}
                    expandable={{
                      expandedRowRender: (record) => {
                        return (
                          <Row
                            align="middle"
                            justify="space-around"
                            gutter={[12, 12]}
                          >
                            <Col xs={12}>
                              <Card title="Fortalezas">
                                {record.com_fortalezas}
                              </Card>
                            </Col>
                            <Col xs={12}>
                              <Card title="Debilidades">
                                {record.com_debilidades}
                              </Card>
                            </Col>
                          </Row>
                        );
                      },
                      rowExpandable: (record) =>
                        record.name !== "Not Expandable",
                    }}
                    dataSource={
                      pathname === "/negocio" ? dealCompetitors : competitors
                    }
                  />
                </Col>
              </Row>
            </div>
            <div className="layout-footer">
              {pathname === "/negocio" ? (
                <Form.Item>
                  <Row gutter={[8, 8]}>
                    <Col xs={12}>
                      <Button onClick={onClose} type="default" block>
                        Cancelar
                      </Button>
                    </Col>
                    <Col xs={12}>
                      <Button onClick={saveCompetitors} type="primary" block>
                        Guardar
                      </Button>
                    </Col>
                  </Row>
                </Form.Item>
              ) : (
                <Form.Item>
                  <Row gutter={[8, 8]}>
                    <Col xs={24}>
                      <Button
                        onClick={onChildrenDrawerClose}
                        type="default"
                        block
                        style={{ marginBottom: "100px", position: "relative" }}
                      >
                        Volver
                      </Button>
                    </Col>
                  </Row>
                </Form.Item>
              )}
            </div>
          </div>
        </Form>
      </ConfigProvider>
    </Fragment>
  );
};

export default AddCompetitors;
