import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { Container, Row, Col, Form, Button, Card, Spinner } from "react-bootstrap";
import { createStore } from '../api/api.js';
import Swal from "sweetalert2";


const NewVendor = () => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const {
        register,
        handleSubmit,
        formState: { errors },
        reset,
    } = useForm();

    const onSubmit = async (data) => {
        setLoading(true);
        setError(null);
        try {

            const formData = new FormData();
            formData.append("store_name", data.store_name);
            formData.append("store_description", data.store_description);
            formData.append("contact_phone", data.contact_phone);
            formData.append("contact_email", data.contact_email);
            if (data.store_logo && data.store_logo.length > 0) {
                formData.append("store_logo", data.store_logo[0]);
            } else {
                formData.append("store_logo", "");
            }
            console.log("Data:", data);
            // Example POST request (adjust API URL)
            const response = await createStore(data)

            if (response.ok) {
                Swal.fire({
                    icon: "success",
                    title: "Success!",
                    text: "Vendor registered successfully!",
                });

                reset();
            } else {
                const errorData = await response.json();
                setError(errorData.detail || "Something went wrong!");
                Swal.fire({
                    icon: "error",
                    title: "Error!",
                    text: errorData.detail || "Something went wrong!",
                });
                console.error("Error:", errorData);
            }
        } catch (error) {
            console.error("Error:", error);
            let backendErrorMessage = "An error occurred while registering the vendor.";
            const errData = error?.response?.data;

            if (typeof errData === "string") {
                backendErrorMessage = errData;
            } else if (errData?.detail) {
                backendErrorMessage = errData.detail;
            } else if (errData?.message) {
                backendErrorMessage = errData.message;
            } else if (typeof errData === "object") {
                backendErrorMessage = Object.entries(errData)
                    .map(([key, value]) => `${key}: ${Array.isArray(value) ? value.join(", ") : value}`)
                   .join(" - ");

            }


            setError(backendErrorMessage);

            Swal.fire({
                icon: "error",
                title: "Error!",
                text: backendErrorMessage,
            });
        } finally {
            setLoading(false);
        }
    };

    return (
        <section className="py-5 bg-light">
            <Container>
                <Row className="justify-content-center">
                    <Col md={8}>
                        <Card className="p-4 shadow-sm">
                            <h2 className="mb-4 text-center">Register New Vendor</h2>
                            {error && (
                                <div className="alert alert-danger" role="alert">
                                    {error}
                                </div>
                            )}
                            <div className="text-center mb-4">
                                <img
                                    src="https://img.freepik.com/free-vector/online-shopping-concept-illustration_114360-1084.jpg"
                                    alt="Vendor Logo"
                                    className="img-fluid rounded-circle"
                                    style={{ width: "100px", height: "100px" }}
                                />
                            </div>
                            {loading && (
                                <div className="text-center py-5">
                                    <Spinner animation="border" variant="warning" />
                                    <p className="mt-3">Loading...</p>
                                </div>
                            )}
                            {!loading && (
                                <div className="text-center mb-4">
                                    <h4>Welcome to the Vendor Registration Page!</h4>
                                    <p>Please fill in the details below to register your store.</p>
                                </div>
                            )}
                            <Form onSubmit={handleSubmit(onSubmit)} encType="multipart/form-data">
                                <Form.Group className="mb-3">
                                    <Form.Label>Store Name</Form.Label>
                                    <Form.Control
                                        type="text"
                                        placeholder="Enter store name"
                                        {...register("store_name", { required: "Store name is required" })}
                                        isInvalid={errors.store_name}
                                    />
                                    <Form.Control.Feedback type="invalid">
                                        {errors.store_name?.message}
                                    </Form.Control.Feedback>
                                </Form.Group>

                                <Form.Group className="mb-3">
                                    <Form.Label>Store Description</Form.Label>
                                    <Form.Control
                                        as="textarea"
                                        rows={4}
                                        placeholder="Describe your store"
                                        {...register("store_description", { required: "Description is required" })}
                                        isInvalid={errors.store_description}
                                    />
                                    <Form.Control.Feedback type="invalid">
                                        {errors.store_description?.message}
                                    </Form.Control.Feedback>
                                </Form.Group>

                                <Form.Group className="mb-3">
                                    <Form.Label>Contact Phone</Form.Label>
                                    <Form.Control
                                        type="text"
                                        placeholder="Enter contact phone"
                                        {...register("contact_phone", { required: "Phone is required" })}
                                        isInvalid={errors.contact_phone}
                                    />
                                    <Form.Control.Feedback type="invalid">
                                        {errors.contact_phone?.message}
                                    </Form.Control.Feedback>
                                </Form.Group>

                                <Form.Group className="mb-3">
                                    <Form.Label>Contact Email</Form.Label>
                                    <Form.Control
                                        type="email"
                                        placeholder="Enter contact email"
                                        {...register("contact_email", { required: "Email is required" })}
                                        isInvalid={errors.contact_email}
                                    />
                                    <Form.Control.Feedback type="invalid">
                                        {errors.contact_email?.message}
                                    </Form.Control.Feedback>
                                </Form.Group>

                                <Form.Group className="mb-4">
                                    <Form.Label>Store Logo</Form.Label>
                                    <Form.Control
                                        type="file"
                                        accept="image/*"
                                        {...register("store_logo", { required: "Store logo is required" })}
                                    />
                                </Form.Group>

                                <div className="d-grid">
                                    <Button type="submit" variant="yellow-600" size="lg">
                                        Register Vendor
                                    </Button>
                                </div>
                            </Form>
                        </Card>
                    </Col>
                </Row>
            </Container>
        </section>
    );
};

export default NewVendor;
