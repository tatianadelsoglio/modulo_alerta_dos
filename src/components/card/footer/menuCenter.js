import { UserAddOutlined, UsergroupAddOutlined } from "@ant-design/icons";
import { Button, Menu } from "antd";
import React, { useContext } from "react";
import { DrawerContext } from "../../context/DrawContext";

const MenuCenter = () => {
  const { showDrawer } = useContext(DrawerContext);

  const onClick = () => {
    showDrawer();
  };

  return (
    <Menu>
      <Menu.Item>
        <Button type="link" onClick={onClick}>
          <UserAddOutlined /> Asignar a usuario
        </Button>
      </Menu.Item>
      <Menu.Item>
        <Button type="link">
          <UsergroupAddOutlined /> Asignar a grupo
        </Button>
      </Menu.Item>
    </Menu>
  );
};

export default MenuCenter;
