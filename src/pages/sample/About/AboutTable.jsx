import { Button,   Space, Table,Image } from "antd";
import {  EditOutlined } from "@ant-design/icons";
import PropTypes from "prop-types";
import {useDispatch} from "react-redux";
import {EDIT_DATA} from "../../../shared/constants/ActionTypes";
import {useNavigate} from "react-router-dom";
import { useEffect, useState } from "react";
const AboutTable = ({data}) => {
    const dispatch=useDispatch()
    const navigate =useNavigate()


    const [reverseData,setReverseData]=useState([])
    const Edit = (id) => {
        localStorage.setItem('editDataId',id)
        dispatch({type:EDIT_DATA,payload:id})
        navigate('/about/add')
    };

    useEffect(()=>{
        const reverse=data?.reverse()
        setReverseData(reverse)
    },[data])


    const columns = [
        {
            title: 'Text Ru',
            dataIndex: 'mainSection',
            id: 'mainSection',
            render: (text) => <p>{text.textRu}</p>,
        },
        {
            title: 'Text Uz',
            dataIndex: 'mainSection',
            id: 'mainSection',
            render: (text) => <p>{text.textUz}</p>,
        },
        {
            title: 'Image',
            dataIndex: 'mainSection',
            id: 'mainSection',
            render: (image) => {
                console.log(image)
                return (
                    <Image
                        width={50}

                        src={`${process.env.REACT_APP_API_URL}/${image?.imageMain?.path}`}
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

AboutTable.propTypes={
    data:PropTypes.array,
}

export default AboutTable;