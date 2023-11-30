import React from 'react';
import {Form, Input} from "antd";
import PropTypes from "prop-types";

const FormInput = ({label,name,required,required_text}) => {
    return (
        <Form.Item
            label={label}
            name={name}

            rules={[{
                required: required, message: required_text
            }]}
        >
            <Input />
        </Form.Item>
    );
};

export default FormInput;

FormInput.propTypes = {
    label: PropTypes.string,
    name: PropTypes.any,
    required: PropTypes.bool,
    required_text:PropTypes.string
};