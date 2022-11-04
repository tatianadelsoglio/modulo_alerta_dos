import { useState, useEffect } from 'react';

// Hook
function useDrawer() {
	// Este hook tiene la funcionalidad de controlar el funcionamiento del componente Drawer.
	// Por medio deste hook se podrá abrir o cerrar el panel principal o el panel hijo.
	const [stateDrawer, setStateDrawer] = useState({ visible: false, childrenDrawer: false });

	useEffect(() => {
		//
	}, [stateDrawer]); // Empty array ensures that effect is only run on mount

	const setDrawer = (visible, childrenDrawer) => {
		const drawer = {
			visible,
			childrenDrawer,
		};
		setStateDrawer(drawer);
	};

	const showDrawer = () => {
		setDrawer(true, false);
	};

	const onClose = () => {
		setDrawer(false, false);
	};

	const showChildrenDrawer = () => {
		setDrawer(true, true);
	};

	const onChildrenDrawerClose = () => {
		setDrawer(true, false);
	};

	return { stateDrawer, setDrawer, showDrawer, onClose, showChildrenDrawer, onChildrenDrawerClose };
}

export default useDrawer;
