import { EditOutlined } from '@ant-design/icons';
import { Button, Menu } from 'antd';
import React, { Fragment } from 'react';

const MenuLeft = () => {
	return (
		<Fragment>
			<Menu>
				<Menu.Item>
					<Button type="link">
						<EditOutlined /> Editar Asunto
					</Button>
				</Menu.Item>
				<Menu.Item>
					<Button type="link">
						<EditOutlined /> Editar fecha de vencimiento
					</Button>
				</Menu.Item>
				<Menu.Item>
					<Button type="link">
						<EditOutlined /> Editar valor
					</Button>
				</Menu.Item>
			</Menu>
		</Fragment>
	);
};

export default MenuLeft;
