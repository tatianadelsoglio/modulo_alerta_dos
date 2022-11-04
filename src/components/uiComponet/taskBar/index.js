import { useQuery } from "@apollo/react-hooks";
import React, { useContext } from "react";
import { Fragment } from "react";
import { GET_PORCENTAJES_TIPO_TAREA } from "../../../Graphql/queries/tipoTarea";
import "./taskBar.styles.scss";
import { DealContext } from "../../context/DealCotext";
import TaskBarTooltip from "./taskBarTooltip";
import TaskBarReference from "./taskBarReference";

const TaskBar = ({ task }) => {
  const { negId } = useContext(DealContext);
  const { data } = useQuery(GET_PORCENTAJES_TIPO_TAREA, {
    variables: { idNegocio: negId },
    // pollInterval: 500,
  });

  if (!data) return "";

  // if (!tasks) return;

  return (
    <Fragment>
      {data && (
        <div className="task_bar_container">
          <div className="task_bar_wrapper">
            {data.tiposTareasCantidadResolver.map((tipoTarea, i) => (
              <TaskBarTooltip tipoTarea={tipoTarea} index={i}></TaskBarTooltip>
            ))}
          </div>

          <div className="task_bar_reference_wrapper">
            {data.tiposTareasCantidadResolver.map((tipoTarea, i) => {
              return <TaskBarReference tipoTarea={tipoTarea} index={i} />;
            })}
          </div>
        </div>
      )}
    </Fragment>
  );
};

export default TaskBar;
