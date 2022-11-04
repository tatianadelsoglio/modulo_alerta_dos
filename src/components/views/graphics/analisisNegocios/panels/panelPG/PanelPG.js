import { Card } from "antd";
import React, { useCallback, useEffect, useState } from "react";
import { PieChart, Pie, Sector, ResponsiveContainer } from "recharts";
import GStackedPG from "./GStackedPG";

const PanelPG = ({ data, stackedData }) => {
  //* total cantidad
  const [dataCantidad, setDataCantidad] = useState();
  //* total dinero
  const [dineroTorta, setDineroTorta] = useState();

  const [criterioGrafico, setCriterioGrafico] = useState({
    mode: "total",
    label: "U$S",
  });

  useEffect(() => {
    if (data) {
      setDataCantidad([
        {
          name: "Ganados",
          fill: "#26d96e",
          value: data.ganados,
        },
        {
          name: "Perdidos",
          fill: "#d9264d",
          value: data.perdidos,
        },
      ]);

      setDineroTorta([
        {
          name: "Ganados",
          fill: "#26d96e",
          value: data.u$sGanados,
        },
        {
          name: "Perdidos",
          fill: "#d9264d",
          value: data.u$sPerdidos,
        },
      ]);
    }
  }, [data]);

  const renderActiveShape = (props) => {
    const RADIAN = Math.PI / 180;
    const {
      cx,
      cy,
      midAngle,
      innerRadius,
      outerRadius,
      startAngle,
      endAngle,
      fill,
      payload,
      percent,
      value,
    } = props;
    const sin = Math.sin(-RADIAN * midAngle);
    const cos = Math.cos(-RADIAN * midAngle);
    const sx = cx + (outerRadius + 10) * cos;
    const sy = cy + (outerRadius + 10) * sin;
    const mx = cx + (outerRadius + 30) * cos;
    const my = cy + (outerRadius + 30) * sin;
    const ex = mx + (cos >= 0 ? 1 : -1) * 22;
    const ey = my;
    const textAnchor = cos >= 0 ? "start" : "end";

    return (
      <g>
        <text x={cx} y={cy} dy={8} textAnchor="middle" fill={fill}>
          {payload.name}
        </text>
        <Sector
          cx={cx}
          cy={cy}
          innerRadius={innerRadius}
          outerRadius={outerRadius}
          startAngle={startAngle}
          endAngle={endAngle}
          fill={fill}
        />
        <Sector
          cx={cx}
          cy={cy}
          startAngle={startAngle}
          endAngle={endAngle}
          innerRadius={outerRadius + 6}
          outerRadius={outerRadius + 10}
          fill={fill}
        />
        {/* <path
          d={`M${sx},${sy}L${mx},${my}L${ex},${ey}`}
          stroke={fill}
          fill="none"
        />
        <circle cx={ex} cy={ey} r={2} fill={fill} stroke="none" /> */}
        <text
          x={ex + (cos >= 0 ? 1 : -1) * -30}
          y={ey}
          textAnchor={textAnchor}
          fill="#333"
        >
          {criterioGrafico.mode === "total"
            ? `${criterioGrafico.label} ${value.toLocaleString("de-DE")}`
            : `${value.toLocaleString("de-DE")}`}
        </text>
        <text
          x={ex + (cos >= 0 ? 1 : -1) * -30}
          y={ey}
          dy={18}
          textAnchor={textAnchor}
          fill="#999"
        >
          {`(${(percent * 100).toFixed(2)}%)`}
        </text>
      </g>
    );
  };

  const calcularTotal = () => {
    let total = 0;
    dineroTorta.map((item) => {
      total = total + item.value;
    });

    return total;
  };

  const [activeIndex, setActiveIndex] = useState(0);
  const onPieEnter = useCallback(
    (_, index) => {
      setActiveIndex(index);
    },
    [setActiveIndex]
  );
  return (
    <div className="wrapper-columna">
      <div className="wrapper-titulo-columnas-graficos">
        <p className="titulo-columnas-graficos">NEGOCIOS CERRADOS</p>
      </div>
      {dataCantidad && dineroTorta && (
        <div
          style={{
            display: "flex",
            flexDirection: "row",
            justifyContent: "space-between",
          }}
        >
          <Card
            className="cajas-totales-paneles"
            style={{
              fontSize: "16px",
              borderRight: "1px solid rgba(236, 236, 236, 0.719)",
            }}
            onClick={() => setCriterioGrafico({ mode: "total", label: "U$S" })}
          >
            <span>
              Total U$S{" "}
              {calcularTotal().toLocaleString("de-DE", {
                maximumFractionDigits: 2,
              })}
            </span>
          </Card>

          <Card
            className="cajas-totales-paneles"
            style={{ fontSize: "16px" }}
            onClick={() =>
              setCriterioGrafico({
                mode: "cantNegocios",
                label: "Cantidad de negocios",
              })
            }
          >
            <div style={{ display: "flex", flexDirection: "column" }}>
              <span>Perdidos {dataCantidad[1].value}</span>
              <span>Ganados {dataCantidad[0].value}</span>
            </div>
          </Card>
        </div>
      )}
      <div
        style={{
          backgroundColor: "#fff",
          borderRadius: "4px",
        }}
      >
        <ResponsiveContainer
          width="100%"
          aspect={1.5}
          height="auto"
          maxHeight={500}
        >
          <PieChart width="100%" height="100%">
            <Pie
              activeIndex={activeIndex}
              activeShape={renderActiveShape}
              data={
                criterioGrafico.mode === "total" ? dineroTorta : dataCantidad
              }
              innerRadius={60}
              outerRadius={80}
              dataKey="value"
              onMouseEnter={onPieEnter}
            />
          </PieChart>
        </ResponsiveContainer>
        <GStackedPG data={stackedData} mode={criterioGrafico.mode} />
      </div>
    </div>
  );
};

export default PanelPG;
