import {Button, Popconfirm, Space, Table, Tag} from "antd";
import { DeleteOutlined, EditOutlined } from "@ant-design/icons";
import PropTypes from "prop-types";
import {useDispatch} from "react-redux";
import {EDIT_DATA} from "../../../shared/constants/ActionTypes";
import {useNavigate} from "react-router-dom";
import { useEffect, useState } from "react";

const RegionTable = ({data,deleteHandle}) => {
    const dispatch=useDispatch()
    const navigate =useNavigate()
    const Delete = async (id) => {
        deleteHandle('/region',id)
    };

    const [reverseData,setReverseData]=useState([])

    const Edit = (id) => {
        localStorage.setItem('editDataId',id)
        dispatch({type:EDIT_DATA,payload:id})
        navigate('/region/add')
    };

    useEffect(()=>{
        const reverse=data?.reverse()
        setReverseData(reverse)
    },[data])
    const columns = [
        {
            title: 'Title Ru',
            dataIndex: 'nameRu',
            id: 'nameRu',
            render: (text) => <p>{text}</p>,
        },
        {
            title: 'Title Uz',
            dataIndex: 'nameUz',
            id: 'nameUz',
            render: (text) => <p>{text}</p>,
        },
        {
            title: 'Dealers',
            dataIndex: 'dealers',
            id: 'dealers',
            render: (text) =><Space direction={"vertical"}>
                {
                text.map(title=>(
                <Tag key={title?.id}>{title?.nameRu}</Tag>
                    ))
                }
            </Space>
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

RegionTable.propTypes={
    data:PropTypes.array,
    deleteHandle:PropTypes.func
}

export default RegionTable;