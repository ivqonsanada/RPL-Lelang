import React, { PureComponent } from 'react'
import {
  Form, Input, Tooltip, Icon, DatePicker, Select, Row, Col, Checkbox, Button, AutoComplete,
} from 'antd';


class RegistrationForm extends PureComponent {
  state = {
    confirmDirty: false,
    autoCompleteResult: [],
  };

  handleSubmit = (e) => {
    e.preventDefault();
    this.props.form.validateFieldsAndScroll((err, values) => {
      if (!err) {
        console.log('Received values of form: ', values);
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



  render() {
    const { getFieldDecorator } = this.props.form;
    const { autoCompleteResult } = this.state;

    const formItemLayout = {
      labelCol: {
        xs: { span: 24 },
        sm: { span: 8 },
        md: { span: 12 },
        lg: { span: 10 },
        xl: { span: 4 },
        xxl: { span: 8 },
      },
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 16 },
        md: { span: 12 },
        lg: { span: 14 },
        xl: { span: 20 },
        xxl: { span: 16 },

      },
    };
    const tailFormItemLayout = {
      wrapperCol: {
        xs: {
          span: 24,
          offset: 0,
        },
        sm: {
          span: 16,
          offset: 8,
        },
        md: {
          span: 16,
          offset: 8
        },
        lg: {
          span: 16,
          offset: 8,
        },
        xl: {
          span: 16,
          offset: 8,
        },
        xxl: {
          span: 20,
          offset: 4
        }
      },
    };



    return (
      <Form onSubmit={this.handleSubmit} style={{ padding: 0 }} >
        <Form.Item
        colon={false}
          label={(
            <span style={{fontSize:20}}>Email :</span>
          )}
          style={{ marginBottom: '0px' }}
        >
          {getFieldDecorator('email', {
            rules: [{
              type: 'email', message: 'Pastikan email Valid',
            }, {
              required: true, message: 'Masukkan Email Anda',
            }],
          })(
            <Input />
          )}
        </Form.Item>
        <Form.Item
 label={(
            <span style={{fontSize:20}}>Password :</span>
          )}          style={{ marginBottom: '0px' }}
        >
          {getFieldDecorator('password', {
            rules: [{
              required: true, message: 'Masukkan password!',
            }, {
              validator: this.validateToNextPassword,
            }],
          })(
            <Input type="password" />
          )}
        </Form.Item>
        <Form.Item
 label={(
            <span style={{fontSize:20}}>Konfirmasi Password :</span>
          )}
          style={{ marginBottom: '0px' }}
        >
          {getFieldDecorator('confirm', {
            rules: [{
              required: true, message: 'pastikan password sama!',
            }, {
              validator: this.compareToFirstPassword,
            }],
          })(
            <Input type="password" onBlur={this.handleConfirmBlur} />
          )}
        </Form.Item>
        <Form.Item
          colon={false}
          label={(
            
            <span style={{fontSize:20}}>
              Nama Toko :
              <Tooltip title="Nama toko dapat diatur kembali nanti">
                <Icon type="question-circle-o" />
              </Tooltip>
            </span>
          )}
          style={{ marginBottom: '0px' }}
        >
          {getFieldDecorator('nickname', {
            rules: [{ required: false, whitespace: true }],
          })(
            <Input />
          )}
        </Form.Item>
        <Form.Item
           label={(
            <span style={{fontSize:20}}>Alamat :</span>
          )}
          style={{ marginBottom: '0px' }}
        >
          {getFieldDecorator('address', {
            rules: [{ type: 'address', required: true, message: 'Mohon isi alamat anda!' }],
          })(
            <Input placeholder={"Masukkan Alamat Anda"} >

            </Input>
          )}
        </Form.Item>
        <Form.Item
          style={{ marginBottom: '0px' }}
          label={(
            <span style={{fontSize:20}}>Kode Pos :</span>
          )}        >
          {getFieldDecorator('zipcode', {
            rules: [{ type: 'zipcode', required: true, message: 'Mohon isi kodepos anda!' }],
          })(
            <Input placeholder={"Masukkan Alamat Anda"} >

            </Input>
          )}
        </Form.Item>
        <Form.Item
          style={{ marginBottom: '0px' }}
          label={(
            <span style={{fontSize:20}}>Nomor Telepon :</span>
          )}        >
          {getFieldDecorator('phone', {
            rules: [{ required: true, message: 'Please input your phone number!' }],
          })(
            <Input addonBefore={"+62"} style={{ width: '100%' }} />
          )}
        </Form.Item>
        <Form.Item
          style={{ marginBottom: '0px' }}
          label={(
            <span style={{fontSize:20}}>Tanggal Lahir :</span>
          )}        >
          {getFieldDecorator('date-picker', {
            rules: [{ type: 'object', required: true, message: 'Please select time!' }],
          })(
            <DatePicker />
          )}
        </Form.Item>

        <Form.Item
          style={{ marginBottom: '0px' }} >

          <Button block type="primary" htmlType="submit">Register</Button>
        </Form.Item>
      </Form>
    );
  }
}

const WrappedRegistrationForm = Form.create({ name: 'register' })(RegistrationForm);

export default class Register extends PureComponent {
  render() {
    return (
      <Row>
        <Col sm={{ span: 4 }} md={{ span: 6 }} lg={{ span: 6 }} xl={{ span: 8 }} xxl={{ span: 8 }} >
        </Col>

        <Col sm={{ span: 16 }} md={{ span: 12 }} lg={{ span: 12 }} xl={{ span: 8 }} xxl={{ span: 8 }}>
          <h3 style={{ textAlign: 'center' }}>Daftar akun baru sekarang</h3>
          <WrappedRegistrationForm />
        </Col>

        <Col sm={{ span: 4 }} md={{ span: 6 }} lg={{ span: 6 }} xl={{ span: 12 }} xxl={{ span: 12 }}>


        </Col>
      </Row>

    )
  }
}


const { Option } = Select;
const AutoCompleteOption = AutoComplete.Option;

