import { Tooltip } from "antd";
import React from "react";
import { Fragment } from "react";
import { colors } from "./colors";

const TaskBarTooltip = ({ tipoTarea, index }) => {
  const name = tipoTarea.tip_desc.toLowerCase();
  const nameCapitalized = name.charAt(0).toUpperCase() + name.slice(1);

  return (
    <Fragment>
      <Tooltip
        placement="top"
        title={`${tipoTarea.cantidadTipoTarea}  ${nameCapitalized}   ( ${tipoTarea.porcentajeTipoTarea}% )`}
      >
        <span
          className="bar consulta"
          style={{
            width: `${tipoTarea.porcentajeTipoTarea}%`,
            background: colors[index],
          }}
        ></span>
      </Tooltip>
    </Fragment>
  );
};

export default TaskBarTooltip;
