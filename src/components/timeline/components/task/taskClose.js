import { ClockCircleOutlined } from "@ant-design/icons";
import React from "react";
import { Fragment } from "react";
import { timeDiff } from "../../../../utils/timeDiff";
import moment from "moment";

const TaskClose = ({
  taskStatus,
  tar_vencimiento,
  tar_horavencimiento,
  task,
  his_fechaupdate,
}) => {
  const colorDeadLine = (closeDate) => {
    // formateo de fecha a dateNow
    let diff;
    const close = new Date(closeDate).getTime();
    //
    //
    //
    if (taskStatus === 2) {
      const update = new Date(Number(his_fechaupdate)).getTime();
      diff = timeDiff(close, update);
      //
      //
    } else {
      const now = Date.now();
      diff = timeDiff(close, now);
    }
    //
    // if (task.est_id === 2) return '#d1d1d1';
    switch (true) {
      case diff <= 0:
        //
        return "#F44336";
      case diff > 0 && diff <= 5:
        //
        return "#faad14";

      default:
        //
        return " #00b33c";
    }
  };

  return (
    <Fragment>
      <div className="task_close_wrapper">
        <div
          className="task_close"
          style={{ background: `${colorDeadLine(tar_vencimiento)}` }}
        >
          <span>
            <ClockCircleOutlined style={{ marginRight: 4 }} />
          </span>
          <span>
            {moment(new Date(tar_vencimiento)).add(1, "d").format("DD/MM/YYYY")}
          </span>
          <span>
            {" "}
            {tar_horavencimiento && tar_horavencimiento.substring(0, 5)} hs
          </span>
        </div>
      </div>
    </Fragment>
  );
};

export default TaskClose;
