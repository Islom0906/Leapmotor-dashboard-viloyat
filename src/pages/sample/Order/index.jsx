import {Tag, Table, message, Spin, Space} from 'antd';
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
    title: 'Position',
    dataIndex: 'position',
    key: 'position',
    render: (text) => <p>{text}</p>,
  },
  {
    title: 'Exterior',
    dataIndex: 'exterior',
    key: 'exterior',
    render: (text) => <p>{text}</p>,
  },
  {
    title: 'Interior',
    dataIndex: 'interior',
    key: 'interior',
    render: (text) => <p>{text}</p>,
  },
  {
    title: 'Option',
    dataIndex: 'option',
    key: 'option',
    render: (text) => {
      return  text.map((item,ind)=>(
          <Space key={ind} direction={"vertical"} style={{
            display: 'flex'
          }}>
          <Tag >{item}</Tag>
          </Space>
      ))
    },
  },
  {
    title: 'Price',
    dataIndex: 'price',
    key: 'price',
    render: (text) => <p>{text}</p>,
  },

];



const Orders = () => {
  const {data, isLoading} = useQuery(
    'order-get',
    () => apiService.getData('/order'),
    {
      // enabled:false,
      onError: (error) => {

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
