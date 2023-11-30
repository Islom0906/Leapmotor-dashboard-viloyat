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
  mediaLogoId:"",
  mediaBrandId:"",
  mediaVideoId:"",
};



const PostEditBanner = () => {
  const [form] = Form.useForm();
  const navigate = useNavigate();
  const {editId} = useSelector((state) => state.editData);
  const dispatch = useDispatch();

  const [fileListProps, setFileListProps] = useState([]);
  const [fileListProps2, setFileListProps2] = useState([]);
  const [fileListProps3, setFileListProps3] = useState([]);
  const [valuesForm, setValues] = useState({});
  const [isNotEditImages, setIsNotEditImages] = useState(false);
  const [deleteImage, setDeleteImage] = useState({});
  const [deleteImage2, setDeleteImage2] = useState({});
  const [deleteImage3, setDeleteImage3] = useState({});


  // query-banner
  const {
    mutate: postBannerMutate,
    data: postBanner,
    isLoading: postBannerLoading,
    isSuccess: postBannerSuccess,
    error: postBannerError,
    isError: postBannerIsError,
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
  } = useMutation(({url, formData}) => apiService.postData(url, formData),{

    onError: (error) => message.error(error.message,'Rasmning JPG,JPEG,PNG formatlariga ruxsat etilgan')
  });
  // query-edit

  const {
    isLoading: editBannerLoading,
    data: editBannerData,
    refetch: editBannerRefetch,
    isSuccess: editBannerSuccess,
  } = useQuery(
    ['edit-banner', editId],
    () => apiService.getData('/banner'),
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
    error: putBannerError,
    isError: putBannerIsError,
  } = useMutation(({url, data, id}) => apiService.editData(url, data, id),{
    onError: (error) => message.error(error.message)
  });
  // delete-image-query
  const {mutate: imagesDeleteMutate} = useMutation(({url, ids}) => apiService.deleteImages(url, ids),{
    onSuccess: () => message.success('Success'),
    onError: (error) => message.error(error.message)
      }
  );

  // product success
  useEffect(() => {
    let delImage=[]
    if (putBannerSuccess) {
      dispatch({type: EDIT_DATA, payload: ''});
    }
    if (editBannerSuccess && deleteImage?.uid) {
      delImage.push(deleteImage?.uid)
    }
    if (editBannerSuccess && deleteImage2?.uid) {
      delImage.push(deleteImage2?.uid)
    }
    if (editBannerSuccess && deleteImage3?.uid) {
      delImage.push(deleteImage3?.uid)
    }


    if (editBannerSuccess && (deleteImage?.uid || deleteImage2?.uid || deleteImage3?.uid) ) {
      const ids={
        ids:delImage
      }
      imagesDeleteMutate({url: '/medias', ids});
    }

    if (postBannerSuccess || putBannerSuccess) {
     
      navigate('/banner');
    }
  }, [postBanner, putData]);

  //banner error
  useEffect(() => {
    if (postBannerIsError) {
      message.error(postBannerError.message);
    }
    if (putBannerIsError) {
      message.error(putBannerError.message);
    }
  }, [postBannerError, putBannerError]);

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
    const imageInitialLogo = [
      {
        uid: editBannerData?.imageLogo?._id,
        name: editBannerData?.imageLogo?.name,
        status: 'done',
        url: `${process.env.REACT_APP_API_URL}/${editBannerData?.imageLogo?.path}`,
      },
    ];
    const imageInitialBanner=[
      {
        uid: editBannerData?.imageBrand?._id,
        name: editBannerData?.imageBrand?.name,
        status: 'done',
        url: `${process.env.REACT_APP_API_URL}/${editBannerData?.imageBrand?.path}`,
      },
    ]
    const videoInitialBanner=[
      {
        uid: editBannerData?.videoBanner?._id,
        name: editBannerData?.videoBanner?.name,
        status: 'done',
        url: `${process.env.REACT_APP_API_URL}/${editBannerData?.videoBanner?.path}`,
      },
    ]
    if (editBannerSuccess) {
      const edit = {
        mediaLogoId: imageInitialLogo,
        mediaBrandId: imageInitialBanner,
        mediaVideoId:videoInitialBanner
      };
      setFileListProps(imageInitialLogo);
      setFileListProps2(imageInitialBanner);
      setFileListProps3(videoInitialBanner);
      form.setFieldsValue(edit);
    }
  }, [editBannerData]);

  // post product
  useEffect(() => {
    let imageLogo=""
    let imageBrand=""
    let videoBanner=""
    if (editBannerSuccess && imagesUploadSuccess && fileListProps[0]?.originFileObj?.uid) {
      imageLogo = imagesUpload[0]?._id;
    } else if (editBannerSuccess) {
      imageLogo = fileListProps[0]?.uid;
    }
    if (editBannerSuccess && imagesUploadSuccess && fileListProps2[0]?.originFileObj?.uid) {
      if (fileListProps3[0]?.originFileObj?.uid&& !fileListProps[0]?.originFileObj?.uid){
      imageBrand =  imagesUpload[0]?._id;
      }else{
        imageBrand = imagesUpload.length===3 ? imagesUpload[1]?._id : imagesUpload.length===2 ? imagesUpload[1]?._id : imagesUpload[0]?._id;

      }
    } else if (editBannerSuccess) {
      imageBrand = fileListProps2[0]?.uid;
    }
    if (editBannerSuccess && imagesUploadSuccess && fileListProps3[0]?.originFileObj?.uid) {
      videoBanner = imagesUpload.length===3 ? imagesUpload[2]?._id : imagesUpload.length===2 ? imagesUpload[1]?._id : imagesUpload[0]?._id;
    } else if (editBannerSuccess) {
      videoBanner = fileListProps3[0]?.uid;
    }
    if (!editBannerSuccess && imagesUpload){
      imageLogo=imagesUpload[0]?._id
      imageBrand=imagesUpload[1]?._id
      videoBanner=imagesUpload[2]?._id
    }
    const data = {
      mediaLogoId: imageLogo,
      mediaBrandId:imageBrand,
      mediaVideoId:videoBanner
    };
    if (imagesUploadSuccess && !editBannerSuccess) {
      postBannerMutate({url: '/banner', data});
    } else if (isNotEditImages || imagesUploadSuccess) {
      putBanner({url: '/banner', data, id: editId});
    }
  }, [imagesUpload, valuesForm]);

  const onFinish = (values) => {
    const formData = new FormData();

    let uploadNewImage = false;

    if (editBannerSuccess) {
      if (fileListProps[0]?.originFileObj?.uid && fileListProps2[0]?.originFileObj?.uid && fileListProps3[0]?.originFileObj?.uid) {
        uploadNewImage = true;
        formData.append('media', fileListProps[0]?.originFileObj);
        formData.append('media', fileListProps2[0]?.originFileObj);
        formData.append('media', fileListProps3[0]?.originFileObj);

        setIsNotEditImages(false);
        // setFileList(fileListProps);
      }else if (fileListProps[0]?.originFileObj?.uid && fileListProps2[0]?.originFileObj?.uid) {
        uploadNewImage = true;
        formData.append('media', fileListProps[0]?.originFileObj);
        formData.append('media', fileListProps2[0]?.originFileObj);

        setIsNotEditImages(false);
        // setFileList(fileListProps);
      }else if (fileListProps[0]?.originFileObj?.uid && fileListProps3[0]?.originFileObj?.uid) {
        uploadNewImage = true;
        formData.append('media', fileListProps[0]?.originFileObj);
        formData.append('media', fileListProps3[0]?.originFileObj);

        setIsNotEditImages(false);
        // setFileList(fileListProps);
      }
      else if (fileListProps2[0]?.originFileObj?.uid && fileListProps3[0]?.originFileObj?.uid) {
        uploadNewImage = true;
        formData.append('media', fileListProps2[0]?.originFileObj);
        formData.append('media', fileListProps3[0]?.originFileObj);

        setIsNotEditImages(false);
        // setFileList(fileListProps);
      }
      else if (fileListProps[0]?.originFileObj?.uid) {
        uploadNewImage = true;
        formData.append('media', fileListProps[0]?.originFileObj);

        setIsNotEditImages(false);
        // setFileList(fileListProps);
      } else if (fileListProps2[0]?.originFileObj?.uid) {
        uploadNewImage = true;
        formData.append('media', fileListProps2[0]?.originFileObj);

        setIsNotEditImages(false);
        // setFileList(fileListProps);
      } else if (fileListProps3[0]?.originFileObj?.uid) {
        uploadNewImage = true;
        formData.append('media', fileListProps3[0]?.originFileObj);

        setIsNotEditImages(false);
        // setFileList(fileListProps);
      }else {
        uploadNewImage = false;
        // setFileList(fileListProps);
        setIsNotEditImages(true);
      }
    } else {
      uploadNewImage = true;
      formData.append('media', fileListProps[0]?.originFileObj);
      formData.append('media', fileListProps2[0]?.originFileObj);
      formData.append('media', fileListProps3[0]?.originFileObj);
    }
    if (uploadNewImage && !imagesUploadSuccess) {
      imagesUploadMutate({url: '/medias', formData});
    }

    setValues(values);
  };
  const onFinishFailed = (errorInfo) => {
    console.log('Failed:', errorInfo);
  };
  const onChangeLogo = ({fileList: newFileList}) => {
    setFileListProps(newFileList);
    form.setFieldsValue({mediaLogoId: newFileList});
  };

  const onChangeBrand = ({fileList: newFileList}) => {
    setFileListProps2(newFileList);
    form.setFieldsValue({mediaBrandId: newFileList});
  };

  const onChangeBanner = ({fileList: newFileList}) => {
    setFileListProps3(newFileList);
    form.setFieldsValue({mediaVideoId: newFileList});
  };

  const handleRemoveImageLogo = (file) => {
    if (editBannerSuccess) {
      // form.setFieldsValue({mediaLogoId:[]})
      setDeleteImage(file);
    }
  };
  const handleRemoveImageBrand = (file) => {
    if (editBannerSuccess) {
      // form.setFieldsValue({mediaBrandId:[]})
      setDeleteImage2(file);
    }
  };
  const handleRemoveImageBanner = (file) => {
    if (editBannerSuccess) {
      setDeleteImage3(file);
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
      postBannerLoading ||
      editBannerLoading ||
      putBannerLoading ? (
        <AppLoader />
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
                  name={'mediaLogoId'}
                  rules={[{required: true, message: 'Требуется загрузка изображения логотипа'}]}>
                <ImgCrop rotationSlider>
                  <Upload
                      maxCount={1}
                      fileList={fileListProps}
                      listType='picture-card'
                      onChange={onChangeLogo}
                      onPreview={onPreview}
                      beforeUpload={() => false}
                      onRemove={handleRemoveImageLogo}>
                    {fileListProps.length>0 ? "" : "Upload"}
                  </Upload>
                </ImgCrop>
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                  label='Изображение бренда'
                  name={'mediaBrandId'}
                  rules={[{required: true, message: 'Требуется загрузка изображения бренда'}]}>
                <ImgCrop rotationSlider>
                  <Upload
                      maxCount={1}
                      fileList={fileListProps2}
                      listType='picture-card'
                      onChange={onChangeBrand}
                      onPreview={onPreview}
                      beforeUpload={() => false}
                      onRemove={handleRemoveImageBrand}>
                    {fileListProps2.length>0 ? "" : "Upload"}
                  </Upload>
                </ImgCrop>
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={20}>
            <Col span={24}>
              <Form.Item
                  label='Баннерное видео'
                  name={'mediaVideoId'}
                  rules={[{required: true, message: 'Требуется видеобаннер'}]}>

                  <Upload
                      maxCount={1}
                      accept="video/*"
                      fileList={fileListProps3}
                      listType='picture-card'
                      onChange={onChangeBanner}
                      onPreview={onPreview}
                      beforeUpload={() => false}
                      onRemove={handleRemoveImageBanner}>
                    {fileListProps3.length>0 ? "" : "Upload"}
                  </Upload>
              </Form.Item>
            </Col>

          </Row>

          <Button type='primary' htmlType='submit' style={{width: '100%'}}>
            {editBannerSuccess ? 'Edit' : 'Add'}
          </Button>
        </Form>
      )}
    </div>
  );
};

export default PostEditBanner;
