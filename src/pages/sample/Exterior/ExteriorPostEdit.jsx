import React, {useEffect, useMemo, useState} from 'react';
import {Button, Col, Form, Input, InputNumber, message, Row, Select, Upload} from "antd";
import {useMutation, useQuery} from "react-query";
import apiService from "../../../@crema/services/apis/api";
import {AppLoader} from "../../../@crema";
import {useNavigate} from "react-router-dom";
import {useDispatch, useSelector} from "react-redux";
import {EDIT_DATA} from "../../../shared/constants/ActionTypes";

import ImgCrop from "antd-img-crop";

const initialValueForm = {
    model: "",
    position: "",
    name: "",
    colorMediaId: "",
    mediaId: "",
    price: null,
    commentPrice: '',
};


const ExteriorPostEdit = () => {

    const [form] = Form.useForm();
    const navigate = useNavigate()
    const {editId} = useSelector(state => state.editData)
    const dispatch = useDispatch()


    const [fileListProps, setFileListProps] = useState([]);
    const [fileListProps2, setFileListProps2] = useState([]);
    const [deleteImage, setDeleteImage] = useState({});
    const [deleteImage2, setDeleteImage2] = useState({});
    const [valuesForm, setValues] = useState({});
    const [isNotEditImages, setIsNotEditImages] = useState(false);
    const [modelPosition, setModelPosition] = useState("");

// query-model
    const {data: modelData, refetch: modelFetch, } = useQuery(
        'get-model',
        () => apiService.getData('/product'),
        {
            enabled: false,
        },
    );
    // query-position-get
    const {data: positionData, refetch: positionFetch} = useQuery(
        'get-position',
        () => apiService.getData(`/position?model=${modelPosition}`,),
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


    // query-exterior
    const {
        mutate: postExteriorMutate,
        data: postExterior,
        isLoading: postExteriorLoading,
        isSuccess: postExteriorSuccess,

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
        isLoading: editExteriorLoading,
        data: editExteriorData,
        refetch: editExteriorRefetch,
        isSuccess: editExteriorSuccess,

    } = useQuery(["edit-postion", editId], () => apiService.getDataByID("/exterior", editId), {
        enabled: false
    });
    // put-query
    const {
        mutate: putExterior,
        isLoading: putExteriorLoading,
        data: putData,
        isSuccess: putExteriorSuccess
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

                message.error(error.message)
            }
        });

    const {mutate: imagesDeleteMutate} = useMutation(({url, ids}) => apiService.deleteImages(url, ids), {
            onSuccess: () => message.success('Success'),
            onError: (error) => message.error(error.message)
        }
    );
    // get postion
    useEffect(() => {
        if (modelPosition) {
            positionFetch()
        }
        const formModel=form.getFieldsValue()

        if (editExteriorData?.model!==formModel?.model){
            form.setFieldsValue({position:""})
        }
    }, [modelPosition])



    // exterior success
    useEffect(() => {
        let delImage = []
        if (putExteriorSuccess) {
            dispatch({type: EDIT_DATA, payload: ""})
        }
        if (editExteriorSuccess && deleteImage?.uid) {
            delImage.push(deleteImage?.uid)
        }
        if (editExteriorSuccess && deleteImage2?.uid) {
            delImage.push(deleteImage2?.uid)
        }
        if (editExteriorSuccess && (deleteImage?.uid || deleteImage2?.uid)) {
            const ids = {
                ids: delImage
            }
            imagesDeleteMutate({url: '/medias', ids});
        }


        if (postExteriorSuccess || putExteriorSuccess) {
            navigate('/exterior')
        }
    }, [postExterior, putData])

    // if edit postion
    useEffect(() => {
        if (editId !== "") {
            editExteriorRefetch();
        }
    }, [editId]);

    // if no edit postion
    useEffect(() => {
        if (editId === "") {
            form.setFieldsValue(initialValueForm)
        }
        setFileListProps([])
        modelFetch();
    }, []);



    //edit postion
    useEffect(() => {

        const imageInitialBanner = [
            {
                uid: editExteriorData?.image?._id,
                name: editExteriorData?.image?.name,
                status: 'done',
                url: `${process.env.REACT_APP_API_URL}/${editExteriorData?.image?.path}`,
            },
        ];
        const imageInitialColor = [
            {
                uid: editExteriorData?.colorImage?._id,
                name: editExteriorData?.colorImage?.name,
                status: 'done',
                url: `${process.env.REACT_APP_API_URL}/${editExteriorData?.colorImage?.path}`,
            },
        ];

        if (editExteriorSuccess) {

            const edit = {
                model: editExteriorData.model,
                position: editExteriorData.position,
                name: editExteriorData.name,
                price: editExteriorData.price===0 ? null : editExteriorData.price,
                commentPrice: editExteriorData.commentPrice,
                colorMediaId: imageInitialColor,
                mediaId: imageInitialBanner,
            }

            setModelPosition(editExteriorData.model)
            setFileListProps(imageInitialBanner);
            setFileListProps2(imageInitialColor);
            form.setFieldsValue(edit)
        }

    }, [editExteriorData])

    // post
    useEffect(() => {
        let image = ""
        let imageColor = ""
        if (editExteriorSuccess && imagesUploadSuccess && fileListProps[0]?.originFileObj?.uid) {
            image = imagesUpload[0]?._id;
        } else if (editExteriorSuccess) {
            image = fileListProps[0]?.uid;
        }
        if (editExteriorSuccess && imagesUploadSuccess && fileListProps2[0]?.originFileObj?.uid) {
            imageColor = imagesUpload.length === 2 ? imagesUpload[1]?._id : imagesUpload[0]?._id;
        } else if (editExteriorSuccess) {
            imageColor = fileListProps2[0]?.uid;
        }
        if (!editExteriorSuccess && imagesUpload) {
            image = imagesUpload[0]?._id
            imageColor = imagesUpload[1]?._id
        }

        const data = {
            model: valuesForm.model,
            position: valuesForm.position,
            name: valuesForm.name,
            price: (valuesForm.price===null || valuesForm.price==="") ?  0 : valuesForm.price,
            commentPrice: valuesForm.commentPrice,
            colorMediaId: imageColor,
            mediaId: image,
        };
        console.log('render')
        if (imagesUploadSuccess && !editExteriorSuccess) {
            postExteriorMutate({url: '/exterior', data});
        } else if (isNotEditImages || imagesUploadSuccess) {
            putExterior({url: '/exterior', data, id: editId});
        }
    }, [imagesUpload, valuesForm]);

    const onFinish = (values) => {

        const formData = new FormData();

        let uploadNewImage = false;

        if (editExteriorSuccess) {
            if (fileListProps[0]?.originFileObj?.uid && fileListProps2[0]?.originFileObj?.uid) {
                uploadNewImage = true;
                formData.append('media', fileListProps[0]?.originFileObj);
                formData.append('media', fileListProps2[0]?.originFileObj);

                setIsNotEditImages(false);
                // setFileList(fileListProps);
            } else if (fileListProps[0]?.originFileObj?.uid) {
                uploadNewImage = true;
                formData.append('media', fileListProps[0]?.originFileObj);

                setIsNotEditImages(false);
                // setFileList(fileListProps);
            } else if (fileListProps2[0]?.originFileObj?.uid) {
                uploadNewImage = true;
                formData.append('media', fileListProps2[0]?.originFileObj);

                setIsNotEditImages(false);
                // setFileList(fileListProps);
            } else {
                uploadNewImage = false;
                // setFileList(fileListProps);
                setIsNotEditImages(true);
            }
        } else {


            uploadNewImage = true;
            formData.append('media', fileListProps[0]?.originFileObj);
            formData.append('media', fileListProps2[0]?.originFileObj);
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
        return modelData?.map((option) => {
            return {
                value: option?.model,
                label: option?.model,
            };
        });
    }, [modelData]);

    const optionsPosition = useMemo(() => {
        return positionData?.map((option) => {
            return {
                value: option?.name,
                label: option?.name,
            };
        });
    }, [positionData]);

    const changeModel=(value)=>{
       setModelPosition(value)
    }

    // image
    const onChangeBanner = ({fileList: newFileList}) => {
        setFileListProps(newFileList);
        form.setFieldsValue({mediaId: newFileList});
    };
    const onChangeColorImage = ({fileList: newFileList}) => {
        setFileListProps2(newFileList);
        form.setFieldsValue({colorMediaId: newFileList});
    };
    const handleRemoveBanner = (file) => {
        if (editExteriorSuccess) {
            setDeleteImage(file);
        }
    };

    const handleRemoveColorImage = (file) => {
        if (editExteriorSuccess) {
            setDeleteImage2(file);
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
            {(postExteriorLoading || editExteriorLoading || putExteriorLoading || imagesUploadLoading) ?
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
                                    onChange={changeModel}
                                    placeholder='Выберите одну модель'
                                    optionLabelProp='label'
                                    options={options}
                                />
                            </Form.Item>

                        </Col>
                        <Col span={12}>
                            <Form.Item
                                label={'Выберите позиция'}
                                name={'position'}
                                rules={[
                                    {required: true, message: 'Пожалуйста, выберите свою позиция'},
                                ]}>
                                <Select
                                    style={{
                                        width: '100%',
                                    }}
                                    placeholder='Выберите одну позиция'
                                    optionLabelProp='label'
                                    options={optionsPosition}
                                />
                            </Form.Item>

                        </Col>


                    </Row>

                    <Row gutter={20}>
                        <Col span={24}>
                            <Form.Item
                                label="Экстерьер"
                                name="name"
                                rules={[
                                    {
                                        required: true,
                                        message: "Пожалуйста, введите Экстерьер"
                                    }
                                ]}
                            >
                                <Input/>
                            </Form.Item>

                        </Col>
                        <Col span={12}>
                            <Form.Item
                                label="Цена, (не требуется)"
                                name="price"
                            >
                                <InputNumber style={{width:'100%'}}/>
                            </Form.Item>

                        </Col>
                        <Col span={12}>
                            <Form.Item
                                label="Комментарий Цена, (не требуется)"
                                name="commentPrice"
                            >
                                <Input/>
                            </Form.Item>

                        </Col>

                    </Row>

                    <Row gutter={20}>
                        <Col span={12}>
                            <Form.Item
                                label='Изображение баннер'
                                name={'mediaId'}
                                rules={[{required: true, message: 'Требуется загрузка изображения баннер'}]}>
                                <ImgCrop>
                                    <Upload
                                        maxCount={1}
                                        fileList={fileListProps}
                                        listType='picture-card'
                                        onChange={onChangeBanner}
                                        onPreview={onPreview}
                                        beforeUpload={() => false}
                                        onRemove={handleRemoveBanner}>
                                        {fileListProps.length > 0 ? "" : "Upload"}
                                    </Upload>
                                </ImgCrop>
                            </Form.Item>
                        </Col>
                        <Col span={12}>
                            <Form.Item
                                label='Изображение цвет'
                                name={'colorMediaId'}
                                rules={[{required: true, message: 'Требуется загрузка изображения цвет'}]}>
                                <ImgCrop>
                                    <Upload
                                        maxCount={1}
                                        fileList={fileListProps2}
                                        listType='picture-card'
                                        onChange={onChangeColorImage}
                                        onPreview={onPreview}
                                        beforeUpload={() => false}
                                        onRemove={handleRemoveColorImage}>
                                        {fileListProps2.length > 0 ? "" : "Upload"}
                                    </Upload>
                                </ImgCrop>
                            </Form.Item>
                        </Col>
                    </Row>


                    <Button type="primary" htmlType="submit" style={{width: "100%", marginTop: "20px"}}>
                        {
                            editExteriorSuccess ? 'Edit' : 'Add'
                        }
                    </Button>
                </Form>
            }
        </div>
    );
};

export default ExteriorPostEdit;