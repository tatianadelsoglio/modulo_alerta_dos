/* eslint-disable array-callback-return */
/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-unused-vars */
import React, { Fragment, useContext, useEffect, useState } from "react";
import { Form, Select, Row, Col, Button, Popconfirm, Table } from "antd";
import { GET_USUARIO } from "../../Graphql/queries/usuario";
import { useMutation, useQuery } from "@apollo/react-hooks";
import { DeleteOutlined, PlusOutlined } from "@ant-design/icons";
import { COMPARTIR_USUARIO } from "../../Graphql/mutations/usuarios";
import { DealContext } from "../context/DealCotext";
import { DrawerContext } from "../context/DrawContext";

const AddSharedUser = ({ usuarios: users }) => {
  //   const [usuariosCompartido, setUsuariosCompartido] = useState([]);
  // Usuario individual: Es la lista con los ID de los usuarios compartidos.
  //   const [usuarioIndividual, setUsuarioIndividual] = useState([]);
  const [usuarios, setUsuarios] = useState([]);
  const [searchUser, setSearchUser] = useState("");
  const [user, setUser] = useState();
  const [newUsuariosXNegocioResolver] = useMutation(COMPARTIR_USUARIO);
  const { negId } = useContext(DealContext);
  const { onClose } = useContext(DrawerContext);
  const getUsuarios = useQuery(GET_USUARIO, {
    variables: { input: searchUser },
  });
  let usersDefaults = users.map((usuario) => {
    return { usu_nombre: usuario.usu_nombre };
  });

  useEffect(() => {
    if (!usuarios) return;
    if (getUsuarios.data) {
      const { getUsuariosResolver } = getUsuarios.data;

      // filtrar la lista de usuarios.

      // TODO: FILTRAR USUARIOS DE LA LISTA
      const userList = users.filter((userAsig) => {
        getUsuariosResolver.map((user) => {
          if (Number(userAsig.usu_id) !== Number(user.usu_id)) {
            return user;
          } else {
          }
        });
      });

      setUsuarios(getUsuariosResolver);
    }
  }, [getUsuarios.data, usuarios, usersDefaults]);

  const Option = Select.Option;

  // const usersDefaults = [];

  const onChangeSharedUser = (v, user) => {
    // key: "1", value: "1", children: "Binamics"
    setUser(user);
  };

  const onBlur = () => {};

  const onFocus = () => {
    // setSearchUser('');
  };

  const onSearchUser = (val) => {
    if (val.length >= 3) {
      setSearchUser(val.toLowerCase());
    }
  };

  const children = [];
  for (let i = 10; i < 36; i++) {
    children.push(
      <Option key={i.toString(36) + i}>{i.toString(36) + i}</Option>
    );
  }

  ///TODO : Refactoring
  const handleDelete = (key) => {
    let eliminado;
    const usuarioIndividual = users
      .filter((item) => {
        const us = item.usu_nombre !== key.usu_nombre;

        return us;
      })
      .map((user) => {
        return { usu_id: user.usu_id };
      });

    newUsuariosXNegocioResolver({
      variables: {
        idNegocio: negId,
        input: { usuariosIndividual: usuarioIndividual },
      },
    });
  };
  const columns = [
    {
      title: "Usuario",
      dataIndex: "usu_nombre",
      key: "usu_nombre",
      responsive: ["xs", "sm", "md", "lg", "xl", "xxl"],
    },

    {
      title: "...",
      responsive: ["xs", "sm", "md", "lg", "xl", "xxl"],
      dataIndex: "borrar",
      key: "borrar",
      align: "center",
      render: (text, record) => (
        <Popconfirm
          title="¿Deseas eliminar el producto?"
          style={{ width: 300 }}
          okText="Borrar"
          placement="right"
          cancelText="Cerrar"
          onConfirm={() => {
            handleDelete(record);
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Button type="link">
              <DeleteOutlined />
            </Button>
          </div>
        </Popconfirm>
      ),
    },
  ];
  const onFinish = (origen) => {
    // Validar si el usuario ya esta en la lista.

    if (user) {
      const usuarioIndividual = [
        ...users.map((user) => {
          return { usu_id: user.usu_id };
        }),
        {
          usu_id: Number(user.key),
        },
      ];

      newUsuariosXNegocioResolver({
        variables: {
          idNegocio: negId,
          input: { usuariosIndividual: usuarioIndividual },
        },
      });
      setUser("");
      if (origen === "guardar") {
        onClose();
      }
    } else {
      onClose();
    }
  };
  return (
    <Fragment>
      <div className="layout-wrapper">
        <div className="layout-form">
          <Form onFinish={onFinish} layout="vertical">
            <Row gutter={[8, 8]} align="middle">
              <Col xs={22}>
                <Form.Item
                  name="usu_por_negocio"
                  label="Compartir negocio"
                  //  initialValue={usersDefaults}
                >
                  {/* <Input prefix={<UserOutlined />} size="middle" placeholder="" /> */}
                  <Select
                    // disabled={usuarios.length > 0 ? false : true}
                    showSearch
                    placeholder="Usuario"
                    optionFilterProp="children"
                    onChange={onChangeSharedUser}
                    onFocus={onFocus}
                    onBlur={onBlur}
                    onSearch={onSearchUser}
                    loading={usuarios === null ? true : false}
                    filterOption={(input, option) =>
                      option.children.toLowerCase().indexOf(input) >= 0
                    }
                  >
                    {usuarios &&
                      usuarios.map((usuario) => {
                        const { usu_id, usu_nombre } = usuario;

                        return (
                          <Option key={usu_id} value={usu_id}>
                            {usu_nombre}
                          </Option>
                        );
                      })}
                  </Select>
                </Form.Item>
              </Col>
              <Col xs={2}>
                <Button
                  style={{ marginTop: 12 }}
                  type="dashed"
                  onClick={onFinish}
                  shape="circle"
                  icon={<PlusOutlined />}
                />
              </Col>
            </Row>
            <Row gutter={[8, 8]}>
              <Col xs={24}>
                <Table
                  pagination={false}
                  dataSource={usersDefaults}
                  columns={columns}
                  responsive
                  // 	style={{ marginBottom: 10 }}
                />
              </Col>
            </Row>
          </Form>
        </div>
        <div className="layout-footer">
          <Row gutter={[8, 8]}>
            <Col xs={12}>
              <Button
                type="default"
                block
                style={{ marginLeft: 8 }}
                onClick={onClose}
              >
                Volver
              </Button>
            </Col>
            <Col xs={12}>
              <Button
                type="primary"
                block
                style={{ marginLeft: 8 }}
                onClick={() => onFinish("guardar")}
              >
                Guardar
              </Button>
            </Col>
          </Row>
        </div>
      </div>
    </Fragment>
  );
};

export default AddSharedUser;
