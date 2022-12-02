import { Card } from 'antd';
import React, { Fragment } from 'react';

const DealCard = ({ title, children, extra }) => {
	return (
		<Fragment>
			<Card title={title.toUpperCase()} extra={extra} style={{ marginBottom: 20, border: 'none', marginLeft: 8 }}>
				{children}
			</Card>
		</Fragment>
	);
};

export default DealCard;
