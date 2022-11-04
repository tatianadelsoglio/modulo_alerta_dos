import { useMutation, useQuery } from "@apollo/react-hooks";
import React, { useState } from "react";
import { Fragment } from "react";
import { GET_TAGS } from "../../Graphql/queries/tags";
import { Form, Row, Col, Input, Button } from "antd";
import { CheckOutlined } from "@ant-design/icons";
import { UPDATE_ETIQUETA } from "../../Graphql/mutations/tags";
import OldTagItem from "../tags/oldTagItem";

const TagsConfig = ({ autorizado }) => {
  const { data, startPolling, stopPolling } = useQuery(GET_TAGS);
  const [showForm, setShowForm] = useState(false);
  const [form] = Form.useForm();
  const [color, setColor] = useState("");
  const [idTag, setIdTag] = useState();
  const [nameTag, setNameTag] = useState("");

  const [updateEtiquetaResolver] = useMutation(UPDATE_ETIQUETA, {
    // onCompleted: () => {
    // 	setTimeout(() => {
    // 		stopPolling();
    // 	}, 00);
    // },
  });

  if (!data) return "";
  const onFinish = (value) => {
    setShowForm(false);
    updateEtiquetaResolver({
      variables: { idEtiqueta: idTag, input: value },
    })
    // .finally(() => {
    //   setTimeout(() => {
    //     stopPolling();
    //   }, 600);
    // });
    // startPolling(500);
  };

  const newTagName = (etq_id) => {
    setShowForm(true);
    //
    setIdTag(etq_id);

    const tagEdit = data.getEtiquetasResolver.filter(
      (tag) => tag.etq_id === etq_id
    );
    setNameTag(tagEdit[0].etq_nombre);
    // form.getFieldValue();

    setColor(tagEdit[0].etq_color);
  };

  return (
    <Fragment>
      <div className="divider"></div>
      <h4>Etiquetas</h4>
      {showForm && (
        <Form
          layout="vertical"
          form={form}
          onFinish={onFinish}
          requiredMark="optional"
        >
          <Row gutter={[8, 8]} align="bottom">
            <Col xs={19}>
              <Form.Item name="etq_nombre" label="Nombre">
                <div className="tag_wrapper" style={{ background: color }}>
                  <Input
                    size="small"
                    placeholder=""
                    defaultValue={nameTag}
                    style={{
                      background: "transparent",
                      color: "white",
                      border: "none",
                      outline: "none",
                    }}
                  />
                </div>
              </Form.Item>
            </Col>
            <Col xs={5}>
              <Button
                type="link"
                htmlType="submit"
                icon={<CheckOutlined />}
                style={{ marginBottom: 8 }}
              ></Button>
            </Col>
          </Row>
        </Form>
      )}

      {!showForm && (
        <Fragment>
          {data.getEtiquetasResolver.map((tag) => {
            const { etq_nombre, etq_color, etq_id } = tag;

            return (
              <OldTagItem
                name={etq_nombre}
                color={etq_color}
                // isChecked={selected && selected.length > 0 ? true : false}
                key={etq_id}
                tagId={etq_id}
                autorizado={autorizado}
                setShowForm={newTagName}
                filter={true}
              />
            );
          })}
        </Fragment>
      )}
    </Fragment>
  );
};

export default TagsConfig;
