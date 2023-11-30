import React, {useEffect, useState} from 'react';
import {Button, Col, Form, Input, message, Row, Upload} from 'antd';
import ImgCrop from 'antd-img-crop';
import {useMutation, useQuery} from 'react-query';
import apiService from '../../../@crema/services/apis/api';
import {AppLoader} from '../../../@crema';
import {useNavigate} from 'react-router-dom';
import {useDispatch, useSelector} from 'react-redux';
import {EDIT_DATA} from '../../../shared/constants/ActionTypes';

const initialValueForm = {
  textRu:"",
  textUz:"",
  model:"",
  mediaLogoId:"",
  mediaBannerId:""
};



const PostEditProduct = () => {
  const [form] = Form.useForm();
  const navigate = useNavigate();
  const {editId} = useSelector((state) => state.editData);
  const dispatch = useDispatch();

  const [fileListProps, setFileListProps] = useState([]);
  const [fileListProps2, setFileListProps2] = useState([]);
  const [valuesForm, setValues] = useState({});
  const [isNotEditImages, setIsNotEditImages] = useState(false);
  const [deleteImage, setDeleteImage] = useState({});
  const [deleteImage2, setDeleteImage2] = useState({});
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
    data: editProductData,
    refetch: editBannerRefetch,
    isSuccess: editProductSuccess,
  } = useQuery(
    ['edit-banner', editId],
    () => apiService.getDataByID('/product', editId),
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
    if (editProductSuccess && deleteImage?.uid) {
      delImage.push(deleteImage?.uid)
    }
    if (editProductSuccess && deleteImage2?.uid) {
      delImage.push(deleteImage2?.uid)
    }
    if (editProductSuccess && (deleteImage?.uid || deleteImage2?.uid)) {
      const ids={
        ids:delImage
      }
      imagesDeleteMutate({url: '/medias', ids});
    }

    if (postBannerSuccess || putBannerSuccess) {
     
      navigate('/product');
    }
  }, [postBanner, putData]);

  // product error
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
        uid: editProductData?.imageLogo?._id,
        name: editProductData?.imageLogo?.name,
        status: 'done',
        url: `${process.env.REACT_APP_API_URL}/${editProductData?.imageLogo?.path}`,
      },
    ];
    const imageInitialBanner=[
      {
        uid: editProductData?.imageBanner?._id,
        name: editProductData?.imageBanner?.name,
        status: 'done',
        url: `${process.env.REACT_APP_API_URL}/${editProductData?.imageBanner?.path}`,
      },
    ]
    if (editProductSuccess) {
      const edit = {
        textRu: editProductData?.textRu,
        textUz: editProductData?.textUz,
        model: editProductData?.model,
        mediaLogoId: imageInitialLogo,
        mediaBannerId: imageInitialBanner,
      };
      setFileListProps(imageInitialLogo);
      setFileListProps2(imageInitialBanner);
      form.setFieldsValue(edit);
    }
  }, [editProductData]);

  // post product
  useEffect(() => {
    let imageLogo=""
    let imageBanner=""
    if (editProductSuccess && imagesUploadSuccess && fileListProps[0]?.originFileObj?.uid) {
      imageLogo = imagesUpload[0]?._id;
    } else if (editProductSuccess) {
      imageLogo = fileListProps[0]?.uid;
    }
    if (editProductSuccess && imagesUploadSuccess && fileListProps2[0]?.originFileObj?.uid) {
      imageBanner = imagesUpload.length===2 ? imagesUpload[1]?._id : imagesUpload[0]?._id;
    } else if (editProductSuccess) {
      imageBanner = fileListProps2[0]?.uid;
    }
    if (!editProductSuccess && imagesUpload){
      imageLogo=imagesUpload[0]?._id
      imageBanner=imagesUpload[1]?._id
    }
    const data = {
      textRu: valuesForm.textRu,
      textUz: valuesForm.textUz,
      model:valuesForm.model,
      mediaLogoId: imageLogo,
      mediaBannerId:imageBanner
    };

    if (imagesUploadSuccess && !editProductSuccess) {
      postBannerMutate({url: '/product', data});
    } else if (isNotEditImages || imagesUploadSuccess) {
      putBanner({url: '/product', data, id: editId});
    }
  }, [imagesUpload, valuesForm]);

  const onFinish = (values) => {
    const formData = new FormData();

    let uploadNewImage = false;

    if (editProductSuccess) {
      if (fileListProps[0]?.originFileObj?.uid && fileListProps2[0]?.originFileObj?.uid) {
        uploadNewImage = true;
        formData.append('media', fileListProps[0]?.originFileObj);
        formData.append('media', fileListProps2[0]?.originFileObj);

        setIsNotEditImages(false);
        // setFileList(fileListProps);
      }else if (fileListProps[0]?.originFileObj?.uid) {
        uploadNewImage = true;
        formData.append('media', fileListProps[0]?.originFileObj);

        setIsNotEditImages(false);
        // setFileList(fileListProps);
      } else if (fileListProps2[0]?.originFileObj?.uid) {
        uploadNewImage = true;
        formData.append('media', fileListProps2[0]?.originFileObj);

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

  const onChangeBanner = ({fileList: newFileList}) => {
    setFileListProps2(newFileList);
    form.setFieldsValue({mediaBannerId: newFileList});
  };

  const handleRemoveImageLogo = (file) => {
    if (editProductSuccess) {
      setDeleteImage(file);
    }
  };
  const handleRemoveImageBanner = (file) => {
    if (editProductSuccess) {
      setDeleteImage2(file);
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
                label='Текст Ru'
                name='textRu'
                rules={[
                  {
                    required: true,
                    message: 'Требуется текст RU!',
                  },
                ]}>
                <Input />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                label='Text Uz'
                name='textUz'
                rules={[
                  {
                    required: true,
                    message: 'Text kiritish talab qilinadi Uz!',
                  },
                ]}>
                <Input />
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={20}>
            <Col span={24}>
              <Form.Item
                label='Model'
                name='model'
                rules={[
                  {
                    required: true,
                    message: 'Требуется ввод модели',
                  },
                ]}>
                <Input />
              </Form.Item>
            </Col>

          </Row>
          <Row gutter={20}>
            <Col span={12}>
              <Form.Item
                  label='Изображение логотипа'
                  name={'mediaLogoId'}
                  rules={[{required: true, message: 'Требуется загрузка изображения логотипа'}]}>
                <ImgCrop>
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
                  label='Изображение баннера'
                  name={'mediaBannerId'}
                  rules={[{required: true, message: 'Требуется загрузка изображения баннера'}]}>
                <ImgCrop rotate>
                  <Upload
                      maxCount={1}
                      fileList={fileListProps2}
                      listType='picture-card'
                      onChange={onChangeBanner}
                      onPreview={onPreview}
                      beforeUpload={() => false}
                      onRemove={handleRemoveImageBanner}>
                    {fileListProps2.length>0 ? "" : "Upload"}
                  </Upload>
                </ImgCrop>
              </Form.Item>
            </Col>
          </Row>

          <Button type='primary' htmlType='submit' style={{width: '100%'}}>
            {editProductSuccess ? 'Edit' : 'Add'}
          </Button>
        </Form>
      )}
    </div>
  );
};

export default PostEditProduct;
