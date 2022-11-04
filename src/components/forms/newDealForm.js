/* eslint-disable array-callback-return */
/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-unused-vars */
import { useMutation, useQuery } from "@apollo/react-hooks";
import OpenNotification from "../notifications/openNotification";
import {
  Button,
  Col,
  DatePicker,
  Form,
  Input,
  Row,
  Select,
  Tooltip,
} from "antd";
import locale from "antd/es/date-picker/locale/es_ES";
import "moment/locale/es";
import React, { Fragment, useContext, useEffect, useState } from "react";
import { NEW_COMPETIDORES_NEGOCIO } from "../../Graphql/mutations/competidores";
import { NEW_ETAPA_POR_NEGOCIO } from "../../Graphql/mutations/etapas";
import { NEW_NEGOCIO } from "../../Graphql/mutations/negocio";
import { NEW_PRODUCTO_NEGOCIO } from "../../Graphql/mutations/productos";
import {
  GET_CLIENTES_LIMITADO,
  GET_CONTACTOS,
  GET_MONEDAS,
} from "../../Graphql/queries/clientes";
import {
  GET_EMBUDOS,
  GET_EMBUDOS_CON_ETAPAS,
} from "../../Graphql/queries/embudos";
import { GET_ETAPAS_SUMA } from "../../Graphql/queries/etapas";
import { setHistorial } from "../../utils/setHistorial";
import { DealContext } from "../context/DealCotext";
import { DrawerContext } from "../context/DrawContext";
import FunnelStep from "../funnelSteps/funnelStep";
import "./form.styles.scss";
import {
  GET_GRUPOS_Y_USUARIOS,
  GET_GRUPO_POR_USUARIO,
  GET_USUARIO,
} from "../../Graphql/queries/usuario";
import { COMPARTIR_USUARIO } from "../../Graphql/mutations/usuarios";

import { SET_ETIQUETA_POR_NEGOCIO } from "../../Graphql/mutations/tags";
import { CheckOutlined, TagsOutlined } from "@ant-design/icons";

