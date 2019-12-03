import React, { Fragment, PureComponent } from 'react';
import {
    Form, Icon, Input, Button, Checkbox, Alert
} from 'antd';
import axios from 'axios';
import './FormLogin.css';
import API from '../api';

class FormLogin extends PureComponent {
    state = {
        status: false,
        loading: false,
    }
    handleSubmit = (e) => {
        e.preventDefault();
        this.props.form.validateFields(async (err, values) => {
            if (!err) {
                // console.log('Received values of form: ', values);
                // try catch method using async await
                this.setState({ loading: true })
                try {
                    const status = await axios.post(API.login, {
                        username: values.userName,
                        password: values.password
                    });
                    this.setState({ loading: false });
                    localStorage.token = status.data.token;
                    window.location.reload();
                }
                catch (err) {
                    // console.log('error');
                    // console.log(err);
                    this.setState({ loading: false });
                    this.setState({ status: true });
                }
                // axios.post('/api/login', {


                // 	username: values.userName,
                // 	password: values.password
                // }).then(status => {
                // 	console.log(status);
                // })
                // 	.catch(err => {
                // 		console.log('error');
                // 		console.log(err);
                // 	})
            }
        });
    }



    render() {
        const { getFieldDecorator } = this.props.form;
        console.log(this.state.status);
        return (
            <Fragment>
                {this.state.status && <Alert message="Login Gagal " type="error" />}


                <Form onSubmit={this.handleSubmit} className="login-form">
                    <Form.Item>
                        {getFieldDecorator('userName', {
                            rules: [{ required: true, message: 'Please input your username!' }],
                        })(
                            <Input prefix={<Icon type="user" style={{ color: 'rgba(0,0,0,.25)' }} />} placeholder="Username" />
                        )}
                    </Form.Item>
                    <Form.Item>
                        {getFieldDecorator('password', {
                            rules: [{ required: true, message: 'Please input your Password!' }],
                        })(
                            <Input prefix={<Icon type="lock" style={{ color: 'rgba(0,0,0,.25)' }} />} type="password" placeholder="Password" />
                        )}
                    </Form.Item>
                    <Form.Item>
                        <div style={{ display: 'flex', flex: 1, justifyContent: 'space-between' }}>
                            {getFieldDecorator('remember', {
                                valuePropName: 'checked',
                                initialValue: true,
                            })(
                                <Checkbox>Remember me</Checkbox>
                            )}
                            {/* <a href="" >Forgot password</a> */}
                        </div>
                        <div style={{ textAlign: 'center' }}>
                            <Button block type="primary" htmlType="submit" loading={this.state.loading}>
                                Log in
			 		 	</Button>
                            Or <a href="/register">Daftar</a>
                        </div>
                    </Form.Item>
                </Form>
            </Fragment>
        );
    }
}

const FormLoginComponent = Form.create({ name: 'horizontal_login' })(FormLogin);

export default FormLoginComponent;
