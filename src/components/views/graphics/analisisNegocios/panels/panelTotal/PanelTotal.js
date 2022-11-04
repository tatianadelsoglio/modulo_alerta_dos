/* eslint-disable array-callback-return */
import { Card } from "antd";
import React, { useCallback, useEffect, useState } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  Pie,
  PieChart,
  Sector,
  ResponsiveContainer,
} from "recharts";
import { colors } from "../../../../../uiComponet/taskBar/colors";

const PanelTotal = ({ data }) => {
  const [dataCantidad, setDataCantidad] = useState();

  const [dataDinero, setDataDinero] = useState();

  //* render barra o pie dependendiendo de la cant. de data
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
        <text
          x={cx}
          y={cy}
          dy={8}
          textAnchor="middle"
          fill={fill}
          fontSize="13px"
        >
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
        /> */}
        {/* <circle cx={ex} cy={ey} r={2} fill={fill} stroke="none" /> */}
        <text
          x={ex + (cos >= 0 ? 1 : -1) * -30}
          y={ey}
          textAnchor={textAnchor}
          fill="#333"
        >
          {`${criterioGrafico.label} ${value.toLocaleString("de-DE")}`}
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

  const [activeIndex, setActiveIndex] = useState(0);
  const onPieEnter = useCallback(
    (_, index) => {
      setActiveIndex(index);
    },
    [setActiveIndex]
  );
  const [criterioGrafico, setCriterioGrafico] = useState({
    mode: "total",
    label: "U$S",
  });

  const calcularTotales = () => {
    let cantTotal = 0;
    let u$sTotal = 0;
    if (data) {
      data.map((item) => {
        cantTotal = cantTotal + item.cantNegocios;
        u$sTotal = u$sTotal + item.total;
      });
    }
    return { cantTotal, u$sTotal };
  };

  const getColor = (i) => {
    const colorList = [
      "#ff7f50",
      "#87cefa",
      "#da70d6",
      "#32cd32",
      "#6495ed",
      "#ff69b4",
      "#ffa500",
      "#40e0d0",
      "#66f666",
      "#FFA07A",
      "#0066ff",
      "#FA8072",
      "#8DC4DE",
      "#7FFF00",
      "#ba55d3",
      "#cd5c5c",
      "#ADFF2F",
      "#FF0000",
      "#00FF7F",
      "#ADD8E6",
      "#6B8E23",
      "#9ACD32",
      "#3322ff",
      "#32CD32",
    ];

    i = i - 1;

    while (i > colorList.length) {
      i = i - colorList.length;
    }

    return colorList[i];
  };

  useEffect(() => {
    let cantidad = [];
    let dinero = [];

    if (data) {
      data.map((element) => {
        cantidad.push({
          name: element.pip_nombre,
          fill: getColor(element.pip_id),
          value: element.cantNegocios,
        });
        dinero.push({
          name: element.pip_nombre,
          fill: getColor(element.pip_id),
          value: element.total,
        });
      });

      setDataCantidad(cantidad);
      setDataDinero(dinero);
    }
  }, [data]);

  return (
    <div className="wrapper-columna">
      <div className="wrapper-titulo-columnas-graficos">
        <p className="titulo-columnas-graficos">NEGOCIOS TOTALES</p>
      </div>
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
          U$S{" "}
          {calcularTotales().u$sTotal.toLocaleString("de-DE", {
            maximumFractionDigits: 2,
          })}
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
          {calcularTotales().cantTotal} Negocios
        </Card>
      </div>
      {data && data.length > 4 ? (
        <ResponsiveContainer
          width="90%"
          aspect={1.5}
          height="auto"
          maxHeight={500}
        >
          <BarChart width="100%" height="100%" data={data} layout="vertical">
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis type="number" />
            <YAxis type="category" width={150} dataKey="pip_nombre" />
            <Tooltip />
            <Legend />
            <Bar
              dataKey={criterioGrafico.mode}
              fill="#82ca9d"
              name={criterioGrafico.label}
            />
          </BarChart>
        </ResponsiveContainer>
      ) : (
        <ResponsiveContainer
          width="100%"
          aspect={1.5}
          height="auto"
          maxHeight={500}
        >
          <PieChart width="100%" height="100%" maxHeight={500}>
            <Pie
              activeIndex={activeIndex}
              activeShape={renderActiveShape}
              data={
                criterioGrafico.mode === "total" ? dataDinero : dataCantidad
              }
              innerRadius={60}
              outerRadius={80}
              dataKey="value"
              onMouseEnter={onPieEnter}
            />
          </PieChart>
        </ResponsiveContainer>
      )}
    </div>
  );
};

export default PanelTotal;
