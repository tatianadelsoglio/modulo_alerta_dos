import { useEffect } from "react";
import {
  BarChart,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  Bar,
  ResponsiveContainer,
} from "recharts";

const GStackedACA = ({ data, mode }) => {
  useEffect(() => {
    if (data) {
      data.sort((a, b) => {
        const sumatoriaA = a.totalAbiertos + a.totalCerrados + a.totalAnulados;
        const sumatoriaB = b.totalAbiertos + b.totalCerrados + b.totalAnulados;
        return sumatoriaB - sumatoriaA;
      });
    }
  }, [data]);

  return (
    <ResponsiveContainer width="90%" aspect={1.5} height="auto" maxHeight={500}>
      <BarChart layout="vertical" width="100%" height="100%" data={data}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis type="number" />
        <YAxis dataKey="usu_nombre" width={150} type="category" />
        <Tooltip />
        <Legend />
        <Bar
          dataKey={mode === "total" ? "totalAbiertos" : "cantAbiertos"}
          stackId="a"
          fill="#26d96e"
        />
        <Bar
          dataKey={mode === "total" ? "totalCerrados" : "cantCerrados"}
          stackId="a"
          fill="#d9264d"
        />
        <Bar
          dataKey={mode === "total" ? "totalAnulados" : "cantAnulados"}
          stackId="a"
          fill="#F1C40F"
        />
      </BarChart>
    </ResponsiveContainer>
  );
};

export default GStackedACA;
