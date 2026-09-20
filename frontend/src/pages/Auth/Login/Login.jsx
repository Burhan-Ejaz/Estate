import React from "react";
import { Form, Input, Button, message } from "antd";
import { useAuth } from "../../../Context/AuthContext.jsx";
import { useNavigate } from "react-router-dom";
import {useEffect} from "react";
import "./Login.css";


const Login = () => {

    const { login } = useAuth();
    const navigate = useNavigate();
    const [form] = Form.useForm();

     useEffect(() => {
        form.resetFields();
        }, [form]);


    const handleLogin = async (values) => {
        try {

            const response = await login(values);

            message.success("Login successful");

            console.log(response);
            navigate("/home");

        } catch (error) {

            console.log(error);

            message.error(
                error.response?.data?.message || "Login failed"
            );
        }
    };

    return (
        <div className="outerdiv">

            <div className="inner-div">

                <Form
                    form={form}
                    layout="vertical"
                    onFinish={handleLogin}
                >

                    <h2>Login</h2>

                    <Form.Item
                        label="Email"
                        name="email"
                        rules={[
                            {
                                required: true,
                                message: "Please enter your email"
                            },
                            {
                                type: "email",
                                message: "Enter a valid email"
                            }
                        ]}
                    >
                        <Input placeholder="Enter your email" />
                    </Form.Item>

                    <Form.Item
                        label="Password"
                        name="password"
                        rules={[
                            {
                                required: true,
                                message: "Please enter your password"
                            }
                        ]}
                    >
                        <Input.Password
                            placeholder="Enter your password"
                        />
                    </Form.Item>

                    <Form.Item>
                        <Button
                            type="primary"
                            htmlType="submit"
                            block
                        >
                            Submit
                        </Button>
                    </Form.Item>

                </Form>

            </div>

            <div>
                <p>
                    Dont have an account?{" "}
                    <a href="/Signup">SignUp</a>
                </p>
            </div>

        </div>
    );
};

export default Login;