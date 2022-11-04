import * as React from 'react';

function StepArrow() {
	return (
		<svg width="200" height="20" viewBox="0 0 200 21">
			<g data-name="Grupo 1">
				<path
					data-name="Trazado 1"
					d="M.5 20.5V.5h74.88l5.12 10-5.12 10z"
					fill="#c8c8c8"
					stroke="#fff"
					strokeLinecap="round"
					strokeLinejoin="bevel"
				/>
				<text data-name="20 d\xEDas" transform="translate(22 15)" fill="#fff" fontSize={12} fontFamily="SegoeUI, Segoe UI">
					<tspan x={0} y={0}>
						{'20 d\xEDas'}
					</tspan>
				</text>
			</g>
		</svg>
	);
}

export default StepArrow;
