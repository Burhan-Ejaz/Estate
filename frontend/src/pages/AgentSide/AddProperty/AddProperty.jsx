import React, { useEffect } from 'react'
import { Modal, Form, Input, InputNumber, Select, Upload, message } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import api from '../../../api/axios.js';

const normFile = (e) => {
    if (Array.isArray(e)) return e;
    return e?.fileList;
};

const AddProperty = ({ open, onClose, onSaved, property }) => {
    const [form] = Form.useForm();
    const [submitting, setSubmitting] = React.useState(false);
    const isEdit = Boolean(property);

    useEffect(() => {
        if (!open) return;

        form.resetFields();

        if (property) {
            form.setFieldsValue({
                title: property.title,
                description: property.description,
                type: property.type,
                purpose: property.purpose,
                price: property.price,
                city: property.location?.city,
                address: property.location?.address,
                bedrooms: property.bedrooms,
                bathrooms: property.bathrooms,
                areaSize: property.areaSize,
            });
        }
    }, [open, property, form]);

    const handleCancel = () => {
        form.resetFields();
        onClose();
    };

    const handleSubmit = async () => {
        try {
            const values = await form.validateFields();
            setSubmitting(true);

            if (isEdit) {
                await api.put(`/properties/update/${property._id}`, {
                    title: values.title,
                    description: values.description || '',
                    price: values.price,
                    type: values.type,
                    purpose: values.purpose,
                    location: { city: values.city || '', address: values.address || '' },
                    bedrooms: values.bedrooms,
                    bathrooms: values.bathrooms,
                    areaSize: values.areaSize,
                });

                message.success('Property updated successfully');
            } else {
                const formData = new FormData();
                formData.append('title', values.title);
                formData.append('description', values.description || '');
                formData.append('price', values.price);
                formData.append('type', values.type);
                formData.append('purpose', values.purpose);
                formData.append('city', values.city || '');
                formData.append('address', values.address || '');
                if (values.bedrooms !== undefined) formData.append('bedrooms', values.bedrooms);
                if (values.bathrooms !== undefined) formData.append('bathrooms', values.bathrooms);
                if (values.areaSize !== undefined) formData.append('areaSize', values.areaSize);

                (values.images || []).forEach((file) => {
                    formData.append('images', file.originFileObj);
                });

                await api.post('/properties/create', formData, {
                    headers: { 'Content-Type': undefined },
                });

                message.success('Property added successfully');
            }

            form.resetFields();
            onSaved();
        } catch (error) {
            if (error?.errorFields) return;
            console.log(error);
            message.error(error.response?.data?.message || `Failed to ${isEdit ? 'update' : 'add'} property`);
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <Modal
            title={isEdit ? 'Edit Property' : 'Add Property'}
            open={open}
            onCancel={handleCancel}
            onOk={handleSubmit}
            okText={isEdit ? 'Save Changes' : 'Add Property'}
            confirmLoading={submitting}
            destroyOnHidden
            afterOpenChange={(opened) => { if (!opened) form.resetFields(); }}
            width={720}
        >
            <Form form={form} layout="vertical" preserve={false}>
                <Form.Item name="title" label="Title" rules={[{ required: true, message: 'Title is required' }]}>
                    <Input placeholder="e.g. Cozy 2 Bed Apartment" />
                </Form.Item>

                <Form.Item name="description" label="Description">
                    <Input.TextArea rows={3} placeholder="Describe the property" />
                </Form.Item>

                <div style={{ display: 'flex', gap: 16 }}>
                    <Form.Item name="type" label="Property Type" rules={[{ required: true, message: 'Type is required' }]} style={{ flex: 1 }}>
                        <Select
                            placeholder="Select type"
                            options={[
                                { value: 'house', label: 'House' },
                                { value: 'apartment', label: 'Apartment' },
                                { value: 'plot', label: 'Plot' },
                                { value: 'commercial', label: 'Commercial' },
                            ]}
                        />
                    </Form.Item>

                    <Form.Item name="purpose" label="Purpose" rules={[{ required: true, message: 'Purpose is required' }]} style={{ flex: 1 }}>
                        <Select
                            placeholder="Sale or Rent"
                            options={[
                                { value: 'sale', label: 'Sale' },
                                { value: 'rent', label: 'Rent' },
                            ]}
                        />
                    </Form.Item>

                    <Form.Item name="price" label="Price" rules={[{ required: true, message: 'Price is required' }]} style={{ flex: 1 }}>
                        <InputNumber min={0} style={{ width: '100%' }} placeholder="Price" />
                    </Form.Item>
                </div>

                <div style={{ display: 'flex', gap: 16 }}>
                    <Form.Item name="city" label="City" style={{ flex: 1 }}>
                        <Input placeholder="City" />
                    </Form.Item>

                    <Form.Item name="address" label="Address" style={{ flex: 1 }}>
                        <Input placeholder="Address" />
                    </Form.Item>
                </div>

                <div style={{ display: 'flex', gap: 16 }}>
                    <Form.Item name="bedrooms" label="Bedrooms" style={{ flex: 1 }}>
                        <InputNumber min={0} style={{ width: '100%' }} />
                    </Form.Item>

                    <Form.Item name="bathrooms" label="Bathrooms" style={{ flex: 1 }}>
                        <InputNumber min={0} style={{ width: '100%' }} />
                    </Form.Item>

                    <Form.Item name="areaSize" label="Area (sq ft)" style={{ flex: 1 }}>
                        <InputNumber min={0} style={{ width: '100%' }} />
                    </Form.Item>
                </div>

                {isEdit ? (
                    <p style={{ color: '#6b7280', fontSize: 13 }}>
                        {property?.images?.length || 0} photo(s) already uploaded. Photos can only be added when creating a property.
                    </p>
                ) : (
                <Form.Item
                    name="images"
                    label="Photos"
                    valuePropName="fileList"
                    getValueFromEvent={normFile}
                >
                    <Upload listType="picture-card" beforeUpload={() => false} multiple accept="image/*">
                        <div>
                            <PlusOutlined />
                            <div style={{ marginTop: 8 }}>Upload</div>
                        </div>
                    </Upload>
                </Form.Item>
                )}
            </Form>
        </Modal>
    );
};

export default AddProperty
