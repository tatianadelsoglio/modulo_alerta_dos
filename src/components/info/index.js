import React from 'react';
import { Fragment } from 'react';
import { Popover, Button } from 'antd';
import { InfoCircleOutlined } from '@ant-design/icons';

const Info = ({ title, placement, children }) => {
	return (
		<Fragment>
			<Popover placement={placement} title={title} content={children} trigger="click">
				<Button type="link" style={{ padding: 0 }}>
					{' '}
					<InfoCircleOutlined style={{ paddingLeft: 0 }} />
				</Button>
			</Popover>
		</Fragment>
	);
};

export default Info;
