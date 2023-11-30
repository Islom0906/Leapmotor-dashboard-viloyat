import {Button,  Space, Table, Image} from "antd";
import { EditOutlined} from "@ant-design/icons";
import PropTypes from "prop-types";
import {useDispatch} from "react-redux";
import {EDIT_DATA} from "../../../shared/constants/ActionTypes";
import {useNavigate} from "react-router-dom";
import {useEffect, useState} from "react";

const ProductTable = ({data}) => {
    const dispatch = useDispatch()
    const navigate = useNavigate()

    const [reverseData, setReverseData] = useState([])
    const Edit = (id) => {
        localStorage.setItem('editDataId', id)
        dispatch({type: EDIT_DATA, payload: id})
        navigate('/banner/add')
    };

    useEffect(() => {
        console.log(data)
        const reverse = []
        reverse.push(data)
        setReverseData(reverse)
    }, [data])



    const columns = [
        {
            title: 'Logo',
            dataIndex: 'imageLogo',
            id: 'imageLogo',
            render: (image) => {
                return (
                    <Image
                        width={50}

                        src={`${process.env.REACT_APP_API_URL}/${image?.path}`}
                    />
                )
            },
        },
        {
            title: 'Brand',
            dataIndex: 'imageBrand',
            id: 'imageBrand',
            render: (image) => {
                return (
                    <Image
                        width={50}

                        src={`${process.env.REACT_APP_API_URL}/${image?.path}`}
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

ProductTable.propTypes = {
    data:PropTypes.object,

}

export default ProductTable;