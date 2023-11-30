import React, { useState} from 'react';
import AboutTable from "./AboutTable";
import {Button, Col, Input, message, Row, Space, Spin} from "antd";
import {PlusOutlined} from "@ant-design/icons";
import {useNavigate} from "react-router-dom";
import apiService from "../../../@crema/services/apis/api";
import { useQuery} from "react-query";
import {EDIT_DATA} from "../../../shared/constants/ActionTypes";
import {useDispatch} from "react-redux";


const Index = () => {
    const navigate = useNavigate()
    const dispatch = useDispatch()

    const {data, isLoading: getCategoryLoading} = useQuery('about-get', () =>
            apiService.getData('/about'), {
            // enabled:false,
            onError: (error) => {

                message.error(error.message);
                // Handle the error
            },
        }
    );
    const [search,setSearch]=useState([])
    const [isSearch,setIsSearch]=useState(false)




    const addArticle = () => {
        dispatch({type: EDIT_DATA, payload: ""})
        navigate('/about/add')
    }
    const serachProduct=(value)=>{
        if (value===""){
            setIsSearch(false)
        }
        else{
            setIsSearch(true)
        }


        const filterData=data?.filter(data=>data.textRu.toLowerCase().includes(value.toLowerCase()) || data.textUz.toLowerCase().includes(value.toLowerCase()))
        setSearch(filterData)
    }
    return (
        <div className={'site-space-compact-wrapper'}>
            <Space direction={'vertical'} style={{width: '100%'}}>
                <Row gutter={20}>
                    <Col span={16}>
                        <Input onChange={(e)=>serachProduct(e.target.value)}/>
                    </Col>
                    <Col span={8}>
                        <Button disabled={data?.length> 0 ? true : false} type="primary" icon={<PlusOutlined/>} style={{width: '100%'}} onClick={addArticle}>
                            Add
                        </Button>
                    </Col>
                </Row>
                <Spin size='medium' spinning={getCategoryLoading}>
                    <AboutTable data={isSearch ? search : data} />
                </Spin>
            </Space>


        </div>
    );
};

export default Index;