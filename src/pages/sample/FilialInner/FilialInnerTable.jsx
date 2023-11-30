import {Button, Space, Table, Image, Popconfirm} from "antd";
import {DeleteOutlined, EditOutlined} from "@ant-design/icons";
import PropTypes from "prop-types";
import {useDispatch} from "react-redux";
import {EDIT_DATA} from "../../../shared/constants/ActionTypes";
import {useNavigate} from "react-router-dom";
import {useEffect, useState} from "react";

const FilialInnerTable = ({data,deleteHandle}) => {
    const dispatch = useDispatch()
    const navigate = useNavigate()

    const [reverseData, setReverseData] = useState([])

    const Delete = async (id) => {
        deleteHandle('/filialInner',id)
    };

    const Edit = (id) => {
        localStorage.setItem('editDataId', id)
        dispatch({type: EDIT_DATA, payload: id})
        navigate('/filialInner/add')
    };

    useEffect(()=>{
        const reverse=data?.reverse()
        setReverseData(reverse)
    },[data])



    const columns = [
        {
            title: 'Image',
            dataIndex: 'images',
            id: 'images',
            render: (image) => {
                return (
                    <Image
                        width={50}

                        src={`${process.env.REACT_APP_API_URL}/${image[0]?.path}`}
                    />
                )
            },
        },

        {
            title: 'Action',
            id: 'action',
            render: (_, record) => {
                console.log(record)
                return (
                    <Space size={20}>
                        <Button
                            onClick={() => Edit(record._id)}
                            type='primary'
                            icon={<EditOutlined/>}>
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
                )
            },
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

FilialInnerTable.propTypes = {
    data: PropTypes.array,
    deleteHandle: PropTypes.func
}

export default FilialInnerTable;