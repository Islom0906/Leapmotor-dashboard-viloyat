  import React, {useEffect, useState} from 'react';
import NewsTable from './NewsTable';
import {Button, Col, Input, message, Row, Space, Spin} from 'antd';
import {PlusOutlined} from '@ant-design/icons';
import {useNavigate} from 'react-router-dom';
import apiService from '../../../@crema/services/apis/api';
import {useMutation, useQuery} from 'react-query';
import {EDIT_DATA} from '../../../shared/constants/ActionTypes';
import {useDispatch} from 'react-redux';

const Index = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const {
    mutate,
    isSuccess,
    isLoading: deleteCategoryLoading,
  } = useMutation(({url, id}) => apiService.deleteData(url, id));
  const {
    data,
    isLoading: getCategoryLoading,
    refetch,
  } = useQuery('news-get', () => apiService.getData('/news'), {
    // enabled:false,
    onError: (error) => {

      message.error(error);
      // Handle the error
    },
  });
  console.log(data)
  const [search, setSearch] = useState([]);
  const [isSearch, setIsSearch] = useState(false);
  const deleteHandle = (url, id) => {
    mutate({url, id});
  };

  useEffect(() => {
    if (isSuccess) {
      refetch();
    }
  }, [isSuccess]);

  const addArticle = () => {
    dispatch({type: EDIT_DATA, payload: ''});
    navigate('/news/add');
  };
  const serachProduct = (value) => {
    if (value === '') {
      setIsSearch(false);
    } else {
      setIsSearch(true);
    }

    const filterData = data?.filter(
      (data) =>
        data.titleRu.toLowerCase().includes(value.toLowerCase()) ||
        data.titleUz.toLowerCase().includes(value.toLowerCase()),
    );
    setSearch(filterData);
  };

  return (
    <div className={'site-space-compact-wrapper'}>
      <Space direction={'vertical'} style={{width: '100%'}}>
        <Row gutter={20}>
          <Col span={16}>
            <Input onChange={(e) => serachProduct(e.target.value)} />
          </Col>
          <Col span={8}>
            <Button
              type='primary'
              icon={<PlusOutlined />}
              style={{width: '100%'}}
              onClick={addArticle}>
              Add
            </Button>
          </Col>
        </Row>
        <Spin
          size='medium'
          spinning={getCategoryLoading || deleteCategoryLoading}>
          <NewsTable
            data={isSearch ? search : data}
            deleteHandle={deleteHandle}
          />
        </Spin>
      </Space>
    </div>
  );
};

export default Index;
