/* eslint-disable array-callback-return */
import {
  CalendarOutlined,
  ControlOutlined,
  ShopOutlined,
  UserOutlined,
} from "@ant-design/icons";
import { Alert, Tag } from "antd";
import React, { useContext, useEffect, useState } from "react";
import { DealContext } from "../../../context/DealCotext";
import moment from "moment";
import { useQuery } from "@apollo/react-hooks";
import { GET_TAGS } from "../../../../Graphql/queries/tags";

const BannerHeader = () => {
  const [tags, setTags] = useState([]);
  const { data } = useQuery(GET_TAGS);

  const {
    idEstado,
    filterDate,
    filterTypeDate,
    filterIdUser,
    tagsListFilter,
    tagsList,
    filterCliente,
    idUser,
    nombreCliFiltrado,
    nombreUsuFiltrado,
  } = useContext(DealContext);

  const returnNombreEstado = () => {
    switch (true) {
      case idEstado === 0:
        return "ABIERTO";
      case idEstado === 1:
        return "GANADO";
      case idEstado === 2:
        return "PERDIDO";
      case idEstado === 3:
        return "ANULADO";
      default:
        return "ABIERTO";
    }
  };

  useEffect(() => {
    if (data) {
      setTags(data.getEtiquetasResolver);
    }
  }, [
    idEstado,
    filterDate,
    filterTypeDate,
    filterIdUser,
    tagsListFilter,
    tagsList,
    filterCliente,
    idUser,
    nombreCliFiltrado,
    nombreUsuFiltrado,
    data,
  ]);

  return (
    <>
      <Alert
        style={{ backgroundColor: "#f7f9d1", border: "none" }}
        message={
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              flexDirection: "row",
            }}
          >
            <span>
              <>
                <ControlOutlined />{" "}
                <span style={{ color: "green" }}>{returnNombreEstado()}</span>
              </>

              <>
                {filterDate && filterDate.length > 0 && (
                  <>
                    {` • `}
                    <CalendarOutlined />{" "}
                    <span style={{ color: "green" }}>
                      {filterTypeDate}{" "}
                      {filterDate && moment(filterDate[0]).format("DD/MM/YYYY")}{" "}
                      -{" "}
                      {filterDate && moment(filterDate[1]).format("DD/MM/YYYY")}
                    </span>
                  </>
                )}
              </>

              {nombreUsuFiltrado && (
                <>
                  {` • `}
                  <UserOutlined />{" "}
                  <span style={{ color: "green" }}>
                    {nombreUsuFiltrado && nombreUsuFiltrado}
                  </span>
                </>
              )}

              {nombreCliFiltrado && (
                <>
                  {` • `}
                  <ShopOutlined />{" "}
                  <span style={{ color: "green" }}>
                    {nombreCliFiltrado && nombreCliFiltrado}
                  </span>
                </>
              )}
            </span>

            <span>
              {tags &&
                tags.map((item) =>
                  tagsListFilter.map((tag) => {
                    if (tag.etq_id === item.etq_id) {
                      return (
                        <Tag color={item.etq_color}>
                          {item.etq_nombre.toUpperCase()}
                        </Tag>
                      );
                    }
                  })
                )}
            </span>
          </div>
        }
      />
    </>
  );
};

export default BannerHeader;
