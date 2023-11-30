import React, {useEffect, useState} from 'react';
import {Button, Col, Form, Input, message, Row,  Upload,Typography} from 'antd';
import ImgCrop from 'antd-img-crop';
import {useMutation, useQuery} from 'react-query';
import apiService from '../../../@crema/services/apis/api';
import {AppLoader} from '../../../@crema';
import {useNavigate} from 'react-router-dom';
import {useDispatch, useSelector} from 'react-redux';
import {EDIT_DATA} from '../../../shared/constants/ActionTypes';
import {MinusCircleOutlined} from "@ant-design/icons";
const { TextArea } = Input;
const { Title } = Typography;
const initialValueForm = {
    mainTextRu: "",
    mainTextUz: "",
    mainMediaId: "",
    videoId: "",
    aboutDescriptionRu: "",
    aboutDescriptionUz:"",
    team:[
        {
            mediaId:"",
            nameRu:"",
            nameUz:"",
            levelRu:"",
            levelUz:""
        }
    ],
    researchTitleRu:"",
    researchTitleUz:"",
    researchTextRu:"",
    researchTextUz:"",
    researchMediaId:"",
    aboutSysDescriptionRu: "",
    aboutsysDescriptionUz:"",
    systems:[
        {
            mediaId:"",
            titleRu:"",
            titleUz:"",
            descriptionRu:"",
            descriptionUz:""
        }
    ],
};


