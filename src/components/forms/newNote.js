import { useLazyQuery, useMutation } from "@apollo/client";
import { Button, Col, Form, Radio, Row } from "antd";
import React, { Fragment, useContext, useEffect, useState } from "react";
import { NEW_NOTA } from "../../Graphql/mutations/notas";
import { UPDATE_NOTA } from "../../Graphql/mutations/notas";
import { GET_NOTA_POR_ID } from "../../Graphql/queries/notas";
import { setHistorial } from "../../utils/setHistorial";
import { DealContext } from "../context/DealCotext";
import { DrawerContext } from "./../context/DrawContext";
import Note from "../timeline/components/note/note";
import { NoteContext } from "./../context/NoteContext";
import "./form.styles.scss";

const NewNote = ({ edit, id }) => {
  const [form] = Form.useForm();
  const [priority, setPriority] = useState(1);
  const { note, setNote } = useContext(NoteContext);
  const { onClose } = useContext(DrawerContext);
  const { negId, idUser, newHistorialNegocioResolver, etaId } =
    useContext(DealContext);
  const [getNota, { data }] = useLazyQuery(
    GET_NOTA_POR_ID

    // { fetchPolicy: 'cache-and-network' }
  );
  const [newNotaResolver] = useMutation(NEW_NOTA);
  const [updateNotaResolver] = useMutation(UPDATE_NOTA);

  useEffect(() => {
    if (edit) {
      getNota({ variables: { idNota: id } });
    }
  }, [data, edit, getNota, id]);

  const onFinish = (v) => {
    const data = {
      ...v,
      not_desc: note,
      not_importancia: priority,
    };

    if (edit) {
      updateNotaResolver({ variables: { idNota: id, input: data } });
      onClose();
      setNote(note);
      // form.resetFields();
      return;
    }
    newNotaResolver({
      variables: {
        input: data,
        idNegocio: negId,
        idUsuario: idUser,
      },
    }).then((nota) => {
      const idNota = nota.data.newNotaResolver;
      const template = `####N_${idNota}`;
      const his_detalle = template;

      setHistorial(
        newHistorialNegocioResolver,
        idUser,
        negId,
        Number(etaId),
        his_detalle,
        -1
      );
    });

    onClose();
    setNote("");
    form.resetFields();
  };

  const onChangePriority = (v) => {
    setPriority(Number(v.target.value));
  };
  return (
    <Row gutter={[20, 20]}>
      <Col xs={24}>
        {data && edit && (
          <Fragment>
            <Form
              form={form}
              requiredMark="optional"
              name="etapas"
              layout="vertical"
              onFinish={onFinish}
              autoComplete="off"
            >
              <div className="layout-wrapper">
                <div className="layout-form">
                  <Form.Item name="not_desc">
                    <Note
                      editValue={data.getNotaByIdResolver[0].not_desc}
                      width="100%"
                      height={200}
                    ></Note>
                    <Row gutter={[20, 20]}>
                      <Col sm={24}>
                        {data.getNotaByIdResolver[0].not_importancia && (
                          <Radio.Group
                            defaultValue={String(
                              data.getNotaByIdResolver[0].not_importancia
                            )}
                            buttonStyle="solid"
                            onChange={onChangePriority}
                          >
                            <Radio.Button value="1">Alta</Radio.Button>
                            <Radio.Button value="2">Media</Radio.Button>
                            <Radio.Button value="3">Baja</Radio.Button>
                          </Radio.Group>
                        )}
                      </Col>
                    </Row>
                  </Form.Item>
                </div>
                <div className="layout-footer">
                  <Button type="primary" htmlType="submit" block>
                    Guardar
                  </Button>
                </div>
              </div>
            </Form>
          </Fragment>
        )}
        {!edit && (
          <Fragment>
            <Form
              form={form}
              requiredMark="optional"
              name="etapas"
              layout="vertical"
              onFinish={onFinish}
              autoComplete="off"
            >
              <div className="layout-wrapper">
                <div className="layout-form">
                  <Form.Item name="not_desc">
                    <Note width="100%" height={200}></Note>
                    <Row gutter={[20, 20]}>
                      <Col sm={24}>
                        <Radio.Group
                          defaultValue="1"
                          buttonStyle="solid"
                          onChange={onChangePriority}
                        >
                          <Radio.Button value="1">Alta</Radio.Button>
                          <Radio.Button value="2">Media</Radio.Button>
                          <Radio.Button value="3">Baja</Radio.Button>
                        </Radio.Group>
                      </Col>
                    </Row>
                  </Form.Item>
                </div>
                <div className="layout-footer">
                  <Button type="primary" htmlType="submit" block>
                    Guardar
                  </Button>
                </div>
              </div>
            </Form>
          </Fragment>
        )}
      </Col>
    </Row>
  );
};

export default NewNote;
