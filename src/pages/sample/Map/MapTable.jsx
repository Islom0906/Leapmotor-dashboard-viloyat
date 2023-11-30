import { Button,  Popconfirm, Space, Table } from "antd";
import { DeleteOutlined, EditOutlined } from "@ant-design/icons";
import PropTypes from "prop-types";
import {useDispatch} from "react-redux";
import {EDIT_DATA} from "../../../shared/constants/ActionTypes";
import {useNavigate} from "react-router-dom";
import { useEffect, useState } from "react";

const MapTable = ({data,deleteHandle}) => {
    const dispatch=useDispatch()
    const navigate =useNavigate()
    const Delete = async (id) => {
        deleteHandle('/map',id)
    };

    const [reverseData,setReverseData]=useState([])

    const Edit = (id) => {
        localStorage.setItem('editDataId',id)
        dispatch({type:EDIT_DATA,payload:id})
        navigate('/map/add')
    };

    useEffect(()=>{
        const reverse=data?.reverse()
        setReverseData(reverse)
    },[data])
    const columns = [
        {
            title: 'Name Ru',
            dataIndex: 'nameRu',
            id: 'nameRu',
            render: (text) => <p>{text}</p>,
        },
        {
            title: 'Name Uz',
            dataIndex: 'nameUz',
            id: 'nameRu',
            render: (text) => <p>{text}</p>,
        },
        {
            title: 'Working Time',
            dataIndex: 'workingTime',
            id: 'workingTime',
            render: (text) => <p>{text}</p>,
        },
        {
            title: 'Tel',
            dataIndex: 'tel',
            id: 'tel',
            render: (text) => <p>{text}</p>,
        },
        {
            title: 'Action',
            id: 'action',
            render: (_, record) => (
                <Space size={20}>
                    <Button
                        onClick={() => Edit(record._id)}
                        type='primary'
                        icon={<EditOutlined />}>
                        Edit
                    </Button>
                    <Popconfirm
                        title={'Are you sure to delete this task?'}
                        description={'Delete the task '}
                        onConfirm={() => Delete(record._id)}>
                        <Button type='danger' icon={<DeleteOutlined />}>
                            Delete
                        </Button>
                    </Popconfirm>
                </Space>
            ),
        },
    ];

    return (
        <div>
            <Table
                columns={columns}
                dataSource={reverseData}
                rowKey={(record) => record._id}
            />
        </div>
    );
};

MapTable.propTypes={
    data:PropTypes.array,
    deleteHandle:PropTypes.func
}

export default MapTable;