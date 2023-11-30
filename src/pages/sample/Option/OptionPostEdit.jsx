import React, {useEffect, useMemo, useState} from 'react';
import {Button, Col, Form, Input, InputNumber, message, Row, Select, Upload} from "antd";
import {useMutation, useQuery} from "react-query";
import apiService from "../../../@crema/services/apis/api";
import {AppLoader} from "../../../@crema";
import {useNavigate} from "react-router-dom";
import {useDispatch, useSelector} from "react-redux";
import {EDIT_DATA} from "../../../shared/constants/ActionTypes";

import ImgCrop from "antd-img-crop";
import {MinusCircleOutlined} from "@ant-design/icons";

const initialValueForm = {
    model: "",
    position: "",
    exterior: "",
    interior: "",
    name: "",
    price: null,
    bonus: "",
    includeComment: "",
    mainMediaId: "",
    bannerMediaId: "",
    includes: []
};


const OptionPostEdit = () => {

    const [form] = Form.useForm();
    const navigate = useNavigate()
    const {editId} = useSelector(state => state.editData)
    const dispatch = useDispatch()


    const [fileListPropsMain, setFileListPropsMain] = useState([]);
    const [fileListPropsBanner, setFileListPropsBanner] = useState([]);
    const [fileListPropsIncludes, setFileListPropsInludes] = useState([]);
    const [modelPosition, setModelPosition] = useState("");
    const [modelExterior, setModelExterior] = useState("");
    const [modelInterior, setModelInterior] = useState("");
    const [isUpload, setIsUpload] = useState('');
    const [mainIndex, setMainIndex] = useState(0);
// query-model
    const {data: modelData, refetch: modelFetch} = useQuery('get-model', () => apiService.getData('/product'), {
        enabled: false,
    },);
    // query-position-get
    const {
        data: positionData,
        refetch: positionFetch
    } = useQuery('get-position', () => apiService.getData(`/position?model=${modelPosition}`), {
        enabled: false,
    },);
    // query-exterior-get
    const {
        data: exteriorData,
        refetch: exteriorFetch
    } = useQuery('get-exterior', () => apiService.getData(`/exterior?model=${modelPosition}&position=${modelExterior}`), {
        enabled: false,
    },);
    // query-interior-get
    const {
        data: interiorData,
        refetch: interiorFetch
    } = useQuery('get-interior', () => apiService.getData(`/interior?model=${modelPosition}&position=${modelExterior}&exterior=${modelInterior}`), {
        enabled: false,
    },);

    // query-image
    const {
        mutate: imagesUploadMutate, data: imagesUpload, isLoading: imagesUploadLoading, isSuccess: imagesUploadSuccess,
    } = useMutation(({url, formData}) => apiService.postData(url, formData), {

        onError: (error) => message.error(error.message, 'Rasmning JPG,JPEG,PNG formatlariga ruxsat etilgan')
    });


    // query-exterior
    const {
        mutate: postExteriorMutate, data: postExterior, isLoading: postExteriorLoading, isSuccess: postExteriorSuccess,

    } = useMutation(({url, data}) => apiService.postData(url, data), {
        onSuccess: () => {
            message.success('Success')
        }, onError: (error) => {
            message.error(error.message)
        }
    });

    // query-edit
    const {
        isLoading: editExteriorLoading,
        data: editExteriorData,
        refetch: editExteriorRefetch,
        isSuccess: editExteriorSuccess,

    } = useQuery(["edit-option", editId], () => apiService.getDataByID("/option", editId), {
        enabled: false
    });
    // put-query
    const {
        mutate: putExterior, isLoading: putExteriorLoading, data: putData, isSuccess: putExteriorSuccess
    } = useMutation(({
                         url, data, id
                     }) => apiService.editData(url, data, id), {
        onSuccess: () => {

            message.success('Success')
        }, onError: (error) => {

            message.error(error)
        }
    });

    // delete image

    const {mutate: imagesDeleteMutate} = useMutation(({url, ids}) => apiService.deleteImages(url, ids), {
        onSuccess: () => message.success('Success'), onError: (error) => message.error(error.message)
    });

    //                                              =====useEffect====
    // get postion
    useEffect(() => {
        if (modelPosition) {
            positionFetch()
        }
        const formModel = form.getFieldsValue()
        if (editExteriorData?.model !== formModel?.model) {
            form.setFieldsValue({position: ""})
            form.setFieldsValue({exterior: ""})
            form.setFieldsValue({interior: ""})
        }

    }, [modelPosition])

    // get exterior
    useEffect(() => {
        if (modelExterior) {
            exteriorFetch()
        }
        const formModel = form.getFieldsValue()
        if (editExteriorData?.position !== formModel?.position) {
            form.setFieldsValue({exterior: ""})
            form.setFieldsValue({interior: ""})
        }
    }, [modelExterior])
// get interior
    useEffect(() => {
        if (modelInterior) {
            interiorFetch()
        }
        const formModel = form.getFieldsValue()
        if (editExteriorData?.exterior !== formModel?.exterior) {
            form.setFieldsValue({interior: ""})
        }
    }, [modelInterior])

    // exterior success
    useEffect(() => {
        if (putExteriorSuccess) {
            dispatch({type: EDIT_DATA, payload: ""})
        }
        if (postExteriorSuccess || putExteriorSuccess) {
            navigate('/option')
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
        modelFetch();
    }, []);


    //edit postion
    useEffect(() => {
        const initialIncludes = [];
        const initialFileListPropsIncludes = [];

        if (editExteriorData !== undefined) {
            for (let i = 0; i < editExteriorData.includes.length; i++) {
                let editDefaultImages = []

                if (editExteriorData.includes[i]?.image?.name !== "null") {
                    editDefaultImages = [{
                        uid: editExteriorData.includes[i]?.image?._id,
                        name: editExteriorData.includes[i]?.image?.name,
                        status: "done",
                        url: `${process.env.REACT_APP_API_URL}/${editExteriorData.includes[i]?.image?.path}`
                    }];
                }
                const joinTags = editExteriorData.includes[i].tags.join(',')
                const item = {
                    title: editExteriorData.includes[i].title,
                    comment: editExteriorData.includes[i].comment,
                    tags: joinTags,
                    mediaId: editDefaultImages
                };
                initialIncludes.push(item);
                initialFileListPropsIncludes.push(editDefaultImages)
            }
        }

        const imageInitialBanner = [{
            uid: editExteriorData?.bannerImage?._id,
            name: editExteriorData?.bannerImage?.name,
            status: 'done',
            url: `${process.env.REACT_APP_API_URL}/${editExteriorData?.bannerImage?.path}`,
        },];
        const imageInitialMain = [{
            uid: editExteriorData?.mainImage?._id,
            name: editExteriorData?.mainImage?.name,
            status: 'done',
            url: `${process.env.REACT_APP_API_URL}/${editExteriorData?.mainImage?.path}`,
        },];

        if (editExteriorSuccess) {

            const edit = {
                model: editExteriorData.model,
                position: editExteriorData.position,
                exterior: editExteriorData.exterior,
                interior: editExteriorData.interior,
                name: editExteriorData.name,
                bonus: "",
                includeComment: editExteriorData.includeComment,
                price: editExteriorData.price === 0 ? null : editExteriorData.price,
                mainMediaId: imageInitialMain,
                bannerMediaId: imageInitialBanner,
                includes: initialIncludes
            }
            setModelPosition(editExteriorData.model)
            setModelExterior(editExteriorData.position)
            setModelInterior(editExteriorData.exterior)

            setFileListPropsBanner(imageInitialBanner);
            setFileListPropsMain(imageInitialMain);
            setFileListPropsInludes(initialFileListPropsIncludes)
            form.setFieldsValue(edit)
        }

    }, [editExteriorData])
    const onFinish = (values) => {


        const includes = []

        for (let i = 0; i < values.includes.length; i++) {
            let isImage = ""
            let splitTags;
            if (fileListPropsIncludes.length > 0) {
                if (fileListPropsIncludes[i] === null || fileListPropsIncludes[i]?.length < 1) {
                    isImage = ""
                } else {
                    isImage = fileListPropsIncludes[i][0]?.uid
                }
            }
            if (values.includes[i].tags) {
                splitTags = values.includes[i].tags.split(',')
            }
            const item = {
                title: values.includes[i].title || "",
                comment: values.includes[i].comment || "",
                tags: splitTags || [],
                mediaId: isImage
            };
            includes.push(item);
        }


        const data = {
            model: values.model,
            position: values.position,
            exterior: values.exterior,
            interior: values.interior,
            name: values.name,
            bonus: "",
            includeComment: values.includeComment,
            price: (values.price === null || values.price === "") ? 0 : values.price,
            bannerMediaId: fileListPropsBanner[0]?.uid,
            mainMediaId: fileListPropsMain[0]?.uid,
            includes
        };
        if (editExteriorSuccess) {
            putExterior({url: "/option", data, id: editId});
        } else {
            postExteriorMutate({url: "/option", data});
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

            localStorage.setItem('myFormValues', JSON.stringify(form.getFieldsValue()),);
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
                value: option?.model, label: option?.model,
            };
        });
    }, [modelData]);

    const optionsPosition = useMemo(() => {
        return positionData?.map((option) => {
            return {
                value: option?.name, label: option?.name,
            };
        });
    }, [positionData]);
    const optionsExterior = useMemo(() => {
        return exteriorData?.map((option) => {
            return {
                value: option?.name, label: option?.name,
            };
        });
    }, [exteriorData]);

    const optionsInterior = useMemo(() => {
        return interiorData?.map((option) => {
            return {
                value: option?.name, label: option?.name,
            };
        });
    }, [interiorData]);

    const changeModel = (value) => {
        setModelPosition(value)
    }
    const changePosition = (value) => {
        setModelExterior(value)
    }

    const changeExterior = (value) => {
        setModelInterior(value)
    }

    // image

    useEffect(() => {
        // MAIN
        if (imagesUploadSuccess && isUpload === "main") {
            const uploadImg = [{
                uid: imagesUpload[0]?._id,
                name: imagesUpload[0]?.name,
                status: "done",
                url: `${process.env.REACT_APP_API_URL}/${imagesUpload[0]?.path}`
            }]

            setFileListPropsMain(uploadImg);
            setIsUpload('')
        }

        // BANNER
        if (imagesUploadSuccess && isUpload === 'banner') {
            const uploadImg = [{
                uid: imagesUpload[0]?._id,
                name: imagesUpload[0]?.name,
                status: "done",
                url: `${process.env.REACT_APP_API_URL}/${imagesUpload[0]?.path}`
            }]
            setFileListPropsBanner(uploadImg);
            setIsUpload('')
        }
        // INCLUDES
        const uploadFilesStateIncludes = [...fileListPropsIncludes];
        if (imagesUploadSuccess && isUpload === 'includes') {
            const uploadImg = [{
                uid: imagesUpload[0]?._id,
                name: imagesUpload[0]?.name,
                status: "done",
                url: `${process.env.REACT_APP_API_URL}/${imagesUpload[0]?.path}`
            }]
            uploadFilesStateIncludes[mainIndex] = uploadImg;
            setFileListPropsInludes(uploadFilesStateIncludes);
            const getValue = form.getFieldsValue();
            const itemsValue = getValue?.includes;
            if (!itemsValue[mainIndex]){
                itemsValue[mainIndex]={
                    mediaId:"",
                    tags:"",
                    title:"",
                    comment:""
                }
            }
            itemsValue[mainIndex].mediaId = uploadImg;
            form.setFieldsValue({items: itemsValue});
            setIsUpload('')
        }

    }, [imagesUpload]);
    const onChangeBanner = ({fileList: newFileList}) => {
        form.setFieldsValue({bannerMediaId: newFileList});
        if (fileListPropsBanner.length !== 0 || newFileList.length === 0) {
            let id=[fileListPropsBanner[0]?.uid]

            const ids={
                ids:id
            }
            imagesDeleteMutate({url: "/medias", ids});
            setFileListPropsBanner([])
        }
        const formData = new FormData();

        if (newFileList.length !== 0) {
            formData.append("media", newFileList[0].originFileObj);
            imagesUploadMutate({url: "/medias", formData});
            setIsUpload('banner')
        }

    };
    const onChangeMainImage = ({fileList: newFileList}) => {

        form.setFieldsValue({mainMediaId: newFileList});
        if (fileListPropsMain.length !== 0 || newFileList.length === 0) {
            const id = [fileListPropsMain[0]?.uid];
            const ids={
                ids:id
            }
            imagesDeleteMutate({url: "/medias", ids});
            setFileListPropsMain([])
        }
        const formData = new FormData();

        if (newFileList.length !== 0) {
            formData.append("media", newFileList[0].originFileObj);
            imagesUploadMutate({url: "/medias", formData});
            setIsUpload('main')
        }
    };

    const onChangeIncludesImage = (index, {fileList: newFileList}) => {
        setMainIndex(index);


        if (fileListPropsIncludes[index] || newFileList.length === 0) {
            const id = [fileListPropsIncludes[index][0].uid];
            const ids={
                ids:id
            }
            imagesDeleteMutate({url: "/medias", ids});
            fileListPropsIncludes[index] = null;
            setFileListPropsInludes(fileListPropsIncludes);

        }
        const formData = new FormData();
        if (newFileList.length !== 0) {
            formData.append("media", newFileList[0].originFileObj);
            imagesUploadMutate({url: "/medias", formData});
            setIsUpload('includes')

        }
    };


    // handleRemoveIncludes
    const handleRemoveIncludes = (name, remove, index, editorFileList) => {
        console.log(index)
            console.log(editorFileList)
            console.log(fileListPropsIncludes)
        if (editorFileList === fileListPropsIncludes[index] && fileListPropsIncludes.length > 0) {
            const id = [fileListPropsIncludes[index][0]?.uid];
            fileListPropsIncludes.splice(index, 1);
            const ids={
                ids:id
            }
            imagesDeleteMutate({url: "/medias", ids});
        }
        remove(name);
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


    const addFormList=(add)=>{
        let itemsValue=[];
        add()
        const getValue = form.getFieldsValue();
        if (!getValue?.includes[0]){
        itemsValue.push({
            mediaId:"",
            title:"",
            comment:"",
            tags:""
        })
        }
        form.setFieldsValue({items: itemsValue});
    }

    return (<div>
        {(postExteriorLoading || editExteriorLoading || putExteriorLoading || imagesUploadLoading) ? <AppLoader/> :
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
                            rules={[{required: true, message: 'Пожалуйста, выберите свою модель'},]}>
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
                            rules={[{required: true, message: 'Пожалуйста, выберите свою позиция'},]}>
                            <Select
                                style={{
                                    width: '100%',
                                }}
                                onChange={changePosition}
                                placeholder='Выберите одну позиция'
                                optionLabelProp='label'
                                options={optionsPosition}
                            />
                        </Form.Item>

                    </Col>


                </Row>

                <Row gutter={20}>
                    <Col span={12}>
                        <Form.Item
                            label={'Выберите Экстерьер'}
                            name={'exterior'}
                            rules={[{required: true, message: 'Пожалуйста, выберите свой экстерьер'},]}>
                            <Select
                                style={{
                                    width: '100%',
                                }}
                                placeholder='Выберите одну экстерьер'
                                optionLabelProp='label'
                                onChange={changeExterior}
                                options={optionsExterior}
                            />
                        </Form.Item>

                    </Col>
                    <Col span={12}>
                        <Form.Item
                            label={'Выберите Интерьер'}
                            name={'interior'}
                            rules={[{required: true, message: 'Пожалуйста, выберите свой Интерьер'},]}>
                            <Select
                                style={{
                                    width: '100%',
                                }}
                                placeholder='Выберите одну Интерьер'
                                optionLabelProp='label'
                                options={optionsInterior}
                            />
                        </Form.Item>

                    </Col>
                    <Col span={12}>
                        <Form.Item
                            label="Выберите Вариант"
                            name="name"
                            rules={[{
                                required: true, message: "Пожалуйста, введите Вариант"
                            }]}
                        >
                            <Input/>
                        </Form.Item>

                    </Col>
                    <Col span={12}>
                        <Form.Item
                            label="Цена, (не требуется)"
                            name="price"
                        >
                            <InputNumber style={{width: '100%'}}/>
                        </Form.Item>

                    </Col>
                </Row>

                <Row gutter={20}>
                    {/*<Col span={12}>*/}
                    {/*    <Form.Item*/}
                    {/*        label="Бонус, (не требуется)"*/}
                    {/*        name="bonus"*/}
                    {/*    >*/}
                    {/*        <Input/>*/}
                    {/*    </Form.Item>*/}

                    {/*</Col>*/}
                    <Col span={24}>
                        <Form.Item
                            label="Включить комментарий, (не требуется)"
                            name="includeComment"
                        >
                            <Input/>
                        </Form.Item>

                    </Col>
                </Row>

                <Row gutter={20}>
                    <Col span={12}>
                        <Form.Item
                            label='Изображение баннер'
                            name={'bannerMediaId'}
                            rules={[{required: true, message: 'Требуется загрузка изображения баннер'}]}>
                            <ImgCrop>
                                <Upload
                                    maxCount={1}
                                    fileList={fileListPropsBanner}
                                    listType='picture-card'
                                    onChange={onChangeBanner}
                                    onPreview={onPreview}
                                    beforeUpload={() => false}
                                >
                                    {fileListPropsBanner.length > 0 ? "" : "Upload"}
                                </Upload>
                            </ImgCrop>
                        </Form.Item>
                    </Col>
                    <Col span={12}>
                        <Form.Item
                            label='Изображение основной'
                            name={'mainMediaId'}
                            rules={[{required: true, message: 'Требуется загрузка изображения основной'}]}>
                            <ImgCrop>
                                <Upload
                                    maxCount={1}
                                    fileList={fileListPropsMain}
                                    listType='picture-card'
                                    onChange={onChangeMainImage}
                                    onPreview={onPreview}
                                    beforeUpload={() => false}
                                >
                                    {fileListPropsMain.length > 0 ? "" : "Upload"}
                                </Upload>
                            </ImgCrop>
                        </Form.Item>
                    </Col>
                </Row>
                <Form.List name="includes">
                    {(fields, {add, remove}) => (
                        <>
                            {fields.map((field, index) => {
                                const editorFileList = fileListPropsIncludes[index] || [];
                                return (
                                    <div key={field.fieldKey} style={{marginBottom: 20}}>
                                        <Row gutter={20}>
                                            <Col span={12}>
                                                <Form.Item
                                                    label='Заголовок, (не требуется)'
                                                    name={[field.name, 'title']}
                                                >
                                                    <Input/>
                                                </Form.Item>
                                            </Col>
                                            <Col span={12}>
                                                <Form.Item
                                                    label='Комментарий, (не требуется)'
                                                    name={[field.name, 'comment']}
                                                >
                                                    <Input/>
                                                </Form.Item>
                                            </Col>
                                            <Col span={24}>
                                                <Form.Item
                                                    label='Каковы преимущества этой включает, (не требуется)'
                                                    name={[field.name, 'tags']}

                                                >
                                                    <Input placeholder='option1, option2, option3'/>
                                                </Form.Item>
                                            </Col>
                                        </Row>


                                        <Form.Item
                                            label={`Фото, (не требуется) ${index + 1}`}
                                            name={[field.name, "mediaId"]}

                                        >
                                            <ImgCrop rotate>
                                                <Upload
                                                    maxCount={1}
                                                    listType="picture-card"
                                                    fileList={editorFileList}
                                                    onChange={(newFileList) => onChangeIncludesImage(index, newFileList)}
                                                    onPreview={onPreview}
                                                    beforeUpload={() => false}
                                                >
                                                    {editorFileList.length < 1 && "+ Upload"}
                                                </Upload>
                                            </ImgCrop>
                                        </Form.Item>

                                        <MinusCircleOutlined
                                            onClick={() => handleRemoveIncludes(field.name, remove, index , editorFileList)}/>
                                    </div>

                                );
                            })}
                            <Form.Item>
                                <Button type="primary" onClick={() => addFormList(add)} block style={{backgroundColor: '#28a745'}}>
                                    Добавьте предмет
                                </Button>
                            </Form.Item>

                        </>
                    )}
                </Form.List>


                <Button type="primary" htmlType="submit" style={{width: "100%", marginTop: "20px"}}>
                    {editExteriorSuccess ? 'Edit' : 'Add'}
                </Button>
            </Form>}
    </div>);
};

export default OptionPostEdit;