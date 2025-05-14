import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { Container, Row, Col, Card, Form, Button, Spinner, Alert } from "react-bootstrap";
import { createStore } from '../api/api.js';
import Swal from "sweetalert2";
import { FaStore, FaHandshake, FaUserTie } from 'react-icons/fa';

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
            const response = await createStore(formData)

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
        <section className="py-2" style={{
            background: "linear-gradient(rgba(0, 0, 0, 0.6), rgba(0, 0, 0, 0.6)), url('https://images.unsplash.com/photo-1556740738-b6a63e27c4df?ixlib=rb-4.0.3&auto=format&fit=crop&w=1470&q=80')",
            backgroundSize: "cover",
            backgroundPosition: "center",
            minHeight: "100vh",
            display: "flex",
            alignItems: "center"
        }}>
            <Container fluid>
                <Row className="justify-content-center mb-5">
                    <Col md={8} lg={6} xl={5}>
                        <Card className="p-4 p-md-5 shadow-lg border-0" style={{
                            backdropFilter: "blur(8px)",
                            backgroundColor: "rgba(255, 255, 255, 0.93)",
                            borderRadius: "20px"
                        }}>
                            {/* Header Section */}
                            <div className="text-center mb-4">
                                <FaHandshake
                                    style={{ color: "#e67e22", fontSize: "3.5rem" }}
                                    className="mb-3"
                                />
                                <h2 className="mb-2" style={{ color: "#2c3e50", fontWeight: "700" }}>
                                    Sell With Us
                                </h2>
                                <p className="text-muted mb-0">
                                    Register your business in just 2 minutes
                                </p>
                            </div>

                            {/* Error Alert */}
                            {error && (
                                <Alert variant="danger" className="text-center mb-4">
                                    {error}
                                </Alert>
                            )}

                            {/* Loading State */}
                            {loading ? (
                                <div className="text-center py-4">
                                    <Spinner animation="border" variant="warning" />
                                    <p className="mt-3" style={{ color: "#7f8c8d" }}>
                                        Creating your vendor dashboard...
                                    </p>
                                </div>
                            ) : (
                                <Form onSubmit={handleSubmit(onSubmit)} encType="multipart/form-data">
                                    {/* Store Name */}
                                    <Form.Group className="mb-3">
                                        <Form.Label className="fw-semibold">Store Name *</Form.Label>
                                        <Form.Control
                                            type="text"
                                            placeholder="e.g., Fresh Farms"
                                            {...register("store_name", { required: "Store name is required" })}
                                            className="py-2 border-2"
                                            isInvalid={errors.store_name}
                                        />
                                        <Form.Control.Feedback type="invalid">
                                            {errors.store_name?.message}
                                        </Form.Control.Feedback>
                                    </Form.Group>

                                    {/* Store Description */}
                                    <Form.Group className="mb-3">
                                        <Form.Label className="fw-semibold">Description *</Form.Label>
                                        <Form.Control
                                            as="textarea"
                                            rows={3}
                                            placeholder="What makes your business unique?"
                                            {...register("store_description", { required: "Description is required" })}
                                            className="py-2 border-2"
                                            isInvalid={errors.store_description}
                                        />
                                        <Form.Control.Feedback type="invalid">
                                            {errors.store_description?.message}
                                        </Form.Control.Feedback>
                                    </Form.Group>

                                    {/* Contact Info */}
                                    <Row>
                                        <Col md={12}>
                                            <Form.Group className="mb-3">
                                                <Form.Label className="fw-semibold">Phone *</Form.Label>
                                                <Form.Control
                                                    type="tel"
                                                    placeholder="+201234567890"
                                                    {...register("contact_phone", { required: "Phone is required" })}
                                                    className="py-2 border-2"
                                                    isInvalid={errors.contact_phone}
                                                />
                                                <Form.Control.Feedback type="invalid">
                                                    {errors?.contact_phone?.message}
                                                </Form.Control.Feedback>
                                            </Form.Group>
                                        </Col>
                                        <Col md={12}>
                                            <Form.Group className="mb-3">
                                                <Form.Label className="fw-semibold">Email *</Form.Label>
                                                <Form.Control
                                                    type="email"
                                                    placeholder="contact@yourstore.com"
                                                    {...register("contact_email", { required: "Email is required" })}
                                                    className="py-2 border-2"
                                                    isInvalid={errors.contact_email}
                                                />
                                                <Form.Control.Feedback type="invalid">
                                                    {errors.contact_email?.message}
                                                </Form.Control.Feedback>
                                            </Form.Group>
                                        </Col>
                                    </Row>

                                    {/* Logo Upload */}
                                    <Form.Group className="mb-4">
                                        <Form.Label className="fw-semibold">Store Logo *</Form.Label>
                                        <Form.Control
                                            type="file"
                                            accept="image/*"
                                            {...register("store_logo", { required: "Logo is required" })}
                                            className="py-2 border-2"
                                            onChange={(e) => {
                                                register("store_logo").onChange(e);
                                            }}
                                            isInvalid={!!errors.store_logo}
                                        />
                                        <Form.Text muted>PNG/JPG, max 5MB</Form.Text>
                                    </Form.Group>

                                    {/* Submit Button */}
                                    <div className="d-grid mt-4">
                                        <Button
                                            type="submit"
                                            size="lg"
                                            style={{
                                                background: "linear-gradient(135deg, #f39c12, #e67e22)",
                                                border: "none",
                                                fontWeight: "600",
                                                padding: "12px",
                                                borderRadius: "10px"
                                            }}
                                        >
                                            Complete Registration
                                        </Button>
                                    </div>
                                </Form>
                            )}

                            {/* Footer Note */}
                            <p className="text-center text-muted mt-4 mb-0 small">
                                Already have an account? <a href="/vendor-login" style={{ color: "#e67e22" }}>Sign in</a>
                            </p>
                        </Card>
                    </Col>
                </Row>
            </Container>
        </section>
    );
};

export default NewVendor;
