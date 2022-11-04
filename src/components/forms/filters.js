/* eslint-disable array-callback-return */
import { useQuery } from "@apollo/react-hooks";
import { Button, Col, Form, Radio, Row, Select } from "antd";
import "moment/locale/es";
import React, { Fragment, useContext, useEffect, useState } from "react";
import { DealContext } from "../context/DealCotext";
import TagsList from "../tags/tagsList";
import AddDateSinceUntil from "./addDateSinceUntil";
import AddTagItem from "../tags/addTagItem";
import { GET_USUARIO } from "../../Graphql/queries/usuario";
import { GET_CLIENTES_PARA_FILTRO } from "../../Graphql/queries/clientes";

const Filters = () => {
  const [form] = Form.useForm();

  const {
    setIdEstado,
    setFilterDate,
    setFilterTypeDate,
    setFilterIdUser,
    esUsuarioSupervisor,
    esUsuarioAdmin,
    listadoUsuariosSupervisados,
    listadoGruposDelSupervisor,
    setLoadingHeader,
    setTagsListFilter,
    setTagsList,
    setFilterCliente,
    setNombreCliFiltrado,
    setNombreUsuFiltrado,
    idUser,
    nombreCliFiltrado,
    nombreUsuFiltrado,
  } = useContext(DealContext);

  const [listadoUsuariosParaAdmin, setListadoUsuariosParaAdmin] = useState([]);
  const [searchUsuarios, setSearchUsuarios] = useState("");
  const [listadoClientes, setListadoClientes] = useState([]);
  const [searchCliente, setSearchCliente] = useState("");

  const { data: dataUsuarios } = useQuery(GET_USUARIO, {
    variables: { input: searchUsuarios },
  });

  const { data: clientesFilter } = useQuery(GET_CLIENTES_PARA_FILTRO, {
    variables: { input: searchCliente, idUsuario: idUser },
  });

  useEffect(() => {
    if (dataUsuarios) {
      setListadoUsuariosParaAdmin(dataUsuarios.getUsuariosResolver);
    }

    if (clientesFilter) {
      setListadoClientes(clientesFilter.getClientesParaFiltroResolver);
    }
  }, [dataUsuarios, clientesFilter]);

  const onFinish = () => {};

  const onSearch = (val) => {
    if (val.length >= 3) {
      setSearchUsuarios(val);
    }
  };

  const onSearchCliente = (v) => {
    if (v.length >= 3) {
      setSearchCliente(v);
    }
  };

  const filterState = () => {
    setLoadingHeader(true);
    const filter = form.getFieldValue("cie_id");

    switch (filter) {
      case "abierto":
        setIdEstado(0);
        setFilterDate([]);
        break;
      case "ganado":
        setIdEstado(1);
        setFilterDate([]);
        break;
      case "perdido":
        setIdEstado(2);
        setFilterDate([]);
        break;
      case "eliminado":
        setIdEstado(3);
        setFilterDate([]);
        break;
      default:
        break;
    }
  };
  const onTypeDate = (type) => {
    if (type.target.value === "Fecha de creación") {
      setFilterTypeDate("creacion");
    } else {
      setFilterTypeDate("cierre");
    }
  };

  const onChangeUsuAsign = (user, d) => {
    setFilterIdUser(Number(user));
    if (d) {
      setNombreUsuFiltrado(d.children);
    }
  };

  const onResetUser = () => {
    form.resetFields();
    setFilterIdUser(null);
    setFilterTypeDate("creacion");
    setIdEstado(0);
    setFilterDate([]);
    setTagsListFilter([]);
    setTagsList([]);
    setFilterCliente();
    setNombreUsuFiltrado("");
    setNombreCliFiltrado("");
  };

  return (
    <Fragment>
      <Form layout="vertical" form={form} onFinish={onFinish}>
        <div className="layout-filter-wrapper">
          <div className="layout-form">
            <Row gutter={[20, 20]}>
              <Col>
                <h4>Estado</h4>
                <Row>
                  <Col>
                    <Form.Item name="cie_id" label="">
                      <Radio.Group
                        defaultValue="abierto"
                        buttonStyle="solid"
                        onChange={filterState}
                      >
                        <Radio.Button value="abierto">Abierto</Radio.Button>
                        <Radio.Button value="ganado">Ganado</Radio.Button>
                        <Radio.Button value="perdido">Perdido</Radio.Button>
                        <Radio.Button value="eliminado">Anulado</Radio.Button>
                      </Radio.Group>
                    </Form.Item>
                  </Col>
                </Row>
                <div className="divider"></div>
                {/* <h3>Fechas</h3> */}
                <Row>
                  <Col xs={24}>
                    <Form.Item name="tipo_fecha" label="Fecha">
                      <Radio.Group
                        defaultValue="Fecha de creación"
                        buttonStyle="outline"
                        onChange={onTypeDate}
                      >
                        <Radio.Button value="Fecha de creación">
                          Fecha de creación
                        </Radio.Button>
                        <Radio.Button value="Fecha de cierre">
                          Fecha de cierre
                        </Radio.Button>
                      </Radio.Group>
                    </Form.Item>
                  </Col>
                </Row>
                <Row>
                  <Col xs={24}>
                    <Form.Item name="entre_fechas">
                      <AddDateSinceUntil />
                    </Form.Item>
                  </Col>
                </Row>
                <div className="divider"></div>

                {esUsuarioSupervisor && (
                  <Form.Item name="usu_asing" label="Usuario">
                    <Select
                      allowClear
                      onClear={() => {
                        setSearchUsuarios("");
                        setNombreUsuFiltrado("");
                        setFilterIdUser(null);
                      }}
                      onChange={onChangeUsuAsign}
                      placeholder="Seleccionar usuario"
                      defaultValue={nombreUsuFiltrado && nombreUsuFiltrado}
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
                  </Form.Item>
                )}

                {esUsuarioAdmin && (
                  <Form.Item name="usu_asing" label="Usuario">
                    <Select
                      placeholder="Seleccionar usuario"
                      defaultValue={nombreUsuFiltrado && nombreUsuFiltrado}
                      showSearch
                      allowClear
                      onClear={() => {
                        setSearchUsuarios("");
                        setNombreUsuFiltrado("");
                        setFilterIdUser(null);
                      }}
                      onChange={onChangeUsuAsign}
                      onSearch={onSearch}
                      optionFilterProp="children"
                      filterOption={(input, option) =>
                        option.children.indexOf(input >= 0)
                      }
                    >
                      {listadoUsuariosParaAdmin &&
                        listadoUsuariosParaAdmin.length > 0 &&
                        listadoUsuariosParaAdmin.map((item) => {
                          return (
                            <Select.Option
                              key={item.usu_id}
                              value={item.usu_id}
                            >
                              {item.usu_nombre}
                            </Select.Option>
                          );
                        })}
                    </Select>
                  </Form.Item>
                )}

                <div className="divider"></div>

                <Form.Item name={"cliente"} label={"Cliente"}>
                  <Select
                    defaultValue={nombreCliFiltrado}
                    showSearch
                    allowClear
                    onClear={() => {
                      setSearchCliente("");
                      setNombreCliFiltrado("");
                    }}
                    onSearch={onSearchCliente}
                    optionFilterProp="children"
                    filterOption={(input, option) =>
                      option.children.indexOf(input >= 0)
                    }
                    placeholder="Seleccionar cliente"
                    onChange={(v, d) => {
                      setFilterCliente(Number(v));
                      if (d) {
                        setNombreCliFiltrado(d.children);
                      }
                    }}
                  >
                    {listadoClientes &&
                      listadoClientes.map((cliente) => {
                        return (
                          <Select.Option key={cliente.cli_id}>
                            {cliente.cli_nombre}
                          </Select.Option>
                        );
                      })}
                  </Select>
                </Form.Item>
              </Col>

              <Col>
                <h4>Etiquetas</h4>
                <Row gutter={[8, 8]}>
                  <Col xs={24}>
                    <div className="tags_config_wrapper">
                      <TagsList>
                        <AddTagItem
                          // name={etq_nombre}
                          // color={etq_color}
                          // // isChecked={selected && selected.length > 0 ? true : false}
                          // key={etq_id}
                          // tagId={etq_id}
                          filter={true}
                          // autorizado={autorizado}
                          // setShowForm={newTagName}
                        />
                      </TagsList>
                    </div>
                  </Col>
                </Row>
              </Col>
            </Row>
          </div>
          <div className="divider"></div>
          <Col>
            <Button
              block
              type="primary"
              style={{ marginTop: 15 }}
              onClick={() => onResetUser()}
            >
              Limpiar filtros
            </Button>
          </Col>
        </div>
      </Form>
    </Fragment>
  );
};

export default Filters;
