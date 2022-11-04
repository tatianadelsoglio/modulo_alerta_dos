import { useQuery } from "@apollo/client";
import { Button, Drawer, Select, Transfer, Typography } from "antd";
import { useContext, useEffect, useState } from "react";
import { GET_CLIENTES_PARA_NEGOCIO_MASIVO } from "../../../Graphql/queries/clientes";
import { GET_USUARIO } from "../../../Graphql/queries/usuario";
import { DealContext } from "../../context/DealCotext";
import QueryResult from "../../queryResult/QueryResult";

const DrawerClientes = ({ showDrawerClientes, setShowDrawerClientes }) => {
  const [searchEmpresa, setSearchEmpresas] = useState("");
  const [mockData, setMockData] = useState([]);
  const [targetKeys, setTargetKeys] = useState([]);
  const [searchUser, setSearchUser] = useState("");
  const [errorLength, setErrorLength] = useState({
    visible: false,
    message: "",
  });

  const [listadoUsuariosParaAdmin, setListadoUsuariosParaAdmin] = useState([]);
  //* handle tanto para admin como para supervisor y luego clientes en base a este usuario
  const [usuarioSeleccionado, setUsuarioSeleccionado] = useState();

  const { data: dataUsuarios } = useQuery(GET_USUARIO, {
    variables: { input: searchUser },
  });

  const {
    setListadoClientesMasivo,
    esUsuarioAdmin,
    esUsuarioSupervisor,
    listadoGruposDelSupervisor,
    listadoUsuariosSupervisados,
    setUsuAsigMasiveTask,
    idUser,
  } = useContext(DealContext);

  const {
    data: dataClientes,
    loading,
    error,
  } = useQuery(GET_CLIENTES_PARA_NEGOCIO_MASIVO, {
    variables: { idUsuario: usuarioSeleccionado },
  });

  useEffect(() => {
    //* en caso de ser raso, setea como si se hubiese elegido un usuario el id logueado
    if (!esUsuarioAdmin && !esUsuarioSupervisor) {
      setUsuarioSeleccionado(idUser);
    }

    if (dataClientes) {
      const data = dataClientes.getClientesParaNegocioMasivoResolver;

      setMockData(
        data.map((item) => {
          return {
            key: item.cli_id,
            title: item.cli_nombre,
          };
        })
      );
    }

    if (dataUsuarios) {
      setListadoUsuariosParaAdmin(dataUsuarios.getUsuariosResolver);
    }
  }, [dataClientes, searchEmpresa, dataUsuarios]);

  const handleChange = (newTargetKeys) => {
    setTargetKeys(newTargetKeys);
  };

  return (
    <Drawer
      width={700}
      title="Elegir clientes"
      name="drawerClientes"
      visible={showDrawerClientes}
      onClose={() => setShowDrawerClientes(false)}
    >
      {esUsuarioAdmin ||
        (esUsuarioSupervisor && <h5>Seleccione un usuario</h5>)}

      {esUsuarioAdmin && (
        <Select
          showSearch
          allowClear
          style={{ marginBottom: "10px" }}
          // onClear={() => {
          //   setSearchUsuarios("");
          //   setNombreUsuFiltrado("");
          //   setFilterIdUser(null);
          // }}
          // onChange={onChangeUsuAsign}
          onChange={(v) => {
            setUsuarioSeleccionado(v);
            setUsuAsigMasiveTask(v);
          }}
          onSearch={(v) => setSearchUser(v)}
          placeholder="Seleccionar usuario"
          optionFilterProp="children"
          filterOption={(input, option) => option.children.indexOf(input >= 0)}
        >
          {listadoUsuariosParaAdmin &&
            listadoUsuariosParaAdmin.length > 0 &&
            listadoUsuariosParaAdmin.map((item) => {
              return (
                <Select.Option key={item.usu_id} value={item.usu_id}>
                  {item.usu_nombre}
                </Select.Option>
              );
            })}
        </Select>
      )}

      {esUsuarioSupervisor && (
        <Select
          allowClear
          // onClear={() => {
          //   setSearchUsuarios("");
          //   setNombreUsuFiltrado("");
          //   setFilterIdUser(null);
          // }}
          // onChange={onChangeUsuAsign}
          onChange={(v) => {
            setUsuAsigMasiveTask(v);
            setUsuarioSeleccionado(v);
          }}
          placeholder="Seleccionar usuario"
          optionFilterProp="children"
        >
          {listadoGruposDelSupervisor &&
            listadoGruposDelSupervisor.length > 0 &&
            listadoGruposDelSupervisor.map((grupo, idx) => {
              return (
                <Select.OptGroup
                  label={grupo.gru_nombre}
                  key={grupo.gru_id + idx}
                >
                  {listadoUsuariosSupervisados &&
                    listadoUsuariosSupervisados.length > 0 &&
                    listadoUsuariosSupervisados.map((item, idx) => {
                      if (item.gru_id === grupo.gru_id) {
                        return (
                          <Select.Option
                            key={item.usu_id + idx}
                            value={item.usu_id}
                          >
                            {item.usu_nombre}
                          </Select.Option>
                        );
                      }
                    })}
                </Select.OptGroup>
              );
            })}
        </Select>
      )}

      {usuarioSeleccionado && mockData && (
        <QueryResult loading={loading} data={mockData} error={error}>
          <h5>Seleccione los clientes</h5>
          <Transfer
            pagination
            listStyle={{
              width: 300,
              height: 400,
              marginBottom: "20px",
            }}
            titles={["Disponibles", "Seleccionados"]}
            dataSource={mockData}
            operations={["Agregar", "Quitar"]}
            onSearch={(side, value) => setSearchEmpresas(value)}
            showSearch
            targetKeys={targetKeys}
            onChange={handleChange}
            render={(item) => item.title}
          />
          {errorLength.visible && (
            <div style={{ marginTop: "10px", marginBottom: "20px" }}>
              <Typography.Text type="danger">
                {errorLength.message}
              </Typography.Text>
            </div>
          )}

          <Button
            onClick={() => {
              if (targetKeys.length < 2) {
                setErrorLength({
                  visible: true,
                  message: "Debe seleccionar mínimo 2 clientes",
                });
              } else if (targetKeys.length > 200) {
                setErrorLength({
                  visible: true,
                  message: "El maximo es 200 clientes",
                });
              } else {
                setErrorLength({
                  visible: false,
                  message: "",
                });
                setListadoClientesMasivo(targetKeys);
                setShowDrawerClientes(false);
              }
            }}
            block
            type="primary"
          >
            Confirmar selección
          </Button>
        </QueryResult>
      )}
    </Drawer>
  );
};

export default DrawerClientes;