const NewDealForm = ({ edit }) => {
  const [form] = Form.useForm();
  const { showChildrenDrawer, setDrawerNameChildren, onClose } =
    useContext(DrawerContext);
  const {
    deal,
    products,
    dealProducts,
    dealCompetitors,
    setNegId,
    setEtaId,
    newHistorialNegocioResolver,
    competitors,
    setCompetitors,
    totalProducts,
    idPipeline,
    setIdPipeline,
    idUser,
    pipelineName,
    allSteps,
    listadoUsuariosSupervisados,
    tagsList,
    setTagsList,
    etaIdParaForm,
    esUsuarioSupervisor,
    esUsuarioAdmin,
    listadoGruposDelSupervisor,
    monConfig,
    pollNegocios,
    pollValoresEtapa,
  } = useContext(DealContext);

  const [clientes, setClientes] = useState([]);
  const [searchEmpresa, setSearchEmpresas] = useState("");
  const [searchUser, setSearchUser] = useState("");
  const [idCliente, setIdCliente] = useState(0);
  const [contactos, setContactos] = useState([]);
  const [usuarios, setUsuarios] = useState([]);
  const [monedas, setMonedas] = useState([]);
  const [pipelines, setPipelines] = useState([]);
  // const [idPipeline, setIdPipeline] = useState(112);
  const [funnelStep, setFunnelStep] = useState(null);
  const [steps, setSteps] = useState([]);
  const [pipeline, setPipeline] = useState(null);
  const [idNegocio, setIdNegocio] = useState(null);
  const [dealValue] = useState("");
  const [usuariosCompartido, setUsuariosCompartido] = useState([]);
  // Usuario individual: Es la lista con los ID de los usuarios compartidos.
  const [usuarioIndividual, setUsuarioIndividual] = useState([]);
  // const [totalProducts, setTotalProducts] = useState(0);
  const [stepsFinal, setStepsFinal] = useState([]);

  const getClientes = useQuery(GET_CLIENTES_LIMITADO, {
    variables: { input: searchEmpresa, idUsuario: idUser },
  });

  const getUsuarios = useQuery(GET_USUARIO, {
    variables: { input: searchUser },
  });
  const getContactos = useQuery(GET_CONTACTOS, {
    variables: { id: idCliente },
  });
  const getMonedas = useQuery(GET_MONEDAS);
  const getPipelines = useQuery(GET_EMBUDOS);

  const getGrupoPorUsuario = useQuery(GET_GRUPO_POR_USUARIO, {
    variables: { idUsuario: idUser },
  });

  const { data: embudosConEtapas } = useQuery(GET_EMBUDOS_CON_ETAPAS);
  const [newNegocioResolver] = useMutation(NEW_NEGOCIO, {
    onCompleted: () => {
      OpenNotification(
        <h4>Se creo correctamente el negocio.</h4>,
        null,
        "topleft",
        <CheckOutlined style={{ color: "green" }} />,
        null
      );
    },
  });
  const [newCompetidoresXNegocioResolver] = useMutation(
    NEW_COMPETIDORES_NEGOCIO
  );
  const [newUsuariosXNegocioResolver] = useMutation(COMPARTIR_USUARIO);
  const [newProductoXNegocioResolver] = useMutation(NEW_PRODUCTO_NEGOCIO);
  const [newEtapaXNegocioResolver] = useMutation(NEW_ETAPA_POR_NEGOCIO);
  const [setEtiquetaXNegocioResolver] = useMutation(SET_ETIQUETA_POR_NEGOCIO);

  useEffect(() => {
    if (getClientes.data) {
      const { getClientesLimitResolver } = getClientes.data;
      setClientes(getClientesLimitResolver);
    }
    if (getContactos.data) {
      const { getContactosResolver } = getContactos.data;
      setContactos(getContactosResolver);
    }
    if (getUsuarios.data) {
      const { getUsuariosResolver } = getUsuarios.data;
      setUsuarios(getUsuariosResolver);
    }
    if (getMonedas.data) {
      const { getMonedasResolver } = getMonedas.data;
      setMonedas(getMonedasResolver);
    }
    if (getPipelines.data) {
      const { getPipelinesResolver } = getPipelines.data;
      setPipelines(getPipelinesResolver);

      if (getPipelinesResolver.length > 0) {
        if (!pipeline) {
          setPipeline(pipelineName);
        }
      }
    }

    //* allSteps son etapas
    setStepsFinal(allSteps);

    setFunnelStep(steps);
  }, [
    deal,
    products,
    searchEmpresa,
    searchUser,
    usuarios,
    steps,
    dealValue,
    idNegocio,
    idUser,
    getClientes,
    idCliente,
    getContactos,
    getUsuarios,
    getMonedas,
    totalProducts,
    getPipelines,
    dealProducts,
    dealCompetitors,
    idPipeline,
    embudosConEtapas,
    pipeline,
    pipelineName,
    funnelStep,
  ]);

  const Option = Select.Option;

  const onChangeDate = (d, dd) => {};
  const onFocusEmpresa = () => {
    form.resetFields(["contacto"]);
  };
  const onChangeEmpresa = (value) => {
    const idClient = Number(value);
    setIdCliente(idClient);
  };
  const onChangeContactos = (value) => {
    // setCliente(Number(value));
  };
  const onChangeMoneda = (v) => {};

  const onChangeEmbudo = (value) => {
    // const data = etapasPorEmbudo({ variables: { id: Number(value) } });

    // data.then((res) => {
    //   setStepsFinal(res.data.getEtapaPorIdResolver);
    // });
    // const pipeline = steps.filter(
    //   (pipeline) => pipeline.pip_id === Number(value)
    // );
    setIdPipeline(Number(value));
    // let name = pipelines.filter((pip) => pip.pip_id === value)[0].pip_nombre;
    // setPipelineName(name);
    // setFunnelStep(Number(pipeline[0].eta_id));
  };

  const onBlur = () => {};

  const onFocus = () => {
    setSearchEmpresas("");
    setSearchUser("");
  };

  const onSearch = (val) => {
    if (val.length >= 3) {
      setSearchEmpresas(val);
    }
  };
  const onSearchUser = (val) => {
    if (val.length >= 3) {
      setSearchUser(val);
    }
  };

  const onFinish = (value) => {
    let {
      cli_id,
      con_id,
      mon_id,
      neg_asunto,
      neg_fechacierre,
      neg_valor,
      usu_asig_id,
      usu_por_negocio,
      pip_id,
    } = value;

    if (edit) {
      // Guardar los cambios
      // editar historial

      form.resetFields();
      // negocios(500);
      onClose();
      return;
    }

    cli_id = Number(cli_id);
    con_id = Number(con_id);
    mon_id = Number(mon_id);
    neg_valor = Number(neg_valor);

    const deal = {
      cli_id,
      con_id,
      mon_id,
      neg_asunto,
      neg_fechacierre,
      neg_valor,
      usu_id: idUser,
      usu_asig_id: Number(usu_asig_id) || idUser,
    };

    // si tiene usuarios pasa el objeto al mutation
    // Guarda en la base de datos el nuevo negocio y returna el id del negocio.
    newNegocioResolver({ variables: { input: deal } }).then((item) => {
      // retorna el id del negocio.
      let { neg_id } = item.data.newNegocioResolver;

      if (usuarios.length > 0) {
        newUsuariosXNegocioResolver({
          variables: {
            idNegocio: Number(neg_id),
            input: { usuariosIndividual: usuarioIndividual },
          },
        });
      }

      setIdNegocio(Number(neg_id));
      setNegId(Number(neg_id));

      // si existen productos se dispara el resolver

      if (newNegocioResolver) {
        const PipelineStep = {
          eta_id: Number(etaIdParaForm),
          neg_id: Number(neg_id),
        };

        newEtapaXNegocioResolver({ variables: { input: PipelineStep } });

        let description;

        if (usuariosCompartido.length > 0) {
          description = `Se agrega un nuevo negocio compartido con los usuarios ${usuariosCompartido.join(
            ", "
          )}.`;
        } else {
          description = "Se agrega un nuevo negocio.";
        }
        setHistorial(
          newHistorialNegocioResolver,
          idUser,
          Number(neg_id),
          etaIdParaForm,
          description,
          -1
        );
        setEtaId(funnelStep);
      }

      if (products.length > 0) {
        const listadoProductos = products.map((item) => {
          let { prod_id, valor, cantidad } = item;
          const cant = Number(cantidad);
          const val = Number(valor);
          const prodId = Number(prod_id);

          let producto = {
            prod_id: prodId,
            valor: val,
            cantidad: cant,
          };
          return producto;
        });

        newProductoXNegocioResolver({
          variables: {
            input: { productoXNegIndividual: listadoProductos },
            idNegocio: Number(neg_id),
          },
        });
      }
      if (dealProducts.length > 0) {
        const listadoProductos = dealProducts.map((item) => {
          let { prod_id, valor, cantidad } = item;
          const cant = Number(cantidad);
          const val = Number(valor);
          const prodId = Number(prod_id);

          let producto = {
            prod_id: prodId,
            valor: val,
            cantidad: cant,
          };
          return producto;
        });

        newProductoXNegocioResolver({
          variables: { input: { productoXNegIndividual: listadoProductos } },
        });
      }

      if (competitors.length > 0) {
        let competitorsList = competitors.map((item) => {
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

        newCompetidoresXNegocioResolver({
          variables: {
            input: { competidoresXNegIndividual: competitorsList },
            idNegocio: Number(neg_id),
          },
        }).then(() => {
          setCompetitors([]);
        });
      }

      if (tagsList.length > 0) {
        //
        const input = {
          etiquetaXnegocioIndividual: tagsList,
        };
        setEtiquetaXNegocioResolver({
          variables: { input, idNegocio: Number(neg_id) },
        });
        setTagsList([]);
      }

      setIdPipeline(idPipeline);
      setFunnelStep(funnelStep);
    });
    //   .catch((error) =>

    form.resetFields();

    onClose();
  };

  const cancelForm = () => {
    form.resetFields();
    onClose();
  };

  const addProduct = () => {
    setDrawerNameChildren("Productos");
    showChildrenDrawer();
  };
  const addCompetitors = () => {
    setDrawerNameChildren("Competidores");
    showChildrenDrawer();
  };

  const addTags = () => {
    //
    setDrawerNameChildren("Agregar Etiquetas");
    showChildrenDrawer();
  };
  function onChange() {}

  const onChangeUser = (v, usar) => {};
  const onChangeSharedUser = (v, user) => {
    // TODO: Resolver este quilombo
    let users = [];
    user.map((u) => (users = [...users, u.children]));
    setUsuariosCompartido(users);
    let formatUser = v.map((item) => {
      return { usu_id: Number(item) };
    });
    setUsuarioIndividual(formatUser);
  };

  return (
    <Fragment>
      <Form
        layout="vertical"
        form={form}
        onFinish={onFinish}
        requiredMark="optional"
      >
        <div className="layout-wrapper">
          <div className="layout-form">
            <Row>
              <Col xs={24}>
                {!edit && (
                  <Fragment>
                    <Form.Item
                      name="cli_id"
                      label="Empresa"
                      rules={[
                        {
                          type: "string",
                          required: true,
                          message: "Campo obligatorio",
                        },
                      ]}
                    >
                      <Select
                        showSearch
                        onChange={onChangeEmpresa}
                        onFocus={onFocusEmpresa}
                        onBlur={onBlur}
                        onSearch={onSearch}
                        placeholder="Empresa"
                        optionFilterProp="children"
                        loading={clientes === null ? true : false}
                        filterOption={(input, option) =>
                          option.children.indexOf(input >= 0)
                        }
                      >
                        {clientes &&
                          clientes.map((cliente) => {
                            const { cli_id, cli_nombre, cli_idsistema } =
                              cliente;
                            return (
                              <Option
                                key={cli_id}
                                value={cli_id}
                                title={cli_nombre}
                              >
                                {cli_idsistema} - {cli_nombre}
                              </Option>
                            );
                          })}
                      </Select>
                    </Form.Item>
                    <Form.Item name="con_id" label="Nombre del Contacto">
                      {/* <Input prefix={<UserOutlined />} size="middle" placeholder="" /> */}
                      <Select
                        disabled={contactos.length > 0 ? false : true}
                        showSearch
                        placeholder="Contacto"
                        optionFilterProp="children"
                        onChange={onChangeContactos}
                        onFocus={onFocus}
                        onBlur={onBlur}
                        onSearch={onSearch}
                        loading={clientes.length === 0 ? true : false}
                        filterOption={(input, option) =>
                          option.children.indexOf(input) >= 0
                        }
                      >
                        {contactos.length > 0 &&
                          contactos.map((contacto) => {
                            const { con_id, con_nombre } = contacto;
                            return (
                              <Option key={con_id} value={con_id}>
                                {con_nombre}
                              </Option>
                            );
                          })}
                      </Select>
                    </Form.Item>
                  </Fragment>
                )}

                <Form.Item
                  name="neg_asunto"
                  label="Asunto"
                  rules={[
                    {
                      type: "string",
                      required: true,
                      message: "Campo obligatorio",
                    },
                  ]}
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
                  initialValue={edit ? deal.neg_valor : ""}
                  rules={[
                    {
                      type: "string",
                      required: true,
                      message: "Campo obligatorio",
                    },
                  ]}
                >
                  <Input onChange={onChange} type="number" />
                </Form.Item>
              </Col>
              <Col xs={14}>
                <Form.Item
                  name="mon_id"
                  label="Moneda"
                  initialValue={
                    monConfig && monConfig[0] && String(monConfig[0].mon_id)
                  }
                  rules={[
                    {
                      type: "string",
                      required: true,
                      message: "Campo obligatorio",
                    },
                  ]}
                >
                  <Select
                    // defaultValue={1}
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
                </Form.Item>
              </Col>
            </Row>

            <Fragment>
              <Row gutter={[8, 8]}>
                <Col xs={24}>
                  {pipeline && (
                    <Form.Item
                      name="pip_id"
                      initialValue={pipelineName}
                      label="Embudo"
                      rules={[
                        {
                          type: "string",
                          required: true,
                          message: "Campo obligatorio",
                        },
                      ]}
                    >
                      <Select
                        showSearch
                        placeholder="Seleccionar embudo"
                        optionFilterProp="children"
                        onChange={onChangeEmbudo}
                        onFocus={onFocus}
                        onBlur={onBlur}
                        onSearch={onSearch}
                        // defaultValue={idPipeline}

                        filterOption={(input, option) =>
                          option.children
                            .toLowerCase()
                            .indexOf(input.toLowerCase()) >= 0
                        }
                      >
                        {embudosConEtapas &&
                          embudosConEtapas.getPipelineWithStagesResolver.map(
                            (pipeline) => {
                              const { pip_nombre, pip_id } = pipeline;

                              return (
                                <Option key={pip_id} value={pip_id}>
                                  {pip_nombre}
                                </Option>
                              );
                            }
                          )}
                      </Select>
                    </Form.Item>
                  )}
                </Col>
              </Row>
              {steps && stepsFinal && (
                <Row gutter={[8, 8]}>
                  <Col xs={24}>
                    <Form.Item
                      // initialValue={funnelStep}

                      name="eta_id"
                    >
                      <FunnelStep
                        idPipeline={idPipeline}
                        steps={steps}
                        setFunnelStep={setFunnelStep}
                        stepsFinal={stepsFinal}
                      ></FunnelStep>
                    </Form.Item>
                  </Col>
                </Row>
              )}
            </Fragment>

            <Row gutter={[8, 8]}>
              <Col xs={24}>
                <Form.Item
                  name="neg_fechacierre"
                  label="Fecha prevista de cierre"
                  // initialValue={deal.neg_fechacierre}
                  rules={[
                    {
                      type: "date",
                      required: true,
                      message: "Campo obligatorio",
                    },
                  ]}
                >
                  <DatePicker
                    // defaultPickerValue={deal.neg_fechacierre}
                    // defaultValue={deal.neg_fechacierre}
                    locale={locale}
                    format="DD/MM/YYYY"
                    style={{ width: "100%" }}
                    onChange={onChangeDate}
                  />
                </Form.Item>
              </Col>
            </Row>
            {!edit && (
              <Fragment>
                <Form.Item>
                  <div className="divider"></div>
                </Form.Item>
                <Form.Item>
                  <Row gutter={[8, 8]}>
                    <Col xs={12}>
                      <Tooltip
                        placement="top"
                        title={`${products.length} Productos (USD ${totalProducts}) `}
                      >
                        <Button type="dashed" onClick={addProduct} block>
                          Productos
                        </Button>
                      </Tooltip>
                    </Col>
                    <Col xs={12}>
                      <Tooltip
                        placement="top"
                        title={`${competitors.length} Competidores`}
                      >
                        <Button type="dashed" onClick={addCompetitors} block>
                          {" "}
                          Competidores
                        </Button>
                      </Tooltip>
                    </Col>
                  </Row>
                </Form.Item>
              </Fragment>
            )}

            {esUsuarioAdmin && (
              <Row gutter={[8, 8]}>
                <Col xs={24}>
                  <Form.Item name="usu_asig_id" label="Asignar a usuario">
                    <Select
                      allowClear
                      showSearch
                      placeholder="Usuario"
                      optionFilterProp="children"
                      onChange={onChangeUser}
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
                          if (usu_id !== idUser) {
                            return (
                              <Option key={usu_id} value={usu_id}>
                                {usu_nombre}
                              </Option>
                            );
                          }
                        })}
                    </Select>
                  </Form.Item>
                </Col>
              </Row>
            )}

            {esUsuarioSupervisor && (
              <Row gutter={[8, 8]}>
                <Col xs={24}>
                  <Form.Item name="usu_asig_id" label="Asignar a usuario">
                    <Select
                      allowClear
                      showSearch
                      placeholder="Usuario"
                      optionFilterProp="children"
                      onChange={onChangeUser}
                      onFocus={onFocus}
                      onBlur={onBlur}
                      onSearch={onSearchUser}
                      loading={usuarios === null ? true : false}
                      filterOption={(input, option) =>
                        option.children.toLowerCase().indexOf(input) >= 0
                      }
                    >
                      {listadoGruposDelSupervisor &&
                        listadoGruposDelSupervisor.length > 0 &&
                        listadoGruposDelSupervisor.map((grupo) => {
                          return (
                            <Select.OptGroup label={grupo.gru_nombre}>
                              {listadoUsuariosSupervisados &&
                                listadoUsuariosSupervisados.length > 0 &&
                                listadoUsuariosSupervisados.map((item) => {
                                  if (item.gru_id === grupo.gru_id) {
                                    return (
                                      <Select.Option
                                        key={item.usu_id}
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
                </Col>
              </Row>
            )}

            <Row gutter={[8, 8]}>
              <Col xs={24}>
                <Form.Item name="usu_por_negocio" label="Compartir negocio">
                  {/* <Input prefix={<UserOutlined />} size="middle" placeholder="" /> */}
                  <Select
                    mode="multiple"
                    // disabled={usuarios.length > 0 ? false : true}
                    allowClear
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
            </Row>
            <Row gutter={[20, 20]}>
              <Col xs={24}>
                <Button
                  block
                  type="dashed"
                  icon={<TagsOutlined />}
                  onClick={addTags}
                >
                  Agregar Etiquetas
                </Button>
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
      {/* <AddTags></AddTags> */}
    </Fragment>
  );
};
export default NewDealForm;
