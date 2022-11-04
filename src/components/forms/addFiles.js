import { InboxOutlined } from "@ant-design/icons";
import { useMutation } from "@apollo/client";
import { Button, Form, Input, message, Upload } from "antd";
import React, { Fragment, useContext, useState } from "react";
import { NEW_ADJUNTO } from "../../Graphql/mutations/adjunto";
import { setHistorial } from "../../utils/setHistorial";
import { DealContext } from "../context/DealCotext";
import { DrawerContext } from "../context/DrawContext";
const AddFile = () => {
  const [form] = Form.useForm();
  const [newUploadResolver] = useMutation(NEW_ADJUNTO);
  const { negId, newHistorialNegocioResolver, etaId, idUser } =
    useContext(DealContext);
  const { onClose } = useContext(DrawerContext);
  const { Dragger } = Upload;
  const [disabledDragger, setDisabledDragger] = useState(false);
  const [file, setFile] = useState({});
  const [fList, setFlist] = useState([]);

  const PORT = "4001";
  const PROTOCOL = window.location.protocol;
  const HOSTNAME = window.location.hostname;
  const URL = `${PROTOCOL}//${HOSTNAME}:${PORT}`;

  const props = {
    name: "archivo",
    multiple: false,
    uploaded: false,
    action: `${URL}/files`,
    fileList: fList,
    onChange(info) {
      setFlist(info.fileList.slice(-1));
      const { response, status } = info.file;

      setFile(response);
      if (status !== "uploading") {
      }
      if (status === "done") {
        message.success(
          `${info.file.name} El archivo se adjuntó correctamente.`
        );
      } else if (status === "error") {
        message.error(`${info.file.name} Error al cargar el archivo.`);
      }
    },
    onRemove(info) {
      const { status } = info;

      if (status === "done") {
        message.success(`${info.name} El archivo se eliminó correctamente.`);
        setFlist([]);
      }
    },
  };

  const onFinish = (v) => {
    const extension = file.originalname.split(".")[1];
    const input = {
      up_filename: file.fileName,
      up_mimetype: extension,
      up_hashname: file.filename,
      usu_id: 1,
      up_detalle: v.adj_detalle,
      up_size: String(file.size),
      modori_id: 3,
    };

    // // acá va el resolver.
    newUploadResolver({ variables: { input, idNegocio: negId } }).then(
      (adjunto) => {
        const idAdjunto = adjunto.data.newUploadResolver;
        const template = `####A_${idAdjunto}`;
        const his_detalle = template;

        setHistorial(
          newHistorialNegocioResolver,
          idUser,
          negId,
          Number(etaId),
          his_detalle,
          -1
        );
      }
    );

    form.resetFields();
    onClose();
    setFlist([]);
  };
  return (
    <Fragment>
      <div className="dragger_container">
        <Form
          form={form}
          requiredMark="optional"
          name="etapas"
          layout="vertical"
          onFinish={onFinish}
          autoComplete="off"
        >
          <Form.Item
            label="Detalle"
            name="adj_detalle"
            rules={[
              {
                required: true,
                message: "Campo obligatorio",
              },
            ]}
          >
            <Input
              placeholder="Descripción de archivo"
              style={{ width: "100%" }}
            />
          </Form.Item>
          <Form.Item
            // label="Detalle"
            name="adj   "
            rules={[
              {
                required: true,
                message: "Campo obligatorio",
              },
            ]}
          >
            <Dragger
              {...props}
              disabled={disabledDragger}
              setDisabledDragger={setDisabledDragger}
            >
              <p className="ant-upload-drag-icon">
                <InboxOutlined />
              </p>
              <p className="ant-upload-text">
                Click o arrastrar a esta área para subir un archivo
              </p>
              <p className="ant-upload-hint">
                Los tipos de archivos son PDF, JPEG, PNG, SVG
              </p>
            </Dragger>
          </Form.Item>

          <Form.Item>
            <Button
              type="primary"
              block
              htmlType="submit"
              style={{ marginTop: 20 }}
            >
              Guardar
            </Button>
          </Form.Item>
        </Form>
      </div>
    </Fragment>
  );
};

export default AddFile;
