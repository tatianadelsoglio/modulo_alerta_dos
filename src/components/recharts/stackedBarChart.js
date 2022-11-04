import React, { useEffect } from 'react';
import { Fragment } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const StackedBarChart = (dataChart) => {
	useEffect(() => {}, [dataChart]);
	return (
		<Fragment>
			{dataChart.dataBarChart.length > 0 ? (
				<ResponsiveContainer minHeight={300} minWidth={500}>
					<BarChart
						width={500}
						height={300}
						data={dataChart.dataBarChart}
						margin={{
							top: 5,
							right: 30,
							left: 20,
							bottom: 5,
						}}
					>
						<CartesianGrid strokeDasharray="2  2" />
						<XAxis dataKey="usuario" />
						<YAxis type="number" domain={[0, 20]} />
						<Tooltip formatter={(value) => `${Math.floor(value).toLocaleString('de-DE')} TT`} />
						<Legend dataKey="Abiertos" name="Abiertos" />
						<Bar
							dataKey="Abiertos"
							stackId="a"
							formatter={(value) => `${Math.floor(value).toLocaleString('de-DE')} TT`}
							name="Abiertos"
							fill="hsl(144, 70%, 50%)"
						/>
						<Bar
							dataKey="Cerrados"
							formatter={(value) => `${Math.floor(value).toLocaleString('de-DE')} TT`}
							name="Cerrados"
							stackId="a"
							fill="hsl(347, 70%, 50%)"
						/>

						<CartesianGrid strokeDasharray="2 2" />
					</BarChart>
				</ResponsiveContainer>
			) : (
				'No hay grafico'
			)}
		</Fragment>
	);
};

export default StackedBarChart;
