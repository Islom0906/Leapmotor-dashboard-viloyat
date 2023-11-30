import { Button,   Space, Table } from "antd";
import {  EditOutlined } from "@ant-design/icons";
import PropTypes from "prop-types";
import {useDispatch} from "react-redux";
import {EDIT_DATA} from "../../../shared/constants/ActionTypes";
import {useNavigate} from "react-router-dom";
import { useEffect, useState } from "react";

const ContactTable = ({data}) => {
    const dispatch=useDispatch()
    const navigate =useNavigate()

    const [reverseData,setReverseData]=useState([])

    const Edit = (id) => {
        localStorage.setItem('editDataId',id)
        dispatch({type:EDIT_DATA,payload:id})
        navigate('/contact/add')
    };

    useEffect(() => {
        const reverse = []
        if (data){
        reverse.push(data)
        }
        setReverseData(reverse)
    }, [data])

    const columns = [
        {
            title: 'Tel',
            dataIndex: 'tel',
            id: 'tel',
            render: (text) => <p>{text}</p>,
        },
        {
            title: 'Facebook',
            dataIndex: 'facebook',
            id: 'facebook',
            render: (text) => <p>{text}</p>,
        },
        {
            title: 'Telegram',
            dataIndex: 'twitter',
            id: 'twitter',
            render: (text) => <p>{text}</p>,
        },
        {
            title: 'Instagram',
            dataIndex: 'instagram',
            id: 'instagram',
            render: (text) => <p>{text}</p>,
        },
        {
            title: 'Action',
            id: 'action',
            render: (_, record) => (
                <Space size={20}>
                    <Button
                        onClick={() => Edit(record?._id)}
                        type='primary'
                        icon={<EditOutlined />}>
                        Edit
                    </Button>

                </Space>
            ),
        },
    ];

    return (
        <div>
            <Table
                columns={columns}
                dataSource={reverseData}
                rowKey={(record) => record?._id}
            />
        </div>
    );
};

ContactTable.propTypes={
    data:PropTypes.object,
}

export default ContactTable;