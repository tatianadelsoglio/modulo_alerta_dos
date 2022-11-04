import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

const GStackedPG = ({ data, mode }) => {
  return (
    <ResponsiveContainer width="90%" aspect={1.5} height="auto">
      <BarChart layout="vertical" width="100%" height="100%" data={data}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis type="number" />
        <YAxis dataKey="usu_nombre" width={150} type="category" />
        <Tooltip />
        <Legend />
        <Bar
          dataKey={mode === "total" ? "totalPerdidos" : "cantPerdidos"}
          stackId="a"
          fill="#d9264d"
        />
        <Bar
          dataKey={mode === "total" ? "totalGanados" : "cantGanados"}
          stackId="a"
          fill="#26d96e"
        />
      </BarChart>
    </ResponsiveContainer>
  );
};

export default GStackedPG;
