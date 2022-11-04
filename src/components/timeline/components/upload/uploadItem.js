/* eslint-disable no-unused-vars */
import {
  PaperClipOutlined,
  PushpinOutlined,
  UserOutlined,
  DeleteOutlined,
} from "@ant-design/icons";
import { useMutation } from "@apollo/client";
import { Button, Popconfirm } from "antd";
import moment from "moment";
import React, { Fragment, useContext } from "react";
import {
  ADJUNTO_ANCLADO,
  ADJUNTO_ARCHIVADO,
} from "../../../../Graphql/mutations/adjunto";
import DocIcon from "../../../icons/doc";
import FileIcon from "../../../icons/file";
import JpgIcon from "../../../icons/jpg";
import PdfIcon from "../../../icons/pdf";
import PngIcon from "../../../icons/png";
import TxtIcon from "../../../icons/txt";
import XlsIcon from "../../../icons/xls";
import { DealContext } from "../../../context/DealCotext";
import { setHistorial } from "../../../../utils/setHistorial";

const UploadItem = ({ upload, attached }) => {
  //
  const [uploadArchivadoResolver] = useMutation(ADJUNTO_ARCHIVADO);
  const [uploadAncladoResolver] = useMutation(ADJUNTO_ANCLADO);
  const { newHistorialNegocioResolver, negId, idUser } =
    useContext(DealContext);
  const {
    up_detalle,
    up_fechaupload,
    up_filename,
    up_id,
    up_mimetype,
    up_size,
    usu_nombre,
    up_anclado,
    up_hashname,
  } = upload;
  let estado = up_anclado;
  const IconFile = (format) => {
    switch (format) {
      case "docx":
        return <DocIcon />;
      case "doc":
        return <DocIcon />;
      // case 'xml':
      // 	return <XmlIcon />;
      case "pdf":
        return <PdfIcon />;
      case "txt":
        return <TxtIcon />;
      case "xls":
        return <XlsIcon />;
      case "xlsx":
        return <XlsIcon />;
      case "jpg":
        return <JpgIcon />;
      case "jpeg":
        return <JpgIcon />;
      case "png":
        return <PngIcon />;

      default:
        return <FileIcon />;
    }
  };

  const formatSize = (size) => {
    const sizeFile = Number(size);
    //
    let template;
    if (size >= 1024) {
      return (template = `${(sizeFile / 1024).toFixed(0)} kb`);
    } else {
      return (template = `${sizeFile.toFixed(0)} bytes`);
    }
  };

  //

  const onAnchor = (id, anclado) => {
    let estado;
    if (anclado === 0) {
      estado = 1;
    } else {
      estado = 0;
    }
    uploadAncladoResolver({ variables: { idUpload: id, anclado: estado } });
  };

  const onArchive = (id) => {
    uploadArchivadoResolver({
      variables: { idUpload: id, origin: "deal" },
    }).then((data) => {
      setHistorial(
        newHistorialNegocioResolver,
        idUser,
        negId,
        0,
        `Se elimino el archivo ${up_filename}`,
        -1
      );
    });
  };

  const onClick = (hash, ext) => {
    //
    // TODO: revisar el puerto
    const PORT = 4001;
    const PROTOCOL = window.location.protocol;
    const HOSTNAME = window.location.hostname;
    const FOLDER = "static";

    // window.open(`http://beeapp.binamics.com.ar:4001/static?file=${hash}`, '_blank');
    window.open(
      `${PROTOCOL}//${HOSTNAME}:${PORT}/${FOLDER}?file=${hash}`,
      "_blank"
    );
  };

  return (
    <Fragment>
      {upload && (
        <div className={!attached ? `file_wrapper ` : `file_wrapper  attached`}>
          <div className="file_icon">{IconFile(up_mimetype)}</div>
          <div className="file_content">
            <div className="upload_header">
              <Button
                className="filename"
                onClick={() => onClick(up_hashname, up_mimetype)}
                type="link"
              >
                {up_filename}
              </Button>

              {!attached && (
                <Fragment>
                  <div className="upload_buttons_wrapper">
                    <Button
                      type="link"
                      onClick={() => onAnchor(up_id, up_anclado)}
                    >
                      <PushpinOutlined
                        className={up_anclado === 1 ? `anchor` : `unanchor`}
                      />
                    </Button>
                    <Popconfirm
                      style={{ width: 200 }}
                      title="¿Deseas eliminar este archivo?"
                      okText="Borrar"
                      cancelText="Cerrar"
                      onConfirm={() => onArchive(up_id)}
                      placement="left"
                    >
                      <Button type="link">
                        <DeleteOutlined style={{ color: "red" }} />
                      </Button>
                    </Popconfirm>
                  </div>
                </Fragment>
              )}
            </div>
            <div className="file_info">
              <div className="file_date">
                {moment(up_fechaupload).startOf("seconds").fromNow()}
              </div>
              {/* <div className="file_author">{usu_nombre}</div> */}
              <div className="file_author">{formatSize(up_size)}</div>
              {up_detalle && (
                <div className="file_contact">
                  <PaperClipOutlined style={{ marginRight: 4 }} />
                  {up_detalle}
                </div>
              )}
              <div className="file_size">
                <UserOutlined style={{ marginRight: 4 }} />
                {usu_nombre}
              </div>
            </div>
          </div>
        </div>
      )}
    </Fragment>
  );
};
export default UploadItem;