const PostEditAbout = () => {
    const [form] = Form.useForm();
    const navigate = useNavigate();
    const {editId} = useSelector((state) => state.editData);
    const dispatch = useDispatch();

    const [fileListPropsMain, setFileListPropsMain] = useState([]);
    const [fileListVideo, setFileListVideo] = useState([]);
    const [fileListPropsVideo, setFileListPropsVideo] = useState([]);
    const [fileListPropsTeam, setFileListPropsTeam] = useState([]);
    const [fileListPropsResearch, setFileListPropsResearch] = useState([]);
    const [fileListPropsSystem, setFileListPropsSystem] = useState([]);
    const [mainIndexTeam, setMainIndexTeam] = useState(0);
    const [mainIndexResearch, setMainIndexResearch] = useState(0);
    const [isUpload, setIsUpload] = useState('');


    // query-banner
    const {
        mutate: postBannerMutate,
        data: postBanner,
        isLoading: postBannerLoading,
        isSuccess: postBannerSuccess,

    } = useMutation(({url, data}) => apiService.postData(url, data),
        {
            onSuccess: () => message.success('Success'),
            onError: (error) => message.error(error.message)
        });
    // query-image
    const {
        mutate: imagesUploadMutate,
        data: imagesUpload,
        isLoading: imagesUploadLoading,
        isSuccess: imagesUploadSuccess,
    } = useMutation(({url, formData}) => apiService.postData(url, formData), {

        onError: (error) => message.error(error.response.message)
    });
    // query-edit

    const {
        isLoading: editBannerLoading,
        data: editProductData,
        refetch: editBannerRefetch,
        isSuccess: editProductSuccess,
    } = useQuery(
        ['edit-banner', editId],
        () => apiService.getDataByID('/about', editId),
        {
            enabled: false,
        },
    );
    // put-query
    const {
        mutate: putBanner,
        isLoading: putBannerLoading,
        data: putData,
        isSuccess: putBannerSuccess,

    } = useMutation(({url, data, id}) => apiService.editData(url, data, id), {
        onError: (error) => {
            message.error(error.response.data)
        }
    });
    // delete-image-query
    const {mutate: imagesDeleteMutate} = useMutation(({url, ids}) => apiService.deleteImages(url, ids), {
            onSuccess: () => message.success('Success'),
            onError: (error) => message.error(error.message)
        }
    );
    // product success
    useEffect(() => {
        if (putBannerSuccess) {
            dispatch({type: EDIT_DATA, payload: ''});
        }

        if (postBannerSuccess || putBannerSuccess) {

            navigate('/about');
        }
    }, [postBanner, putData]);
    // product error
    // useEffect(() => {
    //     if (postBannerIsError) {
    //         message.error(postBannerError.message);
    //     }
    //     if (putBannerIsError) {
    //         message.error(putBannerError.message);
    //     }
    // }, [postBannerError, putBannerError]);

    // if edit product
    useEffect(() => {
        if (editId !== '') {
            editBannerRefetch();
        }
    }, [editId]);

    // if no edit product
    useEffect(() => {
        if (editId === '') {
            form.setFieldsValue(initialValueForm);
        }
    }, []);

    //edit product
    useEffect(() => {
        const data=editProductData
        const initialTeam = [];
        const initialFileListPropsTeam = [];
        const initialSystem = [];
        const initialFileListPropsSystem = [];

        if(data!==undefined){

            for (let i = 0; i < data.aboutCompany.team.length; i++) {
                const editDefaultImages = [{
                    uid: data.aboutCompany.team[i]?.image?._id,
                    name: data.aboutCompany.team[i]?.image?.name,
                    status: "done",
                    url: `${process.env.REACT_APP_API_URL}/${data?.aboutCompany.team[i]?.image?.path}`
                }];
                const item = {
                    nameRu: data?.aboutCompany.team[i].nameRu,
                    nameUz: data?.aboutCompany.team[i].nameUz,
                    levelRu: data?.aboutCompany.team[i].levelRu,
                    levelUz: data?.aboutCompany.team[i].levelUz,
                    mediaId:data?.aboutCompany.team[i].image
                };
                initialTeam.push(item);
                // initialFileListTeam.push(data.aboutCompany.team[i]?.image)
                initialFileListPropsTeam.push(editDefaultImages)
            }

            for (let i = 0; i < data.aboutSystems.systems.length; i++) {
                const editDefaultImages = [{
                    uid: data?.aboutSystems.systems[i]?.image?._id,
                    name: data?.aboutSystems.systems[i]?.image?.name,
                    status: "done",
                    url: `${process.env.REACT_APP_API_URL}/${data?.aboutSystems.systems[i]?.image?.path}`
                }];
                const item = {
                    titleRu: data?.aboutSystems.systems[i].titleRu,
                    titleUz: data?.aboutSystems.systems[i].titleUz,
                    descriptionRu: data?.aboutSystems.systems[i].descriptionRu,
                    descriptionUz: data?.aboutSystems.systems[i].descriptionUz,
                    mediaId:data?.aboutSystems.systems[i].image
                };
                initialSystem.push(item);
                // initialFileListSystem.push(data?.aboutSystems?.systems[i]?.image)
                initialFileListPropsSystem.push(editDefaultImages)
            }
        }

        const mainSectionImage = [{
            uid: data?.mainSection?.imageMain?._id,
            name: data?.mainSection?.imageMain?.name,
            status: "done",
            url: `${process.env.REACT_APP_API_URL}/${data?.mainSection?.imageMain?.path}`
        }]

        const researchImage = [{
            uid: data?.research.image?._id,
            name: data?.research.image?.name,
            status: "done",
            url: `${process.env.REACT_APP_API_URL}/${data?.research?.image?.path}`
        }]

        const video = [{
            uid: data?.video?._id,
            name: data?.video?.name,
            status: "done",
            url: `${process.env.REACT_APP_API_URL}/${data?.video?.path}`
        }]

        if (editProductSuccess) {

            const edit = {
                mainTextRu: data?.mainSection?.textRu,
                mainTextUz: data?.mainSection?.textRu,
                mainMediaId: mainSectionImage,
                videoId: video,
                aboutDescriptionRu: data?.aboutCompany.descriptionRu,
                aboutDescriptionUz:data?.aboutCompany.descriptionUz,
                team:initialTeam,
                researchTitleRu:data?.research.titleRu,
                researchTitleUz:data?.research.titleUz,
                researchTextRu:data?.research.textRu,
                researchTextUz:data?.research.textUz,
                researchMediaId:researchImage,
                aboutSysDescriptionRu: data?.aboutSystems.descriptionRu,
                aboutsysDescriptionUz:data?.aboutSystems.descriptionUz,
                systems:initialSystem,
            };
            setFileListPropsMain(mainSectionImage)
            setFileListVideo([data?.video])
            setFileListPropsVideo(video)
            setFileListPropsTeam(initialFileListPropsTeam)
            setFileListPropsResearch(researchImage)
            setFileListPropsSystem(initialFileListPropsSystem)
            form.setFieldsValue(edit);


        }

    }, [editProductData]);

    // post product
    const onFinish = (values) => {

        const team = [];
        const systems = [];

        for (let i = 0; i < fileListPropsTeam.length; i++) {
            const item = {
                "nameRu": values.team[i].nameRu,
                "nameUz": values.team[i].nameUz,
                "levelRu": values.team[i].levelRu,
                "levelUz": values.team[i].levelUz,
                "mediaId": fileListPropsTeam[i][0]?.uid
            };
            team.push(item);
        }

        for (let i = 0; i < fileListPropsSystem.length; i++) {
            const item = {
                "titleRu": values.systems[i].titleRu,
                "titleUz": values.systems[i].titleUz,
                "descriptionRu": values.systems[i].descriptionRu,
                "descriptionUz": values.systems[i].descriptionUz,
                "mediaId": fileListPropsSystem[i][0]?.uid
            };
            systems.push(item);
        }

        const data = {
            mainSection:{
                textRu:values.mainTextRu,
                textUz:values.mainTextUz,
                mediaId:fileListPropsMain[0]?.uid
            },
            videoId:fileListVideo[0]?._id,
            aboutCompany:{
                descriptionRu:values.aboutDescriptionRu,
                descriptionUz:values.aboutDescriptionUz,
                team,
            },
            research:{
                titleRu:values.researchTitleRu,
                titleUz:values.researchTitleUz,
                textRu:values.researchTextRu,
                textUz:values.researchTextUz,
                mediaId:fileListPropsResearch[0]?.uid
            },
            aboutSystems:{
                descriptionRu:values.aboutSysDescriptionRu,
                descriptionUz:values.aboutsysDescriptionUz,
                systems
            }
        };

        if (editProductSuccess) {
            putBanner({url: "/about", data, id: editId});
        } else {
            postBannerMutate({url: "/about", data});
        }

    }
    const onFinishFailed = (errorInfo) => {
        console.log('Failed:', errorInfo);
    };


    // image and video upload
    useEffect(() => {
        // MAIN
        if (imagesUploadSuccess &&  isUpload==="main"){
            const uploadImg= [{
                uid: imagesUpload[0]?._id,
                name: imagesUpload[0]?.name,
                status: "done",
                url: `${process.env.REACT_APP_API_URL}/${imagesUpload[0]?.path}`
            }]

            setFileListPropsMain(uploadImg);
            setIsUpload('false')
        }
        // VIDEO
        if (imagesUploadSuccess && fileListPropsVideo[0]?.originFileObj?.uid && isUpload==='video'){
            setFileListVideo(imagesUpload);
            setIsUpload('')
        }
        // RESEARCH
        if (imagesUploadSuccess && isUpload==='research'){
            const uploadImg= [{
                uid: imagesUpload[0]?._id,
                name: imagesUpload[0]?.name,
                status: "done",
                url: `${process.env.REACT_APP_API_URL}/${imagesUpload[0]?.path}`
            }]
            setFileListPropsResearch(uploadImg);
            setIsUpload('')
        }
        // TEAM
        const uploadFilesStateTeam = [...fileListPropsTeam];
        if (imagesUploadSuccess && isUpload==='team') {
            const uploadImg= [{
                uid: imagesUpload[0]?._id,
                name: imagesUpload[0]?.name,
                status: "done",
                url: `${process.env.REACT_APP_API_URL}/${imagesUpload[0]?.path}`
            }]
            uploadFilesStateTeam[mainIndexTeam] = uploadImg;
            setFileListPropsTeam(uploadFilesStateTeam);
            const getValue = form.getFieldsValue();
            const itemsValue = getValue?.team;
            itemsValue[mainIndexTeam].mediaId = uploadImg;
            form.setFieldsValue({ items: itemsValue });
            setIsUpload('')
        }
        // SYSTEM
        const uploadFilesStateSystem = [...fileListPropsSystem];
        if (imagesUploadSuccess &&  isUpload==='system') {
            const uploadImg= [{
                uid: imagesUpload[0]?._id,
                name: imagesUpload[0]?.name,
                status: "done",
                url: `${process.env.REACT_APP_API_URL}/${imagesUpload[0]?.path}`
            }]
            uploadFilesStateSystem[mainIndexResearch] = uploadImg;
            setFileListPropsSystem(uploadFilesStateSystem);
            const getValue = form.getFieldsValue();
            const itemsValue = getValue.systems;
            itemsValue[mainIndexResearch].mediaId = uploadImg;
            form.setFieldsValue({ items: itemsValue });
            setIsUpload('')

        }
    }, [imagesUpload]);
    const onChangeMain = ({ fileList: newFileList }) => {
        form.setFieldsValue({ mainMediaId: newFileList });
        if (fileListPropsMain.length!==0 || newFileList.length === 0) {
            const id = [fileListPropsMain[0]?.uid];
            const ids={
                ids:id
            }
            imagesDeleteMutate({ url: "/medias", ids });
            setFileListPropsMain([])
        }
        const formData = new FormData();

        if (newFileList.length !== 0) {
            formData.append("media", newFileList[0].originFileObj);
            imagesUploadMutate({ url: "/medias", formData });
            setIsUpload('main')
        }

    };
    const onChangeVideo = ({ fileList: newFileList }) => {
        setFileListPropsVideo(newFileList);
        form.setFieldsValue({ videoId: newFileList });
        if (fileListVideo.length!==0 || newFileList.length === 0) {
            const id = [fileListVideo[0]?._id];
            const ids={
                ids:id
            }
            imagesDeleteMutate({ url: "/medias", ids });
            setFileListVideo([])

        }
        const formData = new FormData();
        if (newFileList.length !== 0) {
            formData.append("media", newFileList[0].originFileObj);
            imagesUploadMutate({ url: "/medias", formData });
            setIsUpload('video')
        }
    };
    const onChangeResearch = ({ fileList: newFileList }) => {

        // setFileListPropsResearch(newFileList);
        form.setFieldsValue({ researchMediaId: newFileList });
        if (fileListPropsResearch.length!==0 || newFileList.length === 0) {
            const id = [fileListPropsResearch[0]?.uid];
            const ids={
                ids:id
            }
            imagesDeleteMutate({ url: "/medias", ids });
            setFileListPropsResearch([])

        }
        const formData = new FormData();
        if (newFileList.length !== 0) {
            formData.append("media", newFileList[0].originFileObj);
            imagesUploadMutate({ url: "/medias", formData });
            setIsUpload('research')
        }
    };

    const onChangeAboutImage = (index, { fileList: newFileList }) => {
        setMainIndexTeam(index);

        if (fileListPropsTeam[index] || newFileList.length === 0) {
            const id = [fileListPropsTeam[index][0].uid];
            const ids={
                ids:id
            }
            imagesDeleteMutate({ url: "/medias", ids });
            fileListPropsTeam[index] = null;
            setFileListPropsTeam(fileListPropsTeam);

        }
        const formData = new FormData();
        if (newFileList.length !== 0) {
            formData.append("media", newFileList[0].originFileObj);
            imagesUploadMutate({ url: "/medias", formData });
            setIsUpload('team')

        }
    };

    const onChangeSystemsImage = (index, { fileList: newFileList }) => {
        setMainIndexResearch(index);

        if (fileListPropsSystem[index] || newFileList.length === 0) {
            const id = [fileListPropsSystem[index][0].uid];
            const ids={
                ids:id
            }
            imagesDeleteMutate({ url: "/medias", ids });
            fileListPropsSystem[index] = null;
            setFileListPropsSystem(fileListPropsSystem);

        }
        const formData = new FormData();
        if (newFileList.length !== 0) {
            formData.append("media", newFileList[0].originFileObj);
            imagesUploadMutate({ url: "/medias", formData });
            setIsUpload('system')
        }
    };



    const handleRemoveTeam = (name, remove, index,  editorFileList) => {
        if (editorFileList === fileListPropsTeam[index] && fileListPropsTeam.length>0) {

            const id = [fileListPropsTeam[index][0].uid];
            const ids={
                ids:id
            }
            fileListPropsTeam.splice(index, 1);
            // fileListTeam.splice(index, 1);
            imagesDeleteMutate({url: "/medias", ids});
        }
        remove(name);
    };

    const handleRemoveSystems = (name, remove, index, editorFileList) => {

        if (editorFileList === fileListPropsSystem[index]) {
            const id = [fileListPropsSystem[index][0].uid];
            fileListPropsSystem.splice(index, 1);
            const ids={
                ids:id
            }
            // fileListSystem.splice(index, 1);
            imagesDeleteMutate({url: "/medias", ids});
        }
        remove(name);
    };

    // refresh page again get data

    useEffect(() => {
        const storedValues = JSON.parse(localStorage.getItem('myFormValues'));
        if (storedValues) {
            storedValues.images = [];
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
            localStorage.removeItem('editDataId');
            localStorage.removeItem('myFormValues');
            window.removeEventListener('beforeunload', handleBeforeUnload);
        };
    }, []);

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
            {imagesUploadLoading ||
            postBannerLoading ||
            editBannerLoading ||
            putBannerLoading ? (
                <AppLoader/>
            ) : (
                <Form
                    form={form}
                    name='basic'
                    labelCol={{
                        span: 24,
                    }}
                    wrapperCol={{
                        span: 24,
                    }}
                    style={{
                        maxWidth: '100%',
                    }}
                    initialValues={initialValueForm}
                    onFinish={onFinish}
                    onFinishFailed={onFinishFailed}
                    autoComplete='off'>
                    {/*Main*/}
                    <Title level={2}>Главный баннер</Title>
                    <Row gutter={20}>
                        <Col span={12}>
                            <Form.Item
                                label='Текст Ru'
                                name='mainTextRu'
                                rules={[
                                    {
                                        required: true,
                                        message: 'Требуется текст RU!',
                                    },
                                ]}>
                                <TextArea rows={4}   />
                            </Form.Item>
                        </Col>
                        <Col span={12}>
                            <Form.Item
                                label='Text Uz'
                                name='mainTextUz'
                                rules={[
                                    {
                                        required: true,
                                        message: 'Text kiritish talab qilinadi Uz!',
                                    },
                                ]}>
                                <TextArea rows={4}   />
                            </Form.Item>
                        </Col>
                    </Row>
                    <Row gutter={20}>
                        <Col span={12}>
                            <Form.Item
                                label='Изображение'
                                name={'mainMediaId'}
                                rules={[{required: true, message: 'Требуется загрузка изображения '}]}>
                                <ImgCrop rotate>
                                    <Upload
                                        maxCount={1}
                                        fileList={fileListPropsMain}
                                        listType='picture-card'
                                        onChange={onChangeMain}
                                        onPreview={onPreview}
                                        beforeUpload={() => false}
                                    >
                                        {fileListPropsMain.length > 0 ? "" : "Upload"}
                                    </Upload>
                                </ImgCrop>
                            </Form.Item>
                        </Col>

                    </Row>
                    {/*video*/}
                    <Title level={2}>Видео</Title>
                    <Row gutter={20}>
                        <Col span={24}>
                            <Form.Item
                                label='Баннерное видео'
                                name={'videoId'}
                                rules={[{required: true, message: 'Требуется видеобаннер'}]}>

                                <Upload
                                    maxCount={1}
                                    accept="video/*"
                                    fileList={fileListPropsVideo}
                                    listType='picture-card'
                                    onChange={onChangeVideo}
                                    onPreview={onPreview}
                                    beforeUpload={() => false}
                                >
                                    {fileListPropsVideo.length>0 ? "" : "Upload"}
                                </Upload>
                            </Form.Item>
                        </Col>
                    </Row>
                    {/*about team*/}
                    <Title level={2}>О команде</Title>

                    <Row gutter={20}>
                        <Col span={12}>
                            <Form.Item
                                label='Текст Ru'
                                name='aboutDescriptionRu'
                                rules={[
                                    {
                                        required: true,
                                        message: 'Требуется текст RU!',
                                    },
                                ]}>
                                <TextArea rows={4}   />

                            </Form.Item>
                        </Col>
                        <Col span={12}>
                            <Form.Item
                                label='Text Uz'
                                name='aboutDescriptionUz'
                                rules={[
                                    {
                                        required: true,
                                        message: 'Text kiritish talab qilinadi Uz!',
                                    },
                                ]}>
                                <TextArea rows={4}   />

                            </Form.Item>
                        </Col>
                    </Row>
                    <Form.List name="team">
                        {(fields, {add, remove}) => (
                            <>
                                {fields.map((field, index) => {
                                    const editorFileList = fileListPropsTeam[index] || [];
                                    return (
                                        <div key={field.fieldKey} style={{marginBottom: 20}}>
                                            <Row gutter={20}>
                                                <Col span={12}>
                                                    <Form.Item
                                                        label='Имя'
                                                        name={[field.name, 'nameRu']}
                                                        rules={[
                                                            {
                                                                required: true,
                                                                message: 'Требуется имя ',
                                                            },
                                                        ]}>
                                                        <Input/>
                                                    </Form.Item>
                                                </Col>
                                                <Col span={12}>
                                                    <Form.Item
                                                        label='Ism'
                                                        name={[field.name, 'nameUz']}
                                                        rules={[
                                                            {
                                                                required: true,
                                                                message: 'Ism kiritish talab qilinadi ',
                                                            },
                                                        ]}>
                                                        <Input/>
                                                    </Form.Item>
                                                </Col>
                                            </Row>
                                            <Row gutter={20}>
                                                <Col span={12}>
                                                    <Form.Item
                                                        label='Уровень'
                                                        name={[field.name,'levelRu']}
                                                        rules={[
                                                            {
                                                                required: true,
                                                                message: 'Требуется уровень ',
                                                            },
                                                        ]}>
                                                        <Input/>
                                                    </Form.Item>
                                                </Col>
                                                <Col span={12}>
                                                    <Form.Item
                                                        label='Daraja'
                                                        name={[field.name,'levelUz']}
                                                        rules={[
                                                            {
                                                                required: true,
                                                                message: 'Daraja kiritish talab qilinadi ',
                                                            },
                                                        ]}>
                                                        <Input/>
                                                    </Form.Item>
                                                </Col>
                                            </Row>


                                            <Form.Item
                                                label={`(Фото персонала) ${index + 1}`}
                                                name={[field.name, "mediaId"]}
                                                rules={[
                                                    {
                                                        required: true,
                                                        message: "Требуется фото сотрудника"
                                                    }
                                                ]}
                                            >
                                                <ImgCrop rotate>
                                                    <Upload
                                                        maxCount={1}
                                                        listType="picture-card"
                                                        fileList={editorFileList}
                                                        onChange={(newFileList) => onChangeAboutImage(index, newFileList)}
                                                        onPreview={onPreview}
                                                        beforeUpload={() => false}
                                                    >
                                                        {editorFileList.length < 1 && "+ Upload"}
                                                    </Upload>
                                                </ImgCrop>
                                            </Form.Item>

                                            <MinusCircleOutlined
                                                onClick={() => handleRemoveTeam(field.name, remove, index, editorFileList)}/>
                                        </div>

                                    );
                                })}
                                <Form.Item>
                                    <Button type="primary" onClick={() => add()} block style={{backgroundColor:'#28a745'}}>
                                        Добавьте предмет
                                    </Button>
                                </Form.Item>

                            </>
                        )}
                    </Form.List>
                    {/*research*/}
                    <Title level={2}>Исследовать</Title>

                    <Row gutter={20}>
                        <Col span={12}>
                            <Form.Item
                                label='Заголовок'
                                name='researchTitleRu'
                                rules={[
                                    {
                                        required: true,
                                        message: 'Требуется заголовок ',
                                    },
                                ]}>
                                <Input/>
                            </Form.Item>
                        </Col>
                        <Col span={12}>
                            <Form.Item
                                label='Sarlavha'
                                name='researchTitleUz'
                                rules={[
                                    {
                                        required: true,
                                        message: 'Sarlavha kiritish talab qilinadi ',
                                    },
                                ]}>
                                <Input/>
                            </Form.Item>
                        </Col>
                    </Row>
                    <Row gutter={20}>
                        <Col span={12}>
                            <Form.Item
                                label='Текст'
                                name='researchTextRu'
                                rules={[
                                    {
                                        required: true,
                                        message: 'Требуется текст ',
                                    },
                                ]}>
                                <Input/>
                            </Form.Item>
                        </Col>
                        <Col span={12}>
                            <Form.Item
                                label='Matn'
                                name='researchTextUz'
                                rules={[
                                    {
                                        required: true,
                                        message: 'Matn kiritish talab qilinadi ',
                                    },
                                ]}>
                                <Input/>
                            </Form.Item>
                        </Col>
                    </Row>
                    <Row gutter={20}>
                        <Col span={12}>
                            <Form.Item
                                label='Изображение'
                                name={'researchMediaId'}
                                rules={[{required: true, message: 'Требуется загрузка изображения '}]}>
                                <ImgCrop rotate>
                                    <Upload
                                        maxCount={1}
                                        fileList={fileListPropsResearch}
                                        listType='picture-card'
                                        onChange={onChangeResearch}
                                        onPreview={onPreview}
                                        beforeUpload={() => false}>
                                        {fileListPropsResearch.length > 0 ? "" : "Upload"}
                                    </Upload>
                                </ImgCrop>
                            </Form.Item>
                        </Col>

                    </Row>
                    {/*about system*/}
                    <Title level={2}>О системе</Title>

                    <Row gutter={20}>
                        <Col span={12}>
                            <Form.Item
                                label='Текст Ru'
                                name='aboutSysDescriptionRu'
                                rules={[
                                    {
                                        required: true,
                                        message: 'Требуется текст RU!',
                                    },
                                ]}>
                                <TextArea rows={4}   />
                            </Form.Item>
                        </Col>
                        <Col span={12}>
                            <Form.Item
                                label='Text Uz'
                                name='aboutsysDescriptionUz'
                                rules={[
                                    {
                                        required: true,
                                        message: 'Text kiritish talab qilinadi Uz!',
                                    },
                                ]}>
                                <TextArea rows={4}   />

                            </Form.Item>
                        </Col>
                    </Row>
                    <Form.List name="systems">
                        {(fields, {add, remove}) => (
                            <>
                                {fields.map((field, index) => {
                                    const editorFileList = fileListPropsSystem[index] || [];
                                    return (
                                        <div key={field.fieldKey} style={{marginBottom: 20}}>
                                            <Row gutter={20}>
                                                <Col span={12}>
                                                    <Form.Item
                                                        label='Заголовок'
                                                        name={[field.name,'titleRu']}
                                                        rules={[
                                                            {
                                                                required: true,
                                                                message: 'Требуется заголовок ',
                                                            },
                                                        ]}>
                                                        <Input/>
                                                    </Form.Item>
                                                </Col>
                                                <Col span={12}>
                                                    <Form.Item
                                                        label='Sarlavha'
                                                        name={[field.name,'titleUz']}
                                                        rules={[
                                                            {
                                                                required: true,
                                                                message: 'Sarlavha kiritish talab qilinadi ',
                                                            },
                                                        ]}>
                                                        <Input/>
                                                    </Form.Item>
                                                </Col>
                                            </Row>
                                            <Row gutter={20}>
                                                <Col span={12}>
                                                    <Form.Item
                                                        label='Текст'
                                                        name={[field.name,'descriptionRu']}
                                                        rules={[
                                                            {
                                                                required: true,
                                                                message: 'Требуется текст',
                                                            },
                                                        ]}>
                                                        <TextArea rows={4}   />

                                                    </Form.Item>
                                                </Col>
                                                <Col span={12}>
                                                    <Form.Item
                                                        label='Matn'
                                                        name={[field.name,'descriptionUz']}
                                                        rules={[
                                                            {
                                                                required: true,
                                                                message: 'Matn kiritish talab qilinadi ',
                                                            },
                                                        ]}>
                                                        <TextArea rows={4}   />

                                                    </Form.Item>
                                                </Col>
                                            </Row>


                                            <Form.Item
                                                label={`(Фото) ${index + 1}`}
                                                name={[field.name, "mediaId"]}
                                                rules={[
                                                    {
                                                        required: true,
                                                        message: "Требуется фото"
                                                    }
                                                ]}
                                            >
                                                <ImgCrop rotate>
                                                    <Upload
                                                        maxCount={1}
                                                        listType="picture-card"
                                                        fileList={editorFileList}
                                                        onChange={(newFileList) => onChangeSystemsImage(index, newFileList)}
                                                        onPreview={onPreview}
                                                        beforeUpload={() => false}
                                                    >
                                                        {editorFileList.length < 1 && "+ Upload"}
                                                    </Upload>
                                                </ImgCrop>
                                            </Form.Item>

                                            <MinusCircleOutlined
                                                onClick={() => handleRemoveSystems(field.name, remove, index, editorFileList)}/>
                                        </div>

                                    );
                                })}
                                <Form.Item>
                                    <Button  type='primary' onClick={() => add()} block style={{backgroundColor:'#28a745'}}>
                                        Добавьте предмет
                                    </Button>
                                </Form.Item>

                            </>
                        )}
                    </Form.List>
                    <Button type='primary' htmlType='submit' style={{width: '100%'}}>
                        {editProductSuccess ? 'Edit' : 'Add'}
                    </Button>
                </Form>
            )}
        </div>
    );
};

export default PostEditAbout;