import React, {useEffect, useMemo, useState} from 'react';
import {Button, Col, Form, Input, InputNumber, message, Row, Select, Space, Upload} from "antd";
import {useMutation, useQuery} from "react-query";
import apiService from "../../../@crema/services/apis/api";
import {AppLoader} from "../../../@crema";
import {useNavigate} from "react-router-dom";
import {useDispatch, useSelector} from "react-redux";
import {EDIT_DATA} from "../../../shared/constants/ActionTypes";

import {MinusCircleOutlined} from "@ant-design/icons";
import ImgCrop from "antd-img-crop";

const initialValueForm = {
    model: null,
    name: "",
    info: "",
    price: null,
    includedList: [""],
    mediaId: ""
};


const PositionPostEdit = () => {

    const [form] = Form.useForm();
    const navigate = useNavigate()
    const {editId} = useSelector(state => state.editData)
    const dispatch = useDispatch()


    const [fileListProps, setFileListProps] = useState([]);
    const [valuesForm, setValues] = useState({});
    const [isNotEditImages, setIsNotEditImages] = useState(false);
    const [deleteImage, setDeleteImage] = useState({});
    const [checkModel, setCheckModel] = useState("");

// query-model
    const {data: categoryData, refetch: categoryFetch} = useQuery(
        'get-model',
        () => apiService.getData('/product'),
        {
            enabled: false,
        },
    );

    // query-image
    const {
        mutate: imagesUploadMutate,
        data: imagesUpload,
        isLoading: imagesUploadLoading,
        isSuccess: imagesUploadSuccess,
    } = useMutation(({url, formData}) => apiService.postData(url, formData), {

        onError: (error) => message.error(error.message, 'Rasmning JPG,JPEG,PNG formatlariga ruxsat etilgan')
    });


    // query-postion
    const {
        mutate: postPositionMutate,
        data: postPosition,
        isLoading: postPositionLoading,
        isSuccess: postPositionSuccess,

    } = useMutation(({url, data}) => apiService.postData(url, data), {
        onSuccess: () => {

            message.success('Success')
        },
        onError: (error) => {
            message.error(error.message)
        }
    });

    // query-edit
    const {
        isLoading: editPositionLoading,
        data: editPositionData,
        refetch: editPositionRefetch,
        isSuccess: editPositionSuccess,

    } = useQuery(["edit-postion", editId], () => apiService.getDataByID("/position", editId), {
        enabled: false
    });
    // put-query
    const {
        mutate: putPosition,
        isLoading: putPositionLoading,
        data: putData,
        isSuccess: putPositionSuccess
    } = useMutation(({
                         url,
                         data,
                         id
                     }) => apiService.editData(url, data, id),
        {
            onSuccess: () => {

                message.success('Success')
            },
            onError: (error) => {

                message.error(error)
            }
        });

    const {mutate: imagesDeleteMutate} = useMutation(({url, ids}) => apiService.deleteImages(url, ids), {
            onSuccess: () => message.success('Success'),
            onError: (error) => message.error(error.message)
        }
    );
    // get postion
    const {
        data: positionDataImage,
        isSuccess: getPositionSuccess,
        refetch: getPositionRefetch,
    } = useQuery('position-get-by-model', () => apiService.getData(`/position?model=${checkModel}`), {

        enabled: false,
        onError: (error) => {

            message.error(error);
            // Handle the error
        },
    });

    // get image position
    useEffect(() => {
        if (getPositionSuccess && positionDataImage.length > 0) {
            const imageInitial = [
                {
                    uid: positionDataImage[0]?.image?._id,
                    name: positionDataImage[0]?.image?.name,
                    status: 'done',
                    url: `${process.env.REACT_APP_API_URL}/${positionDataImage[0]?.image?.path}`,
                },
            ];
            setFileListProps(imageInitial)
            form.setFieldsValue({mediaId: imageInitial});
        }else{
            setFileListProps([])
            form.setFieldsValue({mediaId: []});
        }

    }, [positionDataImage])
    useEffect(() => {
        if (checkModel) {
            getPositionRefetch()
        }
    }, [checkModel])


    // postion success
    useEffect(() => {
        let delImage = []
        if (putPositionSuccess) {
            dispatch({type: EDIT_DATA, payload: ""})
        }
        if (editPositionSuccess && deleteImage?.uid) {
            delImage.push(deleteImage?.uid)
        }
        if (editPositionSuccess && deleteImage?.uid) {
            const ids = {
                ids: delImage
            }
            imagesDeleteMutate({url: '/medias', ids});
        }


        if (postPositionSuccess || putPositionSuccess) {

            navigate('/position')
        }
    }, [postPosition, putData])

    // postion error
    // useEffect(() => {
    //     if (postPositionIsError) {
    //         message.error("error")
    //     }
    //     if (putPositionIsError) {
    //         message.error(putPositionError.message)
    //     }
    // }, [postPositionError, putPositionError])


    // if edit postion
    useEffect(() => {
        if (editId !== "") {
            editPositionRefetch();
        }
    }, [editId]);

    // if no edit postion
    useEffect(() => {
        if (editId === "") {
            form.setFieldsValue(initialValueForm)
        }
        setFileListProps([])
        categoryFetch();
    }, []);


    //edit postion
    useEffect(() => {

        const imageInitial = [
            {
                uid: editPositionData?.image?._id,
                name: editPositionData?.image?.name,
                status: 'done',
                url: `${process.env.REACT_APP_API_URL}/${editPositionData?.image?.path}`,
            },
        ];

        if (editPositionSuccess) {

            const edit = {
                model: editPositionData.model,
                name: editPositionData.name,
                info: editPositionData.info,
                price: editPositionData.price,
                includedList: editPositionData.includedList,
                mediaId: imageInitial,
            }


            setFileListProps(imageInitial);
            form.setFieldsValue(edit)
        }

    }, [editPositionData])

    // post
    useEffect(() => {
        let image = ""
        if (editPositionSuccess && imagesUploadSuccess && fileListProps[0]?.originFileObj?.uid) {
            image = imagesUpload[0]?._id;
        } else if (editPositionSuccess||(checkModel && positionDataImage.length > 0)) {
            image = fileListProps[0]?.uid;
        }

        if (!editPositionSuccess && imagesUpload) {
            image = imagesUpload[0]?._id
        }

        const data = {
            model: valuesForm.model,
            name: valuesForm.name,
            info: valuesForm.info,
            price: valuesForm.price,
            includedList: valuesForm.includedList,
            mediaId: image,
        };
        if (imagesUploadSuccess && !editPositionSuccess) {
            postPositionMutate({url: '/position', data});
        } else if (isNotEditImages || imagesUploadSuccess) {
            putPosition({url: '/position', data, id: editId});
        }else if (!imagesUploadSuccess && !editPositionSuccess && checkModel && positionDataImage.length > 0) {
            postPositionMutate({url: '/position', data});
        }
    }, [imagesUpload, valuesForm]);

    const onFinish = (values) => {

        const formData = new FormData();

        let uploadNewImage = false;

        if (editPositionSuccess) {
            if (fileListProps[0]?.originFileObj?.uid) {
                uploadNewImage = true;
                formData.append('media', fileListProps[0]?.originFileObj);

                setIsNotEditImages(false);
                // setFileList(fileListProps);
            } else {
                uploadNewImage = false;
                // setFileList(fileListProps);
                setIsNotEditImages(true);
            }
        } else {
            if (checkModel&& positionDataImage.length > 0){
                uploadNewImage = false;
                // setFileList(fileListProps);
                setIsNotEditImages(false);
            }else{

            uploadNewImage = true;
            formData.append('media', fileListProps[0]?.originFileObj);
            }
        }
        if (uploadNewImage && !imagesUploadSuccess) {
            imagesUploadMutate({url: '/medias', formData});
        }

        setValues(values);
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
    const options = useMemo(() => {
        return categoryData?.map((option) => {
            return {
                value: option?.model,
                label: option?.model,
            };
        });
    }, [categoryData]);
    const onChangeModel = (value) => {
        setCheckModel(value)
    }

    // image
    const onChange = ({fileList: newFileList}) => {
        setFileListProps(newFileList);
        form.setFieldsValue({mediaId: newFileList});
    };
    const handleRemove = (file) => {
        setCheckModel("")
        if (editPositionSuccess) {
            setDeleteImage(file);
        }
    };

    const onPreview = async (file) => {
        let src = file.url;
        if (!src) {
            src = await new Promise((resolve) => {
                const reader = new FileReader();
                reader.readAsDataURL(file.originFileObj);
                reader.onload = () => resolve(reader.result);
            });
        }
        const image = new Image();
        image.src = src;
        const imgWindow = window.open(src);
        imgWindow?.document.write(image.outerHTML);
    };


    return (
        <div>
            {(postPositionLoading || editPositionLoading || putPositionLoading || imagesUploadLoading) ?
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
                                label={'Выберите модель'}
                                name={'model'}
                                rules={[
                                    {required: true, message: 'Пожалуйста, выберите свою модель'},
                                ]}>
                                <Select
                                    style={{
                                        width: '100%',
                                    }}
                                    onChange={onChangeModel}
                                    placeholder='Выберите одну модель'
                                    optionLabelProp='label'
                                    options={options}
                                />
                            </Form.Item>

                        </Col>
                        <Col span={12}>
                            <Form.Item
                                label="Позиция"
                                name="name"
                                rules={[
                                    {
                                        required: true,
                                        message: "Пожалуйста, введите позицию"
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
                                label="Предупреждение, (не требуется)"
                                name="info"
                            >
                                <Input/>
                            </Form.Item>

                        </Col>
                        <Col span={12}>
                            <Form.Item
                                label="Цена"
                                name="price"
                                rules={[
                                    {
                                        required: true,
                                        message: "Вы должны ввести цену"
                                    }
                                ]}
                            >
                                <InputNumber style={{width: '100%'}}/>
                            </Form.Item>

                        </Col>
                    </Row>

                    <Form.List name="includedList">
                        {(fields, {add, remove}) => (
                            <>
                                {fields.map((field, index) => {

                                    return (
                                        <div key={field.fieldKey} style={{marginBottom: 20}}>
                                            <Space align={"start"}>


                                                <Form.Item
                                                    label={`Каковы преимущества этой позиции? ${index + 1}`}
                                                    name={[field.name]}
                                                    rules={[
                                                        {required: true, message: "Требуется строка"}
                                                    ]}
                                                    style={{width: "100%"}}
                                                >
                                                    <Input/>
                                                </Form.Item>
                                                <MinusCircleOutlined
                                                    onClick={() => remove(field.name)}/>
                                            </Space>

                                        </div>

                                    );
                                })}
                                <Form.Item>
                                    <Button type="dashed" onClick={() => add()} block>
                                        Add Item
                                    </Button>
                                </Form.Item>

                            </>
                        )}
                    </Form.List>
                    <Form.Item
                        label='Изображение логотипа'
                        name={'mediaId'}
                        rules={[{required: true, message: 'Требуется загрузка изображения баннер'}]}>
                        <ImgCrop>
                            <Upload
                                maxCount={1}
                                fileList={fileListProps}
                                listType='picture-card'
                                onChange={onChange}
                                onPreview={onPreview}
                                beforeUpload={() => false}
                                onRemove={handleRemove}>
                                {fileListProps.length > 0 ? "" : "Upload"}
                            </Upload>
                        </ImgCrop>
                    </Form.Item>


                    <Button type="primary" htmlType="submit" style={{width: "100%", marginTop: "20px"}}>
                        {
                            editPositionSuccess ? 'Edit' : 'Add'
                        }
                    </Button>
                </Form>
            }
        </div>
    );
};

export default PositionPostEdit;