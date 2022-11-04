import React, { useEffect } from "react";
import { CheckOutlined } from "@ant-design/icons";
import { Fragment } from "react";
import { timeDiff } from "../../../../utils/timeDiff";
import moment from "moment";
import { useState } from "react";

const TaskCompleted = ({ taskStatus, his_fechaupdate, task }) => {
  const [unixTime, setUnixTime] = useState();

  useEffect(() => {
    setUnixTime(moment(task.tar_fecha_ts).format("DD/MM/YYYY HH:mm"));
  }, [task]);

  const colorDeadLine = (closeDate) => {
    const close = new Date(closeDate).getTime();
    const now = Date.now();
    const diff = timeDiff(close, now);
    if (task.est_id === 2) return "#d1d1d1";
    switch (true) {
      case diff <= 0:
        return "#F44336";
      case diff > 0 && diff <= 5:
        return "#faad14";
      default:
        return " #00b33c";
    }
  };

  return (
    <Fragment>
      <div className="task_close_wrapper">
        {taskStatus === 2 && (
          <div
            className="task_close"
            style={{ background: `${colorDeadLine(his_fechaupdate)}` }}
          >
            <span>
              <CheckOutlined style={{ marginRight: 4 }} />
            </span>
            <span>{unixTime} hs</span>
          </div>
        )}
      </div>
    </Fragment>
  );
};

export default TaskCompleted;
