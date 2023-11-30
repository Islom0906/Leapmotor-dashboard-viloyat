import {Tag, Table,message,Spin} from 'antd';
import apiService from "../../../@crema/services/apis/api";
import { useQuery} from "react-query";
import { useEffect, useState } from "react";

const columns = [
  {
    title: 'Model',
    dataIndex: 'model',
    key: 'model',
    render: (text) => <p>{text}</p>,
  },
  {
    title: 'Region',
    dataIndex: 'region',
    key: 'region',
    render: (text) => <Tag>{text}</Tag>,
  },
  {
    title: 'Dealer',
    dataIndex: 'dealer',
    key: 'dealer',
    render: (text) => <p>{text}</p>,
  },
  {
    title: 'Day',
    dataIndex: 'day',
    key: 'day',
    render: (text) => <p>{text}</p>,
  },
  {
    title: 'Hour',
    dataIndex: 'hour',
    key: 'hour',
    render: (text) => <Tag>{text}</Tag>,
  },
  {
    title: 'Name',
    dataIndex: 'name',
    key: 'name',
    render: (text) => <p>{text}</p>,
  },
  {
    title: 'Tel',
    dataIndex: 'tel',
    key: 'tel',
    render: (text) => <p>{text}</p>,
  }
];



const Orders = () => {
  const {data, isLoading} = useQuery(
    'testdrive-get',
    () => apiService.getData('/testDrive'),
    {
      // enabled:false,
      onError: (error) => {

        console.log(error)
      message.error(error);
        // Handle the error
      },
    },
  );
  const [reverseData,setReverseData]=useState([])


  useEffect(()=>{
    const reverse=data?.reverse()
    setReverseData(reverse)
},[data])

  return (
    <div>
      <Spin size='medium' spinning={isLoading}>
        <Table
          columns={columns}
          dataSource={reverseData}
          rowKey={(record) => record?._id}
        />
      </Spin>
    </div>
  );
};

export default Orders;
