import {Tag, Table,message,Spin} from 'antd';
import apiService from "../../../@crema/services/apis/api";
import { useQuery} from "react-query";
import { useEffect, useState } from "react";

const columns = [
  {
    title: 'Company name',
    dataIndex: 'nameEnterprises',
    key: 'nameEnterprises',
    render: (text) => <p>{text}</p>,
  },
  {
    title: 'Region',
    dataIndex: 'region',
    key: 'region',
    render: (text) => <Tag>{text}</Tag>,
  },
  {
    title: 'Address',
    dataIndex: 'address',
    key: 'address',
    render: (text) => <p>{text}</p>,
  },
  {
    title: 'Contact Person',
    dataIndex: 'contactPerson',
    key: 'contactPerson',
    render: (text) => <p>{text}</p>,
  },
  {
    title: 'Contact Phone',
    dataIndex: 'contactPhone',
    key: 'contactPhone',
    render: (text) => <Tag>{text}</Tag>,
  },
  {
    title: 'Car Experience',
    dataIndex: 'carExperience',
    key: 'carExperience',
    render: (text) => <p>{text}</p>,
  },
  {
    title: 'Sales Month',
    dataIndex: 'salesMonth',
    key: 'salesMonth',
    render: (text) => <p>{text}</p>,
  }
];



const Orders = () => {
  const {data, isLoading} = useQuery(
    'dealer-get',
    () => apiService.getData('/dealers'),
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
