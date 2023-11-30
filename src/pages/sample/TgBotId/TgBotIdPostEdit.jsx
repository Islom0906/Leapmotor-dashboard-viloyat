import React, {useEffect, useMemo, useState} from 'react';
import {Button, Col, Form, message, Row, Select} from "antd";
import {useMutation, useQuery} from "react-query";
import apiService from "../../../@crema/services/apis/api";
import {AppLoader} from "../../../@crema";
import {useNavigate} from "react-router-dom";
import {useDispatch, useSelector} from "react-redux";
import {EDIT_DATA} from "../../../shared/constants/ActionTypes";
import FormInput from "../../../@crema/core/Form/FormInput";

const initialValueForm = {
    name: "",
    tgId: "",
    role: "",
    region:"",
    dealer:""
};




const TgBotIdPostEdit = () => {

    const [form] = Form.useForm();
    const navigate = useNavigate()
    const {editId} = useSelector(state => state.editData)
    const dispatch = useDispatch()

    const [dealers, setDealers] = useState([])
    const [isDrive, setIsDrive] = useState(false)
    // query-region
    const {data: regionData} = useQuery('get-region', () => apiService.getData('/region'));


    // query-tgbot
    const {
        mutate: postTgBotMutate,
        data: postTgBot,
        isLoading: postTgBotLoading,
        isSuccess: postTgBotSuccess,
    } = useMutation(({url, data}) => apiService.postData(url, data), {
        onSuccess: () => {

            message.success('Success')
        },
        onError: (error) => {
            for (let obj in error.response.data) {
                message.error(`${obj}: ${error.response.data[obj][0]}`)
            }
        }
    });

    // query-edit
    const {
        isLoading: editTgBotLoading,
        data: editTgBotData,
        refetch: editTgBotRefetch,
        isSuccess: editTgBotSuccess,
    } = useQuery(["edit-tgbot", editId], () => apiService.getDataByID("/tgbot", editId), {
        enabled: false
    });
    // put-query
    const {
        mutate: putTgBot,
        isLoading: putTgBotLoading,
        data: putData,
        isSuccess: putTgBotSuccess
    } = useMutation(({
                         url,
                         data,
                         id
                     }) => apiService.editData(url, data, id), {
        onSuccess: () => {
            message.success('Success')
        },
        onError: (error) => {
            for (let obj in error.response.data) {
                message.error(`${obj}: ${error.response.data[obj][0]}`)
            }
        }
    });

    // tgbot success
    useEffect(() => {
        if (putTgBotSuccess) {
            dispatch({type: EDIT_DATA, payload: ""})
        }

        if (postTgBotSuccess || putTgBotSuccess) {

            navigate('/tgbot')
        }
    }, [postTgBot, putData])


    // if edit tgbot
    useEffect(() => {
        if (editId !== "") {
            editTgBotRefetch();
        }
    }, [editId]);

    // if no edit tgbot
    useEffect(() => {
        if (editId === "") {
            form.setFieldsValue(initialValueForm)
        }
    }, []);


    //edit tgbot
    useEffect(() => {

        if (editTgBotSuccess) {

            const edit = {
                name: editTgBotData.name,
                tgId: editTgBotData.tgId,
                role: editTgBotData.role,
                region: editTgBotData.region,
                dealer: editTgBotData.dealer,

            }
            if (editTgBotData.role==='drive'){
                setIsDrive(true)
            }else{
                setIsDrive(false)
            }
            form.setFieldsValue(edit)
        }

    }, [editTgBotData])


    const onFinish = (values) => {

        const data={
            name: values.name,
            tgId: values.tgId,
            role: values.role,
            region:isDrive ? values.region : "",
            dealer:isDrive ? values.dealer : ""
        }

        if (editTgBotData) {
            putTgBot({url: '/tgbot', data, id: editId})
        } else {
            postTgBotMutate({url: "/tgbot/", data});
        }


    }
    const onFinishFailed = (errorInfo) => {
        console.log("Failed:", errorInfo);
    };


    // refresh page again get data
    useEffect(() => {
        const storedValues = JSON.parse(localStorage.getItem('myFormValues'));
        if (storedValues) {
            storedValues.images = []
            form.setFieldsValue(storedValues);
        }

        const handleBeforeUnload = () => {

            localStorage.setItem(
                'myFormValues',
                JSON.stringify(form.getFieldsValue()),
            );
        };

        window.addEventListener('beforeunload', handleBeforeUnload);

        return () => {
            localStorage.removeItem('editDataId')
            localStorage.removeItem('myFormValues')
            window.removeEventListener('beforeunload', handleBeforeUnload);
        }
    }, []);

    // selection

    const changeRole=(value)=>{
        if (value==='drive'){
            setIsDrive(true)
        }else{
            setIsDrive(false)
        }
    }


    const optionsRole = useMemo(() => {
        return [
            {
                value: "all",
                label: "Все роли",
            },
            {
                value: "drive",
                label: "Тест-драйв",
            },
            {
                value: "dealer",
                label: "Дилер",
            },
            {
                value: "order",
                label: "Заказ",
            },
        ]
    }, []);

    const changeRegion=(value)=>{
        const findCountry= regionData?.find(dealers=>dealers.nameRu===value)
        setDealers(findCountry?.dealers)
        console.log(findCountry)
    }

    const optionsRegion = useMemo(() => {
        return regionData?.map((option) => {
            return {
                value: option?.nameRu,
                label: option?.nameRu,
            };
        });
    }, [regionData]);

    const optionsDealers = useMemo(() => {
        console.log(regionData)
        return dealers?.map((option) => {
            return {
                value: option?.nameRu,
                label: option?.nameRu,
            };
        });
    }, [dealers]);



    return (
        <div>
            {(postTgBotLoading || editTgBotLoading || putTgBotLoading) ?
                <AppLoader/> :
                <Form
                    form={form}
                    name="basic"
                    labelCol={{
                        span: 24
                    }}
                    wrapperCol={{
                        span: 24
                    }}
                    style={{
                        maxWidth: "100%"
                    }}
                    initialValues={initialValueForm}
                    onFinish={onFinish}
                    onFinishFailed={onFinishFailed}
                    autoComplete="off"
                >
                    <Row gutter={20}>
                        <Col span={12}>
                            <FormInput
                                required={true}
                                required_text={'Требуется заполнение'}
                                label={'Имя пользователя'}
                                name={'name'}
                            />


                        </Col>
                        <Col span={12}>
                            <FormInput
                                required={true}
                                required_text={'Требуется заполнение'}
                                label={'Телеграмма ID'}
                                name={'tgId'}
                            />

                        </Col>
                    </Row>
                    <Row gutter={20}>
                        <Col span={24}>
                            <Form.Item
                                label={'Выберите Роль'}
                                name={'role'}
                                rules={[{required: true, message: 'Пожалуйста, выберите роль'},]}>
                                <Select
                                    style={{
                                        width: '100%',
                                    }}
                                    onChange={changeRole}
                                    placeholder='Выберите одну модель'
                                    optionLabelProp='label'
                                    options={optionsRole}
                                />
                            </Form.Item>

                        </Col>
                    </Row>
                    {
                        isDrive &&
                    <Row gutter={20}>
                        <Col span={12}>
                            <Form.Item
                                label={'Выберите Область'}
                                name={'region'}
                                rules={[{required: true, message: 'Пожалуйста, выберите область'},]}>
                                <Select
                                    style={{
                                        width: '100%',
                                    }}
                                    onChange={changeRegion}
                                    placeholder='Выберите одну модель'
                                    optionLabelProp='label'
                                    options={optionsRegion}
                                />
                            </Form.Item>

                        </Col>
                        <Col span={12}>
                            <Form.Item
                                label={'Выберите дилеры'}
                                name={'dealer'}
                                rules={[{required: true, message: 'Пожалуйста, выберите дилеры'},]}>
                                <Select
                                    style={{
                                        width: '100%',
                                    }}
                                    placeholder='Выберите одну дилеры'
                                    optionLabelProp='label'
                                    options={optionsDealers}
                                />
                            </Form.Item>

                        </Col>
                    </Row>
                    }



                    <Button type="primary" htmlType="submit" style={{width: "100%", marginTop: "20px"}}>
                        {
                            editTgBotSuccess ? 'Edit' : 'Add'
                        }
                    </Button>
                </Form>
            }
        </div>
    );
};

export default TgBotIdPostEdit;