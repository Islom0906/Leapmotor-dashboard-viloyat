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
  titleRu:"",
  titleUz:"",
  mediaId:""
};



const PostEditFilial = () => {
  const [form] = Form.useForm();
  const navigate = useNavigate();
  const {editId} = useSelector((state) => state.editData);
  const dispatch = useDispatch();

  const [fileListProps, setFileListProps] = useState([]);
  const [valuesForm, setValues] = useState({});
  const [isNotEditImages, setIsNotEditImages] = useState(false);
  const [deleteImage, setDeleteImage] = useState({});
  // query-filial
  const {
    mutate: postFilialMutate,
    data: postFilial,
    isLoading: postFilialLoading,
    isSuccess: postFilialSuccess,
    error: postFilialError,
    isError: postFilialIsError,
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
    isLoading: editFilialLoading,
    data: editFilialtData,
    refetch: editFilialRefetch,
    isSuccess: editFilialtSuccess,
  } = useQuery(
    ['edit-filial', editId],
    () => apiService.getDataByID('/filial', editId),
    {
      enabled: false,
    },
  );
  // put-query
  const {
    mutate: putFilial,
    isLoading: putFilialLoading,
    data: putData,
    isSuccess: putFilialSuccess,
    error: putFilialError,
    isError: putFilialIsError,
  } = useMutation(({url, data, id}) => apiService.editData(url, data, id),{
    onError: (error) => message.error(error.message)
  });
  // delete-image-query
  const {mutate: imagesDeleteMutate} = useMutation(({url, ids}) => apiService.deleteImages(url, ids),{
    onSuccess: () => message.success('Success'),
    onError: (error) => message.error(error.message)
      }
  );

  // filial success
  useEffect(() => {
    let delImage=[]
    if (putFilialSuccess) {
      dispatch({type: EDIT_DATA, payload: ''});
    }
    if (editFilialtSuccess && deleteImage?.uid) {
      delImage.push(deleteImage?.uid)
    }
    if (editFilialtSuccess && deleteImage?.uid ) {
      const ids={
        ids:delImage
      }
      imagesDeleteMutate({url: '/medias', ids});
    }

    if (postFilialSuccess || putFilialSuccess) {
     
      navigate('/filial');
    }
  }, [postFilial, putData]);

  // filial error
  useEffect(() => {
    if (postFilialIsError) {
      message.error(postFilialError.message);
    }
    if (putFilialIsError) {
      message.error(putFilialError.message);
    }
  }, [postFilialError, putFilialError]);

  // if edit filial
  useEffect(() => {
    if (editId !== '') {
      editFilialRefetch();
    }
  }, [editId]);

  // if no edit filial
  useEffect(() => {
    if (editId === '') {
      form.setFieldsValue(initialValueForm);
    }
  }, []);

  //edit filial
  useEffect(() => {
    const imageInitial = [
      {
        uid: editFilialtData?.image?._id,
        name: editFilialtData?.image?.name,
        status: 'done',
        url: `${process.env.REACT_APP_API_URL}/${editFilialtData?.image?.path}`,
      },
    ];

    if (editFilialtSuccess) {
      const edit = {
        titleRu: editFilialtData?.titleRu,
        titleUz: editFilialtData?.titleUz,
        mediaId: imageInitial,
      };
      setFileListProps(imageInitial);
      form.setFieldsValue(edit);
    }
  }, [editFilialtData]);

  // post filial
  useEffect(() => {
    let image=""
    if (editFilialtSuccess && imagesUploadSuccess && fileListProps[0]?.originFileObj?.uid) {
      image = imagesUpload[0]?._id;
    } else if (editFilialtSuccess) {
      image = fileListProps[0]?.uid;
    }

    if (!editFilialtSuccess && imagesUpload){
      image=imagesUpload[0]?._id
    }
    const data = {
      titleRu: valuesForm.titleRu,
      titleUz: valuesForm.titleUz,
      mediaId:image,

    };

    if (imagesUploadSuccess && !editFilialtSuccess) {
      postFilialMutate({url: '/filial', data});
    } else if (isNotEditImages || imagesUploadSuccess) {
      putFilial({url: '/filial', data, id: editId});
    }
  }, [imagesUpload, valuesForm]);

  const onFinish = (values) => {
    const formData = new FormData();

    let uploadNewImage = false;

    if (editFilialtSuccess) {
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
      uploadNewImage = true;
      formData.append('media', fileListProps[0]?.originFileObj);
    }
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
    if (editFilialtSuccess) {
      setDeleteImage(file);
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
      postFilialLoading ||
      editFilialLoading ||
      putFilialLoading ? (
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
                name='titleRu'
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
                name='titleUz'
                rules={[
                  {
                    required: true,
                    message: 'Text kiritish talab qilinadi Ru!',
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
                  name={'mediaId'}
                  rules={[{required: true, message: 'Требуется загрузка изображения логотипа'}]}>
                <ImgCrop rotationSlider>
                  <Upload
                      maxCount={1}
                      fileList={fileListProps}
                      listType='picture-card'
                      onChange={onChange}
                      onPreview={onPreview}
                      beforeUpload={() => false}
                      onRemove={handleRemoveImage}>
                    {fileListProps.length>0 ? "" : "Upload"}
                  </Upload>
                </ImgCrop>
              </Form.Item>
            </Col>

          </Row>

          <Button type='primary' htmlType='submit' style={{width: '100%'}}>
            {editFilialtSuccess ? 'Edit' : 'Add'}
          </Button>
        </Form>
      )}
    </div>
  );
};

export default PostEditFilial;
