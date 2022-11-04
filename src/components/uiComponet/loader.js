import { Spin } from 'antd';
import React, { Fragment } from 'react';
import './styles.scss';

const Loader = ({ loading }) => {
    return (

        <Fragment>
            <div className="container">
                {/* <h1>CARGANDO</h1> */}
                <Spin spinning={loading} delay={100} size={'large'} />

            </div>
        </Fragment>
    );
};

export default Loader;
