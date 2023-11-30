import React, {useEffect, useState} from 'react';
import {Button, Col, Form, message, Row, Upload} from 'antd';
import ImgCrop from 'antd-img-crop';
import {useMutation, useQuery} from 'react-query';
import apiService from '../../../@crema/services/apis/api';
import {AppLoader} from '../../../@crema';
import {useNavigate} from 'react-router-dom';
import {useDispatch, useSelector} from 'react-redux';
import {EDIT_DATA} from '../../../shared/constants/ActionTypes';

const initialValueForm = {
    mediaId: [""]
};


const PostEditFilialInner = () => {
    const [form] = Form.useForm();
    const navigate = useNavigate();
    const {editId} = useSelector((state) => state.editData);
    const dispatch = useDispatch();

    const [fileListProps, setFileListProps] = useState([]);
    const [fileList, setFileList] = useState([]);
    const [valuesForm, setValues] = useState({});
    const [isNotEditImages, setIsNotEditImages] = useState(false);
    const [deleteImage, setDeleteImage] = useState([]);


    // query-filialInner
    const {
        mutate: postFilialInnerMutate,
        data: postFilialInner,
        isLoading: postFilialInnerLoading,
        isSuccess: postFilialInnerSuccess,
        error: postFilialInnerError,
        isError: postFilialInnerIsError,
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

        onError: (error) => message.error(error.message, 'Rasmning JPG,JPEG,PNG formatlariga ruxsat etilgan')
    });
    // query-edit

    const {
        isLoading: editFilialInnerLoading,
        data: editFilialInnerData,
        refetch: editFilialInnerRefetch,
        isSuccess: editFilialInnerSuccess,
    } = useQuery(
        ['edit-filialInner', editId],
        () => apiService.getDataByID('/filialInner',editId),
        {
            enabled: false,
        },
    );
    // put-query
    const {
        mutate: putFilialInner,
        isLoading: putFilialInnerLoading,
        data: putData,
        isSuccess: putFilialInnerSuccess,
        error: putFilialInnerError,
        isError: putFilialInnerIsError,
    } = useMutation(({url, data, id}) => apiService.editData(url, data, id), {
        onError: (error) => message.error(error.message)
    });
    // delete-image-query
    const {mutate: imagesDeleteMutate} = useMutation(({url, ids}) => apiService.deleteImages(url, ids), {
            onSuccess: () => message.success('Success'),
            onError: (error) => message.error(error.message)
        }
    );

    // filialInner success
    useEffect(() => {
        let delImage = []
        if (putFilialInnerSuccess) {
            dispatch({type: EDIT_DATA, payload: ''});
        }

        deleteImage?.map(image => {
            if (editFilialInnerSuccess && image?.uid) {
                delImage.push(image?.uid)
            }

        })

        if (editFilialInnerSuccess &&delImage.length>0) {
            const ids = {
                ids: delImage
            }
            imagesDeleteMutate({url: '/medias', ids});
        }

        if (postFilialInnerSuccess || putFilialInnerSuccess) {

            navigate('/filialInner');
        }
    }, [postFilialInner, putData]);

    //filialInner  error
    useEffect(() => {
        if (postFilialInnerIsError) {
            message.error(postFilialInnerError.message);
        }
        if (putFilialInnerIsError) {
            message.error(putFilialInnerError.message);
        }
    }, [postFilialInnerError, putFilialInnerError]);

    // if edit filialInner
    useEffect(() => {
        if (editId !== '') {
            editFilialInnerRefetch();
        }
    }, [editId]);

    // if no edit filialInner
    useEffect(() => {
        if (editId === '') {
            form.setFieldsValue(initialValueForm);
        }
    }, []);

    //edit filialInner
    useEffect(() => {
        const imagesInitial = [];
        for (let i = 0; i < editFilialInnerData?.images?.length; i++) {
            const editDefaultImages = {
                uid: editFilialInnerData?.images[i]?._id,
                name: editFilialInnerData?.images[i]?.name,
                location: editFilialInnerData?.images[i]?.path,
                status: "done",
                url: `${process.env.REACT_APP_API_URL}/${editFilialInnerData?.images[i]?.path}`
            };
            imagesInitial.push(editDefaultImages);
        }
        if (editFilialInnerSuccess) {
            const edit = {
                mediaId: imagesInitial,
            };
            setFileListProps(imagesInitial);

            form.setFieldsValue(edit);
        }
    }, [editFilialInnerData]);

    // post filialInner
    useEffect(() => {

        let imageData = []

        let patchImagesAndInitialImages = [];
        if (imagesUploadSuccess) {

            patchImagesAndInitialImages = fileList.concat(imagesUpload);
        } else {
            patchImagesAndInitialImages = [...fileList];
        }

        const deleteLocalImage = []
        patchImagesAndInitialImages.map((image) => {
            if (!image?.originFileObj?.uid) {
                deleteLocalImage.push(image)
            }
        })


        if (!editFilialInnerSuccess && imagesUpload) {
            imagesUpload?.map(image => {
                imageData.push(image?._id)
            })
        } else {
            deleteLocalImage.map((image) => {

                if (image?.uid) {
                    imageData.push(image?.uid)
                } else {
                    imageData.push(image?._id)

                }
            });
        }


        const data = {
            mediaId: imageData,

        };
        if (imagesUploadSuccess && !editFilialInnerSuccess) {
            postFilialInnerMutate({url: '/filialInner', data});
        } else if (isNotEditImages || imagesUploadSuccess) {
            putFilialInner({url: '/filialInner', data, id: editId});
        }
    }, [imagesUpload, valuesForm]);
    // on finish
    const onFinish = (values) => {
        const formData = new FormData();

        let uploadNewImage = false;

        fileListProps?.map(file => {
            if (editFilialInnerSuccess) {
                if (file?.originFileObj?.uid) {
                    uploadNewImage = true;
                    formData.append('media', file?.originFileObj);
                    setIsNotEditImages(false);
                    setFileList(fileListProps);
                } else {
                    uploadNewImage = false;
                    setFileList(fileListProps);
                    setIsNotEditImages(true);
                }
            } else {
                uploadNewImage = true;
                formData.append('media', file?.originFileObj);
            }

        })
        if (uploadNewImage && !imagesUploadSuccess) {
            imagesUploadMutate({url: '/medias', formData});
        }

        setValues(values);
    };
    const onFinishFailed = (errorInfo) => {
        console.log('Failed:', errorInfo);
    };

    const onChange = ({fileList: newFileList}) => {
        setFileListProps(newFileList);
        form.setFieldsValue({mediaId: newFileList});
    };


    const handleRemoveImage = (file) => {
        if (editFilialInnerSuccess) {
            const updateDeleteImage=[...deleteImage]
            updateDeleteImage.push(file)
            setDeleteImage(updateDeleteImage);
        }
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
            postFilialInnerLoading ||
            editFilialInnerLoading ||
            putFilialInnerLoading ? (
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
                    <Row gutter={20}>
                        <Col span={12}>
                            <Form.Item
                                label='Изображение логотипа'
                                name={'mediaId'}
                                rules={[{required: true, message: 'Требуется загрузка изображения логотипа'}]}>
                                <ImgCrop rotationSlider>
                                    <Upload
                                        maxCount={2}
                                        fileList={fileListProps}
                                        listType='picture-card'
                                        onChange={onChange}
                                        onPreview={onPreview}
                                        beforeUpload={() => false}
                                        onRemove={handleRemoveImage}>
                                        {fileListProps.length > 1 ? "" : "Upload"}
                                    </Upload>
                                </ImgCrop>
                            </Form.Item>
                        </Col>

                    </Row>


                    <Button type='primary' htmlType='submit' style={{width: '100%'}}>
                        {editFilialInnerSuccess ? 'Edit' : 'Add'}
                    </Button>
                </Form>
            )}
        </div>
    );
};

export default PostEditFilialInner;
