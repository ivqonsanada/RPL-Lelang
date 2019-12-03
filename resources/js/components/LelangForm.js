import React, { PureComponent } from 'react'
import {
    Form, Input, Icon, Button, Upload, message, DatePicker
} from 'antd';
import moment from 'moment';
const { RangePicker } = DatePicker;

import './ShopForm.css';

class LelangForm extends PureComponent {
    state = {
        confirmDirty: false,
        autoCompleteResult: [],
        loading: false
    };

    handleChange = (info) => {
        if (info.file.status === 'uploading') {
            this.setState({ loading: true });
            return;
        }
        if (info.file.status === 'done') {
            // Get this url from response in real world.
            getBase64(info.file.originFileObj, imageUrl => this.setState({
                imageUrl,
                loading: false,
            }));
        }
    }

    handleSubmit = (e) => {
        e.preventDefault();
        this.props.form.validateFieldsAndScroll((err, values) => {
            if (!err) {
                // console.log('Received values of form: ', values);
            }
        });
    }

    handleConfirmBlur = (e) => {
        const value = e.target.value;
        this.setState({ confirmDirty: this.state.confirmDirty || !!value });
    }

    compareToFirstPassword = (rule, value, callback) => {
        const form = this.props.form;
        if (value && value !== form.getFieldValue('password')) {
            callback('Two passwords that you enter is inconsistent!');
        } else {
            callback();
        }
    }

    validateToNextPassword = (rule, value, callback) => {
        const form = this.props.form;
        if (value && this.state.confirmDirty) {
            form.validateFields(['confirm'], { force: true });
        }
        callback();
    }
    beforeUpload(file) {

        const isLt2M = file.size / 1024 / 1024 < 2;
        if (!isLt2M) {
            message.error('Image must smaller than 2MB!');
        }
        isLt2M;
    }

    getBase64(img, callback) {
        const reader = new FileReader();
        reader.addEventListener('load', () => callback(reader.result));
        reader.readAsDataURL(img);
    }

    onChange(dates, dateStrings) {
        console.log('From: ', dates[0], ', to: ', dates[1]);
        console.log('From: ', dateStrings[0], ', to: ', dateStrings[1]);
    }

    render() {
        const { getFieldDecorator } = this.props.form;
        const { autoCompleteResult } = this.state;
        const imageUrl = this.state.imageUrl;
        const uploadButton = (
            <div>
                <Icon type={this.state.loading ? 'loading' : 'plus'} />
                <div className="ant-upload-text">Upload</div>
            </div>
        );

        return (
            <Form onSubmit={this.handleSubmit} style={{ padding: 0 }} >
                <Form.Item
                    colon={false}
                    label={(
                        <span style={{ fontSize: 20 }}>
                            Nama Barang:
                        </span>
                    )}
                >
                    {getFieldDecorator('nickname', {
                        rules: [{ required: true, whitespace: true }],
                    })(
                        <Input placeholder={'Nama Barang'} />
                    )}
                </Form.Item>
                <Form.Item
                    colon={false}
                    label={(
                        <span style={{ fontSize: 20 }}>Harga Awal:</span>
                    )}
                >
                    {getFieldDecorator('address', {
                        rules: [{ type: 'address', required: true, message: 'Mohon isi alamat anda!' }],
                    })(
                        <Input placeholder={"Masukkan Alamat Anda"} >

                        </Input>
                    )}
                </Form.Item>
                <Form.Item
                    colon={false}
                    label={(
                        <span style={{ fontSize: 20 }}>Kelipatan Penawaran:</span>
                    )}        >
                    {getFieldDecorator('zipcode', {
                        rules: [{ type: 'zipcode', required: true, message: 'Mohon isi kodepos anda!' }],
                    })(
                        <Input placeholder={"Masukkan kelipatan "} >

                        </Input>
                    )}
                </Form.Item>
                <Form.Item
                    colon={false}
                    label={(
                        <span style={{ fontSize: 20 }}>Waktu Akhir Lelang:</span>
                    )}        >
                    {getFieldDecorator('phone', {
                        rules: [{ required: true, message: 'Please input your phone number!' }],
                    })(
                        <RangePicker
                            ranges={{
                                Today: [moment(), moment()],
                                'This Month': [moment().startOf('month'), moment().endOf('month')],
                            }}
                            showTime
                            format="YYYY/MM/DD HH:mm:ss"
                            onChange={this.onChange}
                        />
                    )}


                </Form.Item>

                {/* <Form.Item
                    colon={false}
                    label={(
                        <span style={{ fontSize: 20 }}>Foto Barang</span>

                    )}>
                    {getFieldDecorator('Avatar', {
                        rules: [{ required: true, message: 'Please Select Shop Image!' }],
                    })(

                        <Upload
                            name="avatar"
                            listType="picture-card"
                            className="avatar-uploader"
                            showUploadList={true}
                        >
                            {imageUrl ? <img src={imageUrl} alt="avatar" /> : uploadButton}
                        </Upload>
                    )}

                </Form.Item> */}
                <Form.Item >
                    <Button block type="primary" htmlType="submit">Lelang</Button>
                </Form.Item>
            </Form >
        );
    }
}

const WrappedLelangForm = Form.create({ name: 'register' })(LelangForm);

export default WrappedLelangForm;
