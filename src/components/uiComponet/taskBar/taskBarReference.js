import React from 'react';
import { Fragment } from 'react';
import { toCapitalize } from '../../../utils/toCapitalize';
import { colors } from './colors';

const TaskBarReference = ({ tipoTarea, index }) => {
	// cantidadTipoTarea: "1"
	// porcentajeTipoTarea: "33.33"
	// tip_desc: "COTIZACION"
	// tip_id: 2

	return (
		<Fragment>
			<div className="task_bar_reference_item">
				<span className="reference" style={{ background: `${colors[index]}` }}></span>
				<span className="item">
					{toCapitalize(tipoTarea.tip_desc)} ({tipoTarea.cantidadTipoTarea}){' '}
				</span>
			</div>
		</Fragment>
	);
};

export default TaskBarReference;
