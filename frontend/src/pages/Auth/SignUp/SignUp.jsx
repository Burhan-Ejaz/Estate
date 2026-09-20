import { Button, Form, Input, message } from "antd";
import React from "react";
import { useAuth } from "../../../Context/AuthContext.jsx";
import "./SignUp.css";
import { useNavigate } from "react-router-dom"; 
const SignUp = () => {

    const { signup } = useAuth();
    const navigate = useNavigate();

    const handleSignup = async (values) => {
        try {

            const response = await signup(values);

            message.success(
                response.message || "Account created successfully"
            );

            console.log(response);
            navigate("/login");

        } catch (error) {

            message.error(
                error.response?.data?.message || "Registration failed"
            );

            console.log(error);
        }
    };

    return (
        <div className="maindiv">

            <div className="innerdiv">

                <Form
                    layout="vertical"
                    onFinish={handleSignup}
                    style={{
                        overflowY: "auto",
                        maxWidth: 400,
                        margin: "auto"
                    }}
                >

                    <h2>Sign Up</h2>

                    <Form.Item
                        label="Full Name"
                        name="name"
                        rules={[
                            {
                                required: true,
                                message: "Please enter your full name"
                            }
                        ]}
                    >
                        <Input placeholder="Fullname" />
                    </Form.Item>

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
                        <Input placeholder="Email" />
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
                        <Input.Password placeholder="Password" />
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
                    Already have an account?{" "}
                    <a href="/login">Login</a>
                </p>
            </div>

        </div>
    );
};

export default SignUp;