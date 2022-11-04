import { useQuery } from "@apollo/client";
import {
  Button,
  Col,
  DatePicker,
  Drawer,
  Form,
  Input,
  Radio,
  Row,
  Select,
  TimePicker,
} from "antd";
import { Fragment, useContext, useEffect, useState } from "react";
import { GET_TIPO_TAREA } from "../../../Graphql/queries/tipoTarea";
import moment from "moment";
import { DealContext } from "../../context/DealCotext";

const DrawerTareas = ({ showDrawerTarea, setShowDrawerTarea }) => {
  const [form] = Form.useForm();
  const [tiposTareas, setTiposTareas] = useState([]);

  const { setMasiveTask, idUser } = useContext(DealContext);

  const { data: dataTipoTareas } = useQuery(GET_TIPO_TAREA, {
    variables: { idCategoria: 1 },
  });

  useEffect(() => {
    if (dataTipoTareas) {
      setTiposTareas(dataTipoTareas.getTiposTareaResolver);
    }
  }, [dataTipoTareas]);

  const onFinish = (v) => {
    const newTask = {
      tar_asunto: v.tar_asunto,
      tar_vencimiento: moment(v.tar_fecha).format("YYYY-MM-DD"),
      usu_id: idUser,
      tip_id: Number(v.tip_id),
      pri_id: Number(v.pri_id),
      tar_horavencimiento: moment(v.tar_horavencimiento).format("HH:mm"),
    };

    setMasiveTask(newTask);
    setShowDrawerTarea(false);
  };

  return (
    <Drawer
      width={600}
      title="Crear tarea"
      name="drawerTareas"
      visible={showDrawerTarea}
      onClose={() => setShowDrawerTarea(false)}
    >
      <Row gutter={[20, 20]}>
        <Col xs={24}>
          <Fragment>
            <Form
              form={form}
              requiredMark="optional"
              name="etapas"
              layout="vertical"
              onFinish={onFinish}
              autoComplete="off"
            >
              <Form.Item
                label="Asunto"
                name="tar_asunto"
                rules={[
                  {
                    required: true,
                    message: "Campo obligatorio",
                  },
                ]}
              >
                <Input.TextArea />
              </Form.Item>
              <Form.Item
                label="Tipo de tarea"
                name="tip_id"
                rules={[
                  {
                    required: true,
                    message: "Campo obligatorio",
                  },
                ]}
              >
                {tiposTareas && (
                  <Select>
                    {tiposTareas.map((item) => {
                      return (
                        <Select.Option key={item.tip_id} value={item.tip_id}>
                          {item.tip_desc}
                        </Select.Option>
                      );
                    })}
                  </Select>
                )}
              </Form.Item>

              <Row>
                <Col xs={7}>
                  <Form.Item
                    initialValue={moment(new Date(), "YYYY-MM-DD")}
                    label="Vencimiento"
                    name="tar_fecha"
                    rules={[
                      {
                        required: true,
                        message: "Campo obligatorio",
                      },
                    ]}
                  >
                    <DatePicker
                      disabledDate={(current) =>
                        current.isBefore(moment().subtract(1, "day"))
                      }
                      style={{ width: "97%", marginRight: 4 }}
                      format="DD/MM/YYYY"
                    />
                  </Form.Item>
                </Col>
                <Col xs={5}>
                  <Form.Item
                    label="Hora"
                    initialValue={moment(new Date(), "YYYY-MM-DD")}
                    name="tar_horavencimiento"
                    rules={[
                      {
                        required: true,
                        message: "Campo obligatorio",
                      },
                    ]}
                  >
                    <TimePicker
                      style={{ width: 150 }}
                      format="HH:mm"
                      use12Hours={false}
                    />
                  </Form.Item>
                </Col>
              </Row>

              <Form.Item name="pri_id" initialValue={"1"}>
                <Row gutter={[20, 20]}>
                  <Col sm={24}>
                    <Radio.Group defaultValue="1" buttonStyle="solid">
                      <Radio.Button value="1">Alta</Radio.Button>
                      <Radio.Button value="2">Media</Radio.Button>
                      <Radio.Button value="3">Baja</Radio.Button>
                    </Radio.Group>
                  </Col>
                </Row>
              </Form.Item>

              <div className="layout-footer-masive">
                <Row gutter={[8, 8]}>
                  <Col xs={12}>
                    <Button
                      onClick={() => setShowDrawerTarea(false)}
                      type="default"
                      block
                    >
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
            </Form>
          </Fragment>
        </Col>
      </Row>
    </Drawer>
  );
};

export default DrawerTareas;
