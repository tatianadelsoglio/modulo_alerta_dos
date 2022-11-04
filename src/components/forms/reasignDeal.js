import {
  CheckOutlined,
  InfoCircleFilled,
  InfoCircleOutlined,
  InfoOutlined,
} from "@ant-design/icons";
import { useMutation, useQuery } from "@apollo/client";
import { Button, Col, Form, Row, Select } from "antd";
import { useState } from "react";
import { useContext, useEffect } from "react";
import { REASIGN_NEGOCIO } from "../../Graphql/mutations/negocio";
import { GET_USUARIO, GET_USUARIO_ASIG } from "../../Graphql/queries/usuario";
import { DealContext } from "../context/DealCotext";
import { DrawerContext } from "../context/DrawContext";
import OpenNotification from "../notifications/openNotification";

const ReasignDeal = () => {
  const [form] = Form.useForm();
  const [currentUser, setCurrentUser] = useState();
  const [userList, setUserList] = useState([]);
  const [searchUser, setSearchUser] = useState("");

  const { deal } = useContext(DealContext);
  const { onClose } = useContext(DrawerContext);

  const [reasignNegocioResolver] = useMutation(REASIGN_NEGOCIO, {
    onCompleted: () => {
      OpenNotification(
        <h4>Se reasignó el negocio correctamente.</h4>,
        null,
        "topleft",
        <CheckOutlined style={{ color: "green" }} />,
        null
      );
      onClose();
    },
  });

  const { data: dataUsuarioAsig } = useQuery(GET_USUARIO_ASIG, {
    variables: { idUsuAsig: deal.usu_asig_id },
  });

  const { data: dataUsuarios } = useQuery(GET_USUARIO, {
    variables: { input: searchUser },
  });

  const onSearchUser = (val) => {
    setSearchUser(val);
  };

  useEffect(() => {
    if (dataUsuarioAsig) {
      const { getUsuAsigResolver } = dataUsuarioAsig;
      setCurrentUser(getUsuAsigResolver[0].usu_nombre);
    }
  }, [dataUsuarioAsig]);

  useEffect(() => {
    if (dataUsuarios) {
      setUserList(dataUsuarios.getUsuariosResolver);
    }
  }, [dataUsuarios]);

  return (
    <Form
      layout="vertical"
      form={form}
      onFinish={(v) => {
        reasignNegocioResolver({
          variables: {
            idNegocio: Number(deal.neg_id),
            idUsuario: Number(v.reasigUsu),
          },
        });
      }}
    >
      <div className="layout-wrapper">
        <div className="layout-form">
          <p>
            Usuario asignado actual: <strong>{currentUser}</strong>
          </p>
          <div className="divider"></div>
          <Form.Item name={"reasigUsu"} label="Seleccione un nuevo usuario">
            <Select
              allowClear
              showSearch
              placeholder="Usuario"
              optionFilterProp="children"
              onSearch={onSearchUser}
              loading={userList === null ? true : false}
              filterOption={(input, option) =>
                option.children.toLowerCase().indexOf(input) >= 0
              }
              style={{ width: "100%", marginBottom: "30px" }}
            >
              {userList &&
                userList.map((user) => {
                  return (
                    <Select.Option key={user.usu_id}>
                      {user.usu_nombre}
                    </Select.Option>
                  );
                })}
            </Select>
          </Form.Item>

          <p
            style={{
              width: "100%",
              fontSize: " 0.8rem",
              color: "rgb(196, 196, 196)",
            }}
          >
            <InfoCircleOutlined />{" "}
            <strong>
              Todas las tareas abiertas del negocio van a ser reasignadas.
            </strong>
          </p>
        </div>
        <div className="layout-footer">
          <Row gutter={[8, 8]}>
            <Col xs={12}>
              <Button type="default" block onClick={() => onClose()}>
                Cancelar
              </Button>
            </Col>
            <Col xs={12}>
              <Button htmlType="submit" type="primary" block>
                Guardar
              </Button>
            </Col>
          </Row>
        </div>
      </div>
    </Form>
  );
};

export default ReasignDeal;
