import {
  CloseOutlined,
  DislikeOutlined,
  LikeOutlined,
} from "@ant-design/icons";
import { Button, Menu } from "antd";
import React, { useContext, useEffect } from "react";
import { DealContext } from "../../context/DealCotext";
import { DrawerContext } from "../../context/DrawContext";

const MenuRigth = ({ deal }) => {
  const { showDrawer, setDrawerName, setDrawerDetail } =
    useContext(DrawerContext);
  const { setNegId } = useContext(DealContext);

  useEffect(() => {}, [deal]);

  const onClickGanado = () => {
    setDrawerName("Negocio Ganado");
    setDrawerDetail("");
    showDrawer();
    setNegId(deal.neg_id);
  };

  const onClickPerdido = () => {
    setDrawerName("Negocio Perdido");
    setDrawerDetail("");
    showDrawer();
    setNegId(deal.neg_id);
  };

  const onClickAnular = () => {
    setDrawerName("Negocio Anulado");
    setDrawerDetail("");
    showDrawer();
    setNegId(deal.neg_id);
  };
  return (
    <Menu>
      <Menu.Item>
        <Button
          type={"link"}
          onClick={onClickGanado}
          style={{ color: "black" }}
        >
          <LikeOutlined style={{ color: "green" }} /> Cerrar Ganado
        </Button>
      </Menu.Item>
      <Menu.Item>
        <Button
          type={"link"}
          onClick={onClickPerdido}
          style={{ color: "black" }}
        >
          <DislikeOutlined style={{ color: "red" }} /> Cerrar Perdido
        </Button>
      </Menu.Item>
      <Menu.Item>
        <Button type="link" onClick={onClickAnular} style={{ color: "black" }}>
          <CloseOutlined /> Anular negocio
        </Button>
      </Menu.Item>
    </Menu>
  );
};

export default MenuRigth;
