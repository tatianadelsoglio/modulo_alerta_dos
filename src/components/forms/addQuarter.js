import { Col, ConfigProvider, DatePicker, Row } from 'antd';
import locale from 'antd/lib/locale/es_ES';
import moment from 'moment';
import 'moment/locale/es';
import React, { Fragment, useContext, useEffect, useState } from 'react';
import { DealContext } from '../context/DealCotext';

const AddQuarter = () => {
	const [dateRange, setdateRange] = useState(null);
	const { setFilterDate } = useContext(DealContext);

	useEffect(() => {
		setFilterDate(dateRange);
	}, [dateRange, setFilterDate]);

	const dateChange = (v) => {
		const fechaDesde = moment(v).format('YYYY-MM-DD');
		// let currentDate = moment(dateRange);
		let futureMonth = moment(fechaDesde).add(2, 'M');
		let fechaHasta = moment(futureMonth).endOf('month').format('YYYY-MM-DD');

		// const date = moment(v).format('MM');

		if (v) {
			setdateRange([fechaDesde, fechaHasta]);
		} else {
			setdateRange(null);
		}
	};

	return (
		<Fragment>
			<ConfigProvider locale={locale}>
				<Row gutter={[8, 8]}>
					<Col xs={24}>
						{/* <DatePicker onChange={onChange}  />  */}
						<DatePicker
							picker="quarter"
							// format="DD/MM/YYYY"
							onChange={dateChange}
						/>
						{/* <Button type={'primary'} style={{ marginLeft: 8 }} onClick={filter} disabled={dateRange !== null ? false : true}>
							Filtrar
						</Button> */}
					</Col>
				</Row>
			</ConfigProvider>
		</Fragment>
	);
};

export default AddQuarter;
