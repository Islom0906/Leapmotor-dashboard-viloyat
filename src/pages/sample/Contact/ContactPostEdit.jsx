import React, {useEffect} from 'react';
import {Button, Col, Form, Input, message, Row} from "antd";
import {useMutation, useQuery} from "react-query";
import apiService from "../../../@crema/services/apis/api";
import {AppLoader} from "../../../@crema";
import {useNavigate} from "react-router-dom";
import {useDispatch, useSelector} from "react-redux";
import {EDIT_DATA} from "../../../shared/constants/ActionTypes";

const initialValueForm = {
    tel:"",
    facebook:"",
    twitter:"",
    instagram:""
};



const ContactPostEdit = () => {

    const [form] = Form.useForm();
    const navigate = useNavigate()
    const {editId}=useSelector(state => state.editData)
    const dispatch=useDispatch()

    // query-contact
    const {
        mutate: postContactMutate,
        data: postContact,
        isLoading: postContactLoading,
        isSuccess: postContactSuccess,
        error: postContactError,
        isError: postContactIsError
    } = useMutation(({url, data}) => apiService.postData(url, data),{
        onSuccess:()=>{

            message.success('Success')
        },
        onError:(error)=>{

            message.error(error)
        }
    });

    // query-edit
    const {
        isLoading: editContactLoading,
        data: editContactData,
        refetch: editContactRefetch,
        isSuccess: editContactSuccess,
        error:putContactError,
        isError:putContactIsError
    } = useQuery(["edit-contact"], () => apiService.getData("/contact"), {
        enabled: false
    });
    // put-query
    const {
        mutate: putContact,
        isLoading: putContactLoading,
        data: putData,
        isSuccess: putContactSuccess
    } = useMutation(({
                         url,
                         data,
                         id
                     }) => apiService.editData(url, data, id));
    // contact success
    useEffect(() => {
        if (putContactSuccess) {
            dispatch({type:EDIT_DATA,payload:""})
        }

        if (postContactSuccess || putContactSuccess) {

            navigate('/contact')
        }
    }, [postContact,putData])

    // contact error
    useEffect(() => {
        if (postContactIsError) {
            message.error(postContactError.message)
        }
        if (putContactIsError) {
            message.error(putContactError.message)
        }
    }, [postContactError,putContactError])



    // if edit contact
    useEffect(() => {
        if (editId !== "") {
            editContactRefetch();
        }
    }, [editId]);

    // if no edit contact
    useEffect(() => {
        if (editId===""){
            form.setFieldsValue(initialValueForm)
        }
    }, []);




    //edit contact
    useEffect(()=>{
        if (editContactSuccess){

        const edit={
            tel:editContactData.tel,
            facebook:editContactData.facebook,
            twitter:editContactData.twitter,
            instagram:editContactData.instagram,

        }
            form.setFieldsValue(edit)
        }

    },[editContactData])



    const onFinish = (values) => {



        if (editContactSuccess){
            putContact({url: '/contact',id:editId,data:values})
        }else{
            postContactMutate({url: "/contact", data:values});
        }

    }
    const onFinishFailed = (errorInfo) => {
        console.log("Failed:", errorInfo);
    };


    // refresh page again get data

  useEffect(() => {
    const storedValues = JSON.parse(localStorage.getItem('myFormValues'));
    if (storedValues) {
        storedValues.images=[]
      form.setFieldsValue(storedValues);
    }

    const handleBeforeUnload = () => {
        
            localStorage.setItem(
              'myFormValues',
              JSON.stringify(form.getFieldsValue()),
            );
    };

    window.addEventListener('beforeunload', handleBeforeUnload);

    return ()=>{
        localStorage.removeItem('editDataId')
        localStorage.removeItem('myFormValues')
        window.removeEventListener('beforeunload', handleBeforeUnload);
    }
  }, []);


    // Contact


    return (
        <div>
            {( postContactLoading ||editContactLoading ||putContactLoading) ?
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
                            <Form.Item
                                label="Номер телефона"
                                name="tel"
                                rules={[
                                    {
                                        required: true,
                                        message: "Ввод номера телефона обязателен"
                                    }
                                ]}
                            >
                                <Input/>
                            </Form.Item>

                        </Col>
                        <Col span={12}>
                            <Form.Item
                                label="Facebook"
                                name="facebook"
                                rules={[
                                    {
                                        required: true,
                                        message: "Ссылка на Facebook обязательна"
                                    }
                                ]}
                            >
                                <Input/>
                            </Form.Item>

                        </Col>

                    </Row>

                    <Row gutter={20}>
                        <Col span={12}>
                            <Form.Item
                                label="Telegram"
                                name="twitter"
                                rules={[
                                    {
                                        required: true,
                                        message: "Обязательно ввести ссылку на Telegram"
                                    }
                                ]}
                            >
                                <Input/>
                            </Form.Item>

                        </Col>
                        <Col span={12}>
                            <Form.Item
                                label="Instagram"
                                name="instagram"
                                rules={[
                                    {
                                        required: true,
                                        message: "Ссылка на Инстаграм обязательна"
                                    }
                                ]}
                            >
                                <Input/>
                            </Form.Item>

                        </Col>
                    </Row>





                        <Button type="primary" htmlType="submit" style={{width: "100%",marginTop:"20px"}}>
                    {
                            editContactSuccess ? 'Edit' : 'Add'
                        }
                    </Button>
                </Form>
            }
        </div>
    );
};

export default ContactPostEdit;