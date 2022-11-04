import { Button, Col, ConfigProvider, Row } from 'antd';
import locale from 'antd/lib/locale/es_ES';
import moment from 'moment';
import 'moment/locale/es';
import React, { Fragment, useContext, useEffect, useState } from 'react';
import { DealContext } from '../context/DealCotext';

const FilterLastWeek = () => {
	const [dateRange, setdateRange] = useState([]);
	const { setFilterDate } = useContext(DealContext);
	const date = moment(Date.now()).format('DD/MM/YYYY');
	const hasta = moment(Date.now()).format('YYYY-MM-DD');
	const sieteMenos = moment(Date.now()).subtract(7, 'days').format('DD/MM/YYYY');
	const desde = moment(Date.now()).subtract(7, 'days').format('YYYY-MM-DD');

	useEffect(() => {
		setFilterDate(dateRange);
	}, [dateRange, setFilterDate]);

	const onClick = () => {
		setdateRange([desde, hasta]);
		// setdateRange([desde, hasta]);
	};

	return (
		<Fragment>
			<ConfigProvider locale={locale}>
				<Row gutter={[8, 8]}>
					<Col xs={24}>
						<Button type="dashed" onClick={onClick}>
							Desde {sieteMenos} hasta {date}
						</Button>
					</Col>
				</Row>
			</ConfigProvider>
		</Fragment>
	);
};

export default FilterLastWeek;
