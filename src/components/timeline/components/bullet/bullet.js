import React, { Fragment } from "react";
import { Timeline as TL } from "antd";
import moment from "moment";
import "./styles.bullet.scss";
const Bullet = ({ data }) => {
  const date = Number(data.his_fechaupdate);

  return (
    <Fragment>
        <TL.Item>
          <div className="bullet">
            <span dangerouslySetInnerHTML={{ __html: data.his_detalle }}></span>
            <div className="history_info">
              <div className="history_date">
                {moment(date).format("LL - HH:mm")} hs
              </div>{" "}
              · <div className="history_user">{data.usu_nombre}</div>
            </div>
          </div>
        </TL.Item>
    </Fragment>
  );
};

export default Bullet;
