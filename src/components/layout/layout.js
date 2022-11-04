import { Col } from "antd";
import React, { Fragment } from "react";
import "./layout.styles.scss";
const Layout = ({ children }) => {
  return (
    <Fragment>
      {/* <Row gutter={[8, 8]}> */}
      {/* <Col xs={1}>
					<div className="action_nav">hello</div>
				</Col> */}
      <Col xs={24}>{children}</Col>
      {/* </Row> */}
    </Fragment>
  );
};

export default Layout;
