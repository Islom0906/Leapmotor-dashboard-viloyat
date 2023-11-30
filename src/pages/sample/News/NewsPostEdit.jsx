import React, {useEffect, useState} from 'react';
import {Button, Col, Form, Input, message, Row, Space, Upload,} from "antd";
import {EditorState} from "draft-js";
import {convertFromHTML, convertToHTML} from "draft-convert";
import {Editor} from "react-draft-wysiwyg";
import "react-draft-wysiwyg/dist/react-draft-wysiwyg.css";
import './NewsPostEdit.css'

import {useMutation, useQuery} from "react-query";
import apiService from "../../../@crema/services/apis/api";
import {AppLoader} from "../../../@crema";
import {useNavigate} from "react-router-dom";
import {useDispatch, useSelector} from "react-redux";
import {EDIT_DATA} from "../../../shared/constants/ActionTypes";
import ImgCrop from "antd-img-crop";

import {MinusCircleOutlined} from "@ant-design/icons";

const initialValueForm = {
    titleUz: "",
    titleRu: "",
    description: [
        {
            textRu: "",
            textUz: "",
            mediaId: []
        }
    ],
};


const NewsPostEdit = () => {
    const [form] = Form.useForm();
    const navigate = useNavigate()
    const {editId} = useSelector(state => state.editData)
    const dispatch = useDispatch()


    const [fileListBody, setFileListBody] = useState([]);
    const [fileListBodyProps, setFileListBodyProps] = useState([]);
    const [editorStatesUz, setEditorStatesUz] = useState([]);
    const [editorStatesRu, setEditorStatesRu] = useState([]);
    const [mainIndex, setMainIndex] = useState(0);

    // query-map
    const {
        mutate: postMapMutate,
        data: postMap,
        isLoading: postMapLoading,
        isSuccess: postMapSuccess,
        error: postMapError,
        isError: postMapIsError
    } = useMutation(({url, data}) => apiService.postData(url, data), {
        onSuccess: () => {

            message.success('Success')
        },
        onError: (error) => {

            message.error(error)
        }
    });

    // query-edit
    const {
        isLoading: editMapLoading,
        data: editMapData,
        refetch: editMapRefetch,
        isSuccess: editMapSuccess,
        error: putMapError,
        isError: putMapIsError
    } = useQuery(["edit-map", editId], () => apiService.getDataByID("/news", editId), {
        enabled: false
    });
    // query-image
    const {
        mutate: imagesUploadMutate,
        data: imagesUpload,
        isLoading: imagesUploadLoading,
        isSuccess: imagesUploadSuccess,
    } = useMutation(({url, formData}) => apiService.postData(url, formData), {
        onSuccess: () => {

            message.success('Success')
        },
        onError: (error) => message.error(error.message, 'Rasmning JPG,JPEG,PNG formatlariga ruxsat etilgan')
    });
    // put-query
    const {
        mutate: putMap,
        isLoading: putMapLoading,
        data: putData,
        isSuccess: putMapSuccess
    } = useMutation(({
                         url,
                         data,
                         id
                     }) => apiService.editData(url, data, id));
    const {mutate: imagesDeleteMutate} = useMutation(({url, ids}) => apiService.deleteImages(url, ids), {
            onSuccess: () => message.success('Success'),
            onError: (error) => {

                message.error(error.message)
            }
        }
    );


    // map success
    useEffect(() => {
        if (putMapSuccess) {
            dispatch({type: EDIT_DATA, payload: ""})
        }

        if (postMapSuccess || putMapSuccess) {

            navigate('/news')
        }
    }, [postMap, putData])

    // map error
    useEffect(() => {
        if (postMapIsError) {
            message.error(postMapError.message)
        }
        if (putMapIsError) {
            message.error(putMapError.message)
        }
    }, [postMapError, putMapError])


    // if edit map
    useEffect(() => {
        if (editId !== "") {
            editMapRefetch();
        }
    }, [editId]);

    // if no edit map
    useEffect(() => {
        if (editId === "") {
            form.setFieldsValue(initialValueForm)
        }
    }, []);


    useEffect(() => {
        const uploadFilesState = [...fileListBody];
        if (imagesUploadSuccess) {
            uploadFilesState[mainIndex] = imagesUpload[0];
            setFileListBody(uploadFilesState);

        }
    }, [imagesUpload]);


    //edit map
    useEffect(() => {
        const data = editMapData
        const initialEditorUz = [];
        const initialEditorRu = [];
        const initialFileListBodyProps = [];
        const initialFileListBody = [];
        if (data !== undefined) {
            for (let i = 0; i < data?.description?.length; i++) {
                const editDefaultImages = [{
                    uid: data?.description[i]?.image?._id,
                    name: data?.description[i]?.image?.name,
                    status: "done",
                    url: `${process.env.REACT_APP_API_URL}/${data?.description[i]?.image?.path}`
                }];

                initialEditorUz.push(EditorState.createWithContent(convertFromHTML(data?.description[i]?.textUz)));
                initialEditorRu.push(EditorState.createWithContent(convertFromHTML(data?.description[i]?.textRu)));
                initialFileListBodyProps.push(editDefaultImages);
                initialFileListBody.push(data?.description[i]?.image);
            }
        }
        // initial main image

        const bodyDefault = data?.description.map(description => {
            return {
                textUz: description.textUz,
                textRu: description.textRu,
                mediaId: description.image
            };
        });

        if (editMapSuccess) {
            const edit = {
                titleUz: data?.titleUz,
                titleRu: data?.titleRu,
                description: bodyDefault,
            };
            setFileListBody(initialFileListBody);
            setFileListBodyProps(initialFileListBodyProps);
            setEditorStatesUz(initialEditorUz);
            setEditorStatesRu(initialEditorRu);
            form.setFieldsValue(edit);
        }
    }, [editMapData])


    const onFinish = (values) => {

        const itemsWithHtmlContentUz = editorStatesUz.map((state) => {
            return convertToHTML(state.getCurrentContent());
        });
        const itemsWithHtmlContentRu = editorStatesRu.map((state) => {
            return convertToHTML(state.getCurrentContent());
        });
        const description = [];

        for (let i = 0; i < itemsWithHtmlContentUz.length; i++) {
            const item = {
                "textUz": itemsWithHtmlContentUz[i],
                "textRu": itemsWithHtmlContentRu[i],
                "mediaId": fileListBody[i]?._id
            };
            description.push(item);
        }

        const data = {
            description,
            titleUz: values?.titleUz,
            titleRu: values?.titleRu
        };
        if (editMapSuccess) {
            putMap({url: "/news", data, id: editMapData?._id});
        } else {
            postMapMutate({url: "/news", data});
        }


    }
    const onFinishFailed = (errorInfo) => {
        console.log("Failed:", errorInfo);
    };


    const handleRemove = (name, remove, index, editorStateUz, editorStateRu, editorFileList) => {
        if (editorStateUz === editorStatesUz[index]) {
            editorStatesUz.splice(index, 1);
        }
        if (editorStateRu === editorStatesRu[index]) {
            editorStatesRu.splice(index, 1);
        }
        if (editorFileList === fileListBodyProps[index]) {
            const id = [fileListBody[index]._id];
            const ids={
                ids:id
            }
            fileListBodyProps.splice(index, 1);
            fileListBody.splice(index, 1);
            imagesDeleteMutate({url: "/medias", ids});
        }
        remove(name);
    };


    // refresh page again get data

    useEffect(() => {
        const storedValues = JSON.parse(localStorage.getItem('myFormValues'));
        if (storedValues) {
            storedValues.images = []
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
            localStorage.removeItem('editDataId')
            localStorage.removeItem('myFormValues')
            window.removeEventListener('beforeunload', handleBeforeUnload);
        }
    }, []);

    // Handle editor state change
    const onEditorStateChangeUz = (index, editorState) => {
        const updatedEditorStates = [...editorStatesUz];
        updatedEditorStates[index] = editorState;
        setEditorStatesUz(updatedEditorStates);
    };
    const onEditorStateChangeRu = (index, editorState) => {
        const updatedEditorStates = [...editorStatesRu];
        updatedEditorStates[index] = editorState;
        setEditorStatesRu(updatedEditorStates);
    };

    const onChangeBodyImage = (index, {fileList: newFileList}) => {
        setMainIndex(index);

        const getValue = form.getFieldsValue();
        const itemsValue = getValue.description;
        itemsValue[index].mediaId = newFileList;
        form.setFieldsValue({description: itemsValue});

        const updateImageStates = [...fileListBodyProps];
        updateImageStates[index] = newFileList;
        setFileListBodyProps(updateImageStates);

        if (fileListBody[index] || newFileList.length === 0) {
            const id = [fileListBody[index]?._id];
            const ids={
                ids:id
            }
            imagesDeleteMutate({url: "/medias", ids});
            fileListBody[index] = null;
            setFileListBody(fileListBody);

        }
        const formData = new FormData();
        if (newFileList.length !== 0) {
            formData.append("media", newFileList[0].originFileObj);
            imagesUploadMutate({url: "/medias", formData});

        }
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

    return (
        <div>
            {(postMapLoading || editMapLoading || putMapLoading || imagesUploadLoading) ?
                <AppLoader/> :
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
                                label="Название статьи Ru"
                                name="titleRu"
                                rules={[
                                    {
                                        required: true,
                                        message: "Требуется название статьи"
                                    }
                                ]}
                            >
                                <Input/>
                            </Form.Item>
                        </Col>
                        <Col span={12}>
                            <Form.Item
                                label="Maqola sarlavhasi uz"
                                name="titleUz"
                                rules={[
                                    {
                                        required: true,
                                        message: "Maqola sarlavhasi talab qilinadi"
                                    }
                                ]}
                            >
                                <Input/>
                            </Form.Item>
                        </Col>
                    </Row>


                    <Form.List name="description">
                        {(fields, {add, remove}) => (
                            <>
                                {fields.map((field, index) => {
                                    const editorStateUz = editorStatesUz[index] || EditorState.createEmpty();
                                    const editorStateRu = editorStatesRu[index] || EditorState.createEmpty();
                                    const editorFileList = fileListBodyProps[index] || [];
                                    return (
                                        <div key={field.fieldKey} style={{marginBottom: 20}}>
                                            <Space align={"start"}>


                                                <Form.Item
                                                    label={`Maqola matn ${index + 1}`}
                                                    name={[field.name, "textUz"]}
                                                    rules={[
                                                        {required: true, message: "Maqola matn talab qilinadi"}
                                                    ]}
                                                    style={{width: "100%"}}
                                                >
                                                    <Editor
                                                        editorState={editorStateUz}
                                                        onEditorStateChange={(state) => onEditorStateChangeUz(index, state)}
                                                        editorClassName="editor-class"
                                                        toolbarClassName="toolbar-class"
                                                    />
                                                </Form.Item>
                                                <Form.Item
                                                    label={`Текст статьи ${index + 1}`}
                                                    name={[field.name, "textRu"]}
                                                    rules={[
                                                        {required: true, message: "Требуется текст статьи"}
                                                    ]}
                                                >
                                                    <Editor
                                                        editorState={editorStateRu}
                                                        onEditorStateChange={(state) => onEditorStateChangeRu(index, state)}
                                                        editorClassName="editor-class"
                                                        toolbarClassName="toolbar-class"
                                                    />
                                                </Form.Item>
                                            </Space>
                                            <Form.Item
                                                label={`(Изображение для текста статьи) ${index + 1}`}
                                                name={[field.name, "mediaId"]}
                                                rules={[
                                                    {
                                                        required: true,
                                                        message: "Для текста статьи необходимо изображение"
                                                    }
                                                ]}
                                            >
                                                <ImgCrop rotate>
                                                    <Upload
                                                        maxCount={1}
                                                        listType="picture-card"
                                                        fileList={editorFileList}
                                                        onChange={(newFileList) => onChangeBodyImage(index, newFileList)}
                                                        onPreview={onPreview}
                                                        beforeUpload={() => false}
                                                    >
                                                        {editorFileList.length < 1 && "+ Upload"}
                                                    </Upload>
                                                </ImgCrop>
                                            </Form.Item>

                                            <MinusCircleOutlined
                                                onClick={() => handleRemove(field.name, remove, index, editorStateUz, editorStateRu, editorFileList)}/>
                                        </div>

                                    );
                                })}
                                <Form.Item>
                                    <Button type="dashed" onClick={() => add()} block>
                                        Add Item
                                    </Button>
                                </Form.Item>

                            </>
                        )}
                    </Form.List>

                    <Button type="primary" htmlType="submit" style={{width: "100%", marginTop: "20px"}}>
                        {
                            editMapSuccess ? 'Edit' : 'Add'
                        }
                    </Button>
                </Form>
            }
        </div>
    );
};

export default NewsPostEdit;