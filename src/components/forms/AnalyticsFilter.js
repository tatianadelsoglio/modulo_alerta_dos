/* eslint-disable array-callback-return */
import { useQuery } from "@apollo/client";
import { Button, Col, Form, Radio, Row, Select } from "antd";
import { useContext, useEffect, useState } from "react";
import { GET_EMBUDOS } from "../../Graphql/queries/embudos";
import { DealContext } from "../context/DealCotext";
import AddTagItem from "../tags/addTagItem";
import TagsList from "../tags/tagsList";
import AddDateSinceUntil from "./addDateSinceUntil";

const AnalyticsFilter = () => {
  const [form] = Form.useForm();
  const [pipelines, setPipelines] = useState([]);

  const [listadoUsuariosParaAdmin, setListadoUsuariosParaAdmin] = useState([]);
  const [listadoClientes, setListadoClientes] = useState([]);
  const {
    esUsuarioSupervisor,
    esUsuarioAdmin,
    listadoUsuariosSupervisados,
    listadoGruposDelSupervisor,
    setFilterCliente,
    setNombreCliFiltrado,
    nombreCliFiltrado,
    nombreUsuFiltrado,
    setPipelineSelected,
    setEstadoSelected,
    currentTab,
    setFilterTypeDate,
  } = useContext(DealContext);

  const { data: dataEmbudos } = useQuery(GET_EMBUDOS);

  useEffect(() => {
    if (dataEmbudos) {
      setPipelines(dataEmbudos.getPipelinesResolver);
    }
  }, [dataEmbudos]);

  const onTypeDate = (type) => {
    if (type.target.value === "Fecha de creación") {
      setFilterTypeDate("creacion");
    } else {
      setFilterTypeDate("cierre");
    }
  };

  return (
    <>
      <Form layout="vertical" form={form}>
        <div className="layout-filter-wrapper">
          <div className="layout-form">
            {pipelines && pipelines.length > 0 && (
              <>
                <h4>Embudo</h4>
                <Col>
                  <Form.Item name="pip_id" label="">
                    <Select
                      onChange={(v) => setPipelineSelected(Number(v))}
                      defaultValue={
                        currentTab === "2" ? pipelines[0].pip_id : -1
                      }
                    >
                      {currentTab === "1" && (
                        <Select.Option key={-1} value={-1}>
                          <strong>TODOS</strong>
                        </Select.Option>
                      )}

                      {pipelines.map((item) => {
                        return (
                          <Select.Option key={item.pip_id}>
                            {item.pip_nombre}
                          </Select.Option>
                        );
                      })}
                    </Select>
                  </Form.Item>
                </Col>
              </>
            )}

            {currentTab === "2" && (
              <>
                <h4>Estado</h4>
                <Row>
                  <Col>
                    <Form.Item name="est_id" label="">
                      <Radio.Group
                        defaultValue="abierto"
                        buttonStyle="solid"
                        onChange={(e) => setEstadoSelected(e.target.value)}
                      >
                        <Radio.Button value="abierto" key={0}>
                          Abierto
                        </Radio.Button>
                        <Radio.Button value="cerrado" key={1}>
                          Cerrado
                        </Radio.Button>
                        <Radio.Button value="anulado" key={3}>
                          Anulado
                        </Radio.Button>
                      </Radio.Group>
                    </Form.Item>
                  </Col>
                </Row>
              </>
            )}
            <div className="divider"></div>
            <Row>
              <Col xs={24}>
                <Form.Item name="tipo_fecha" label="Fecha">
                  <Radio.Group
                    defaultValue="Fecha de creación"
                    buttonStyle="outline"
                    // onChange={onTypeDate}
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
                    // setSearchUsuarios("");
                    // setNombreUsuFiltrado("");
                    // setFilterIdUser(null);
                  }}
                  //   onChange={onChangeUsuAsign}
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
                    // setSearchUsuarios("");
                    // setNombreUsuFiltrado("");
                    // setFilterIdUser(null);
                  }}
                  //   onChange={onChangeUsuAsign}
                  //   onSearch={onSearch}
                  optionFilterProp="children"
                  filterOption={(input, option) =>
                    option.children.indexOf(input >= 0)
                  }
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
              </Form.Item>
            )}

            <Form.Item name={"cliente"} label={"Cliente"}>
              <Select
                defaultValue={nombreCliFiltrado}
                showSearch
                allowClear
                onClear={() => {
                  //   setSearchCliente("");
                  //   setNombreCliFiltrado("");
                }}
                // onSearch={onSearchCliente}
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

            <div className="divider"></div>
            <Col>
              <h4>Etiquetas</h4>
              <Row gutter={[8, 8]}>
                <Col xs={24}>
                  <div className="tags_config_wrapper">
                    <TagsList>
                      <AddTagItem filter={true} />
                    </TagsList>
                  </div>
                </Col>
              </Row>
            </Col>
          </div>
        </div>
        <div className="divider"></div>
        <Col>
          <Button
            block
            type="primary"
            style={{ marginTop: 15 }}
            // onClick={() => onResetUser()}
          >
            Limpiar filtros
          </Button>
        </Col>
      </Form>
    </>
  );
};

export default AnalyticsFilter;
