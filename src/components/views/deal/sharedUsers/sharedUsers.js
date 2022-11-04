import React, { useContext, useEffect, useState } from "react";
import { List, Button, Popconfirm } from "antd";
import { Fragment } from "react";
import { DrawerContext } from "../../../context/DrawContext";
import { COMPARTIR_USUARIO } from "../../../../Graphql/mutations/usuarios";
import { DealContext } from "../../../context/DealCotext";
import { DeleteOutlined } from "@ant-design/icons";
import { useMutation } from "@apollo/client";

const SharedUsers = ({ usuarios }) => {
  const { showDrawer, setDrawerName, setDrawerDetail } =
    useContext(DrawerContext);
  const { negId, idUser, deal } = useContext(DealContext);
  const [users, setUsers] = useState();
  const [newUsuariosXNegocioResolver] = useMutation(COMPARTIR_USUARIO);

  useEffect(() => {
    if (!usuarios) return;
    setUsers(usuarios);
  }, [usuarios, users]);

  //   const dataUser = usuarios.map((user) => user.usu_id);

  //   const Option = Select.Option;/*  */

  //   const children = () => {
  //     return usuarios.map((usuario, i) => {
  //       const { usu_id, usu_nombre } = usuario;

  //       return (
  //         <Option key={usu_id} value={usu_id}>
  //           {usu_nombre}
  //         </Option>
  //       );
  //     });
  //   };

  const onDelete = (id) => {
    const usuarios = users
      .filter((user) => {
        return user.usu_id !== id;
      })
      .map((user) => {
        const input = {
          usu_id: user.usu_id,
        };
        return input;
      });

    newUsuariosXNegocioResolver({
      variables: { idNegocio: negId, input: { usuariosIndividual: usuarios } },
    });
    // setUsers(usuarios);
  };

  const addUsers = () => {
    setDrawerName("Añadir usuarios compartidos");
    setDrawerDetail("");
    showDrawer();
  };
  return (
    <Fragment>
      {usuarios.length > 0 && (
        <List
          size="small"
          // header={<div>Header</div>}
          // footer={<div>Footer</div>}

          bordered
          dataSource={users}
          renderItem={(item) => (
            <List.Item>
              <div className="item_wrapper">
                {item.usu_nombre}
                <Popconfirm
                  title="¿Deseas quitar este usuario?"
                  style={{ width: 300 }}
                  okText="Borrar"
                  placement="right"
                  cancelText="Cerrar"
                  onConfirm={() => onDelete(item.usu_id)}
                >
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    {(deal.usu_asig_id === idUser || idUser === 1) && (
                      <Button type="link">
                        <DeleteOutlined style={{ color: "red" }} />
                      </Button>
                    )}
                  </div>
                </Popconfirm>
              </div>
            </List.Item>
          )}
        />
      )}
      {(deal.usu_asig_id === idUser || idUser === 1) && (
        <Button
          type="primary"
          block
          style={{ marginTop: 10 }}
          onClick={addUsers}
        >
          {" "}
          Añadir usuarios
        </Button>
      )}
    </Fragment>
  );
};

export default SharedUsers;
