import {
  CalendarOutlined,
  CopyOutlined,
  PaperClipOutlined,
} from "@ant-design/icons";
import { Timeline as TL } from "antd";
import React, { Fragment, useEffect } from "react";
import Bullet from "./components/bullet/bullet";
import NoteItem from "./components/note/noteItem";
import TaskItem from "./components/task/taskItem";
import UploadItem from "./components/upload/uploadItem";

const Timeline = ({ tasks, notes, uploads, historial, taskStatus, filter }) => {
  useEffect(() => {
    if (!historial) return;
  }, [historial, filter]);

  const createTimeline = (item) => {
    // Esta función toma el item que viene por parámetro y lo asigna a component para retornar
    // un string que defina el tipo de componente que se imprime en pantalla

    let component = { type: "", data: {} };

    if (item.his_detalle.startsWith("####T_")) {
      // Si el detalle inicia con '####T_' es una tarea.
      const idTarea = Number(item.his_detalle.slice(6));
      // Busca la tarea correspondiente al id que se obtiene del detalle del historial
      const taskItem = tasks.filter((item) => item.tar_id === idTarea)[0];

      component.type = "T";
      component.data = { ...taskItem, his_fechaupdate: item.his_fechaupdate };

      if (!taskItem) return;

      if (taskItem.not_id !== null && taskItem.up_id === null) {
        // retornar componente de nota
        component.type = "T_N";
        component.data = taskItem;
      } else if (taskItem.up_id !== null && taskItem.not_id === null) {
        component.type = "T_A";
        component.data = taskItem;
      } else if (taskItem.not_id !== null && taskItem.up_id !== null) {
        // retornar componente de nota
        component.type = "T_N_A";
        component.data = taskItem;
      }
    } else if (item.his_detalle.startsWith("####N_")) {
      const idNota = Number(item.his_detalle.slice(6));
      // Busca la Nota correspondiente al id que se obtiene del detalle del historial
      if (!notes) return;
      const NoteItem = notes.filter((item) => item.not_id === idNota)[0];
      component.type = "N";
      component.data = NoteItem;

      // si la tarea tien una nota o no
    } else if (item.his_detalle.startsWith("####A_")) {
      const idAdjunto = Number(item.his_detalle.slice(6));

      // Busca la Adjunto correspondiente al id que se obtiene del detalle del historial
      const UploadItem = uploads.filter((item) => item.up_id === idAdjunto)[0];

      component.type = "A";
      component.data = UploadItem;
    } else {
      component.type = "B";
      component.data = item;
    }
    return component;
  };

  const createComponent = (item) => {
    let component = createTimeline(item);
    let note;
    let upload;

    if (!component) return;
    switch (component.type) {
      case "T": // Tarea
        return (
          <Fragment>
            {taskStatus === component.data.est_id && (
              <TL.Item
                dot={<CalendarOutlined className="timeline-clock-icon" />}
              >
                <TaskItem
                  task={component.data}
                  taskStatus={taskStatus}
                  note={false}
                  upload={false}
                ></TaskItem>
              </TL.Item>
            )}
          </Fragment>
        );
      case "T_N": // Tarea con nota
        note = {
          not_desc: component.data.not_desc,
          not_fechahora: component.data.not_fechahora,
          not_id: component.data.not_id,
          pri_desc: component.data.pri_desc,
        };

        return (
          <Fragment>
            {taskStatus === component.data.est_id && (
              <TL.Item
                dot={<CalendarOutlined className="timeline-clock-icon" />}
              >
                <TaskItem
                  task={component.data}
                  taskStatus={taskStatus}
                  note={note}
                  upload={false}
                ></TaskItem>
              </TL.Item>
            )}
          </Fragment>
        );
      case "T_A": // Tarea con Adjunto
        upload = {
          up_detalle: component.data.up_detalle,
          up_fechaupload: component.data.up_fechaupload,
          up_filename: component.data.up_filename,
          up_hashname: component.data.up_hashname,
          up_id: component.data.up_id,
          up_mimetype: component.data.up_mimetype,
          usu_nombre: component.data.usu_nombre,
          cli_nombre: component.data.cli_nombre,
          up_size: component.data.up_size,
        };

        return (
          <Fragment>
            {taskStatus === component.data.est_id && (
              <TL.Item
                dot={<CalendarOutlined className="timeline-clock-icon" />}
              >
                <TaskItem
                  task={component.data}
                  taskStatus={taskStatus}
                  note={false}
                  upload={upload}
                ></TaskItem>
              </TL.Item>
            )}
          </Fragment>
        );
      case "T_N_A": // Tarea con nota
        note = {
          not_desc: component.data.not_desc,
          not_fechahora: component.data.not_fechahora,
          not_id: component.data.not_id,
          pri_desc: component.data.pri_desc,
        };
        upload = {
          up_detalle: component.data.up_detalle,
          up_fechaupload: component.data.up_fechaupload,
          up_filename: component.data.up_filename,
          up_hashname: component.data.up_hashname,
          up_id: component.data.up_id,
          up_mimetype: component.data.up_mimetype,
          usu_nombre: component.data.usu_nombre,
          up_size: component.data.up_size,
        };

        return (
          <Fragment>
            {taskStatus === component.data.est_id && (
              <TL.Item
                dot={<CalendarOutlined className="timeline-clock-icon" />}
              >
                <TaskItem
                  task={component.data}
                  taskStatus={taskStatus}
                  note={note}
                  upload={upload}
                ></TaskItem>
              </TL.Item>
            )}
          </Fragment>
        );
      case "N": // nota
        if (!component.data) return "";
        return (
          <Fragment>
            {taskStatus === 2 && (
              <TL.Item dot={<CopyOutlined className="timeline-clock-icon" />}>
                <NoteItem note={component.data} attached={false}></NoteItem>
              </TL.Item>
            )}
          </Fragment>
        );
      case "B": // Bullet
        return (
          <Fragment>
            {taskStatus === 2 && <Bullet data={component.data}></Bullet>}
          </Fragment>
        );
      case "A": // Adjunto
        if (!component.data) return "";
        return (
          <Fragment>
            {taskStatus === 2 && (
              <TL.Item
                dot={<PaperClipOutlined className="timeline-clock-icon" />}
              >
                <UploadItem upload={component.data} attached={false} />
              </TL.Item>
            )}
          </Fragment>
        );

      default:
        break;
    }
  };

  return (
    <Fragment>
      {historial &&
        historial.map((item) => {
          return <TL rever>{createComponent(item)}</TL>;
        })}
    </Fragment>
  );
};

export default Timeline;
