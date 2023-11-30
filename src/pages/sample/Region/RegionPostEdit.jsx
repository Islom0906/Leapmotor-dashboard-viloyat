import React, {useEffect} from 'react';
import {Button, Col, Form, message, Row} from "antd";
import {useMutation, useQuery} from "react-query";
import apiService from "../../../@crema/services/apis/api";
import {AppLoader} from "../../../@crema";
import {useNavigate} from "react-router-dom";
import {useDispatch, useSelector} from "react-redux";
import {EDIT_DATA} from "../../../shared/constants/ActionTypes";
import FormInput from "../../../@crema/core/Form/FormInput";
import {MinusCircleOutlined} from "@ant-design/icons";

const initialValueForm = {
    nameUz: "",
    nameRu: "",
    dealers: [
        {
            nameUz: "",
            nameRu: ""
        }
    ]
};




const RegionPostEdit = () => {

    const [form] = Form.useForm();
    const navigate = useNavigate()
    const {editId} = useSelector(state => state.editData)
    const dispatch = useDispatch()




    // query-region
    const {
        mutate: postRegionMutate,
        data: postRegion,
        isLoading: postRegionLoading,
        isSuccess: postRegionSuccess,
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
        isLoading: editRegionLoading,
        data: editRegionData,
        refetch: editRegionRefetch,
        isSuccess: editRegionSuccess,
    } = useQuery(["edit-region", editId], () => apiService.getDataByID("/region", editId), {
        enabled: false
    });
    // put-query
    const {
        mutate: putRegion,
        isLoading: putRegionLoading,
        data: putData,
        isSuccess: putRegionSuccess
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

    // region success
    useEffect(() => {
        if (putRegionSuccess) {
            dispatch({type: EDIT_DATA, payload: ""})
        }

        if (postRegionSuccess || putRegionSuccess) {

            navigate('/region')
        }
    }, [postRegion, putData])


    // if edit region
    useEffect(() => {
        if (editId !== "") {
            editRegionRefetch();
        }
    }, [editId]);

    // if no edit region
    useEffect(() => {
        if (editId === "") {
            form.setFieldsValue(initialValueForm)
        }
    }, []);


    //edit region
    useEffect(() => {
const dealers=[]

        editRegionData?.dealers.map(dealer=>{
            const data={
                nameUz: dealer.nameUz,
                nameRu: dealer.nameRu
            }
            dealers.push(data)
        })

        if (editRegionSuccess) {

            const edit = {
                nameUz: editRegionData.nameUz,
                nameRu: editRegionData.nameRu,
                dealers
            }

            form.setFieldsValue(edit)
        }

    }, [editRegionData])


    const onFinish = (values) => {



        if (editRegionData) {
            putRegion({url: '/region', data: values, id: editId})
        } else {
            postRegionMutate({url: "/region/", data: values});
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






    return (
        <div>
            {(postRegionLoading || editRegionLoading || putRegionLoading) ?
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
                                required_text={'To\'ldirish talab qilinadi'}
                                label={'Viloyat nomi Uz'}
                                name={'nameUz'}
                            />


                        </Col>
                        <Col span={12}>
                            <FormInput
                                required={true}
                                required_text={'Требуется заполнение'}
                                label={'Провинция Ru'}
                                name={'nameRu'}
                            />

                        </Col>
                    </Row>
                    <Form.List name="dealers">
                        {(fields, {add, remove}) => (
                            <>
                                {fields.map((field, index) => {
                                    return (
                                        <div key={field.fieldKey} style={{marginBottom: 20}}>
                                            <Row gutter={20}>

                                                <Col span={11} offset={1}>
                                                    <FormInput
                                                        required={true}
                                                        required_text={'To\'ldirish talab qilinadi'}
                                                        label={`Dealerni nomini kiriting Uz ${index + 1}`}
                                                        name={[field.name, 'nameUz']}
                                                    />
                                                </Col>
                                                <Col span={11}>
                                                    <FormInput
                                                        required={true}
                                                        required_text={'Требуется заполнение'}
                                                        label={`Введите имя дилера Ru ${index + 1}`}
                                                        name={[field.name, 'nameRu']}
                                                    />
                                                </Col>
                                            </Row>
                                            <MinusCircleOutlined
                                                onClick={() => remove(field.name)}/>
                                        </div>

                                    );
                                })}
                                <Form.Item>
                                    <Button type="primary" onClick={() => add()} block
                                            style={{backgroundColor: '#28a745'}}>
                                        Добавить нового дилера
                                    </Button>
                                </Form.Item>

                            </>

                        )}
                    </Form.List>

                    <Button type="primary" htmlType="submit" style={{width: "100%", marginTop: "20px"}}>
                        {
                            editRegionSuccess ? 'Edit' : 'Add'
                        }
                    </Button>
                </Form>
            }
        </div>
    );
};

export default RegionPostEdit;