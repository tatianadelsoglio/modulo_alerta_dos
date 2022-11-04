import { Col, ConfigProvider, DatePicker, Row } from "antd";
import locale from "antd/lib/locale/es_ES";
import moment from "moment";
import "moment/locale/es";
import React, { useContext } from "react";
import { DealContext } from "../context/DealCotext";

const { RangePicker } = DatePicker;

const AddDateSinceUntil = () => {
  const { setFilterDate, filterDate } = useContext(DealContext);

  const dateChange = (v) => {
    if (v) {
      setFilterDate([
        moment(v[0]._d).format("YYYY-MM-DD"),
        moment(v[1]._d).format("YYYY-MM-DD"),
      ]);
    }
  };
  return (
    <ConfigProvider locale={locale}>
      <Row gutter={[8, 8]}>
        <Col xs={24}>
          <RangePicker
            allowClear={false}
            defaultValue={[
              filterDate && filterDate.length > 0 && moment(filterDate[0]),
              filterDate && filterDate.length > 0 && moment(filterDate[1]),
            ]}
            placeholder={["Desde", "Hasta"]}
            onChange={(v) => dateChange(v)}
            format="DD/MM/YYYY"
          />
        </Col>
      </Row>
    </ConfigProvider>
  );
};

export default AddDateSinceUntil;
