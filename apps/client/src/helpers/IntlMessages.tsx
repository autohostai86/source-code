/** @format */
import React from 'react';
// import { FormattedMessage, injectIntl } from "react-intl";
import { FormattedMessage } from 'react-intl';

interface PropTypes {
    // eslint-disable-next-line react/require-default-props
    values?: any;
    id: string;
}
const InjectMassage: React.FC<PropTypes> = ({ values, id }) => <FormattedMessage values={values} id={id} />;

export default InjectMassage;
