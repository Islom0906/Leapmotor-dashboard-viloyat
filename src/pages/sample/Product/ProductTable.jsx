import { Button,  Popconfirm, Space, Table,Image } from "antd";
import { DeleteOutlined, EditOutlined } from "@ant-design/icons";
import PropTypes from "prop-types";
import {useDispatch} from "react-redux";
import {EDIT_DATA} from "../../../shared/constants/ActionTypes";
import {useNavigate} from "react-router-dom";
import { useEffect, useState } from "react";
const ProductTable = ({data,deleteHandle}) => {
    const dispatch=useDispatch()
    const navigate =useNavigate()
    const Delete = async (id) => {
        deleteHandle('/Product',id)
    };

    const [reverseData,setReverseData]=useState([])
    const Edit = (id) => {
        localStorage.setItem('editDataId',id)
        dispatch({type:EDIT_DATA,payload:id})
        navigate('/product/add')
    };

    useEffect(()=>{
        const reverse=data?.reverse()
        setReverseData(reverse)
    },[data])


    const columns = [
        {
            title: 'Text Ru',
            dataIndex: 'textRu',
            id: 'textRu',
            render: (text) => <p>{text}</p>,
        },
        {
            title: 'Text Uz',
            dataIndex: 'textUz',
            id: 'textUz',
            render: (text) => <p>{text}</p>,
        },
        {
            title: 'Image',
            dataIndex: 'imageBanner',
            id: 'imageBanner',
            render: (image) => {
                return (
                    <Image
                        width={50}

                        src={`${process.env.REACT_APP_API_URL}/${image?.path}`}
                    />
                )},
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

ProductTable.propTypes={
    data:PropTypes.array,
    deleteHandle:PropTypes.func
}

export default ProductTable;