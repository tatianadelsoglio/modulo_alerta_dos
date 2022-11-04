import {
  DeleteOutlined,
  EditOutlined,
  PushpinOutlined,
} from "@ant-design/icons";
import { useMutation } from "@apollo/client";
import { Badge, Button, Popconfirm } from "antd";
import moment from "moment";
import React, { Fragment, useContext } from "react";
import {
  NOTA_ANCLADA,
  NOTA_ARCHIVADA,
} from "../../../../Graphql/mutations/notas";
import { DealContext } from "../../../context/DealCotext";
import { DrawerContext } from "../../../context/DrawContext";
import { setHistorial } from "../../../../utils/setHistorial";

const NoteItem = ({ note, attached }) => {
  const [notaAncladaResolver] = useMutation(NOTA_ANCLADA);
  const { setDrawerName, showDrawer } = useContext(DrawerContext);
  const { newHistorialNegocioResolver, negId, idUser } =
    useContext(DealContext);
  const { setNotId } = useContext(DealContext);
  const [notaArchivadaResolver] = useMutation(NOTA_ARCHIVADA);

  const { not_desc, not_fechahora, not_id, pri_desc, usu_nombre, not_anclado } =
    note;
  let estado = not_anclado;
  let color;

  switch (pri_desc) {
    case "ALTA":
      color = " #f12d2d";
      break;
    case "MEDIA":
      color = "#e8bc0d";
      break;
    case "BAJA":
      color = "#00b33c";
      break;
    default:
      color = "#f12d2d";
  }
  const onAnchor = (id, anclado) => {
    // estado = anclado;
    let estado;

    if (anclado === 0) {
      estado = 1;
    } else {
      estado = 0;
    }

    notaAncladaResolver({ variables: { idNota: id, anclado: estado } });
  };

  const onEdit = (id) => {
    setNotId(id);
    setDrawerName("Editar Nota");
    showDrawer();
  };

  const onArchive = (not_id) => {
    //
    notaArchivadaResolver({ variables: { idNota: not_id } }).then((data) => {
      setHistorial(
        newHistorialNegocioResolver,
        idUser,
        negId,
        0,
        `Se elimino la nota: ${not_desc}`,
        -1
      );
    });
  };
  return (
    <Fragment>
      <Badge.Ribbon className="ribbon" text={pri_desc} color={color}>
        <div className={!attached ? `note_wrapper` : `note_wrapper attached`}>
          <div className="note_header">
            <div className="note_date">
              {moment(not_fechahora).format("LL")}
            </div>
            <div className="note_author">{usu_nombre}</div>
          </div>
          <div
            className="note_description"
            dangerouslySetInnerHTML={{ __html: not_desc }}
          ></div>

          <Fragment>
            {!attached && (
              <div className="note_anchor">
                <Button
                  type="link"
                  style={{ padding: 5 }}
                  onClick={() => onAnchor(not_id, not_anclado)}
                >
                  <PushpinOutlined
                    className={not_anclado === 1 ? `anchor` : `unanchor`}
                  />
                </Button>
                <Button
                  type="link"
                  style={{ padding: 5 }}
                  onClick={() => onEdit(not_id)}
                >
                  <EditOutlined />
                </Button>
                <Popconfirm
                  style={{ width: 200 }}
                  title="¿Deseas eliminar esta nota?"
                  okText="Borrar"
                  cancelText="Cerrar"
                  onConfirm={() => onArchive(not_id)}
                  placement="left"
                >
                  <Button type="link">
                    <DeleteOutlined style={{ color: "red" }} />
                  </Button>
                </Popconfirm>
              </div>
            )}
          </Fragment>
        </div>
      </Badge.Ribbon>
    </Fragment>
  );
};

export default NoteItem;
