import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { Container, Row, Col, Card, Form, Button, Spinner, Alert } from "react-bootstrap";
import { createStore } from '../api/api.js';
import Swal from "sweetalert2";
import { FaHandshake } from 'react-icons/fa';

const NewVendor = () => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const {
        register,
        handleSubmit,
        formState: { errors },
        reset,
        watch
    } = useForm();

    const onSubmit = async (data) => {
        setLoading(true);
        setError(null);

        try {
            const formData = new FormData();
            formData.append("name", data.store_name);
            formData.append("description", data.store_description);
            formData.append("contact_phone", data.contact_phone);
            formData.append("contact_email", data.contact_email);

            // إضافة صورة المتجر إذا تم تحميلها
            if (data.store_logo && data.store_logo.length > 0) {
                formData.append("logo", data.store_logo[0]);
            }
            console.log("Data:", data)
            const response = await createStore(formData)
            console.log(response)
            if (response.ok) {
                Swal.fire({
                    icon: "success",
                    title: "Success!",
                    text: "Vendor registered successfully!",
                });

                reset();
            } else {
                const errorData = response;
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
            let errorMessage = "An error occurred while registering the vendor.";
            
            if (error.response) {
                // معالجة أخطاء الباكيند
                const errorData = error.response.data;
                
                if (typeof errorData === "string") {
                    errorMessage = errorData;
                } else if (errorData.detail) {
                    errorMessage = errorData.detail;
                } else if (errorData.message) {
                    errorMessage = errorData.message;
                } else if (typeof errorData === "object") {
                    errorMessage = Object.entries(errorData)
                        .map(([key, value]) => `${key}: ${Array.isArray(value) ? value.join(", ") : value}`)
                        .join(" - ");
                }
            } else if (error.message) {
                errorMessage = error.message;
            }

            setError(errorMessage);
            Swal.fire({
                icon: "error",
                title: "Error!",
                text: errorMessage,
            });
        } finally {
            setLoading(false);
        }
    };

    // مشاهدة تغييرات صورة المتجر لعرض معاينة
    const storeLogo = watch("store_logo");

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

                            {error && (
                                <Alert variant="danger" className="text-center mb-4">
                                    {error}
                                </Alert>
                            )}

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
                                            {...register("store_name", { 
                                                required: "Store name is required",
                                                minLength: {
                                                    value: 3,
                                                    message: "Store name must be at least 3 characters"
                                                }
                                            })}
                                            className="py-2 border-2"
                                            isInvalid={!!errors.store_name}
                                        />
                                        <Form.Control.Feedback type="invalid">
                                            {errors.store_name?.message}
                                        </Form.Control.Feedback>
                                    </Form.Group>

                                    <Form.Group className="mb-3">
                                        <Form.Label className="fw-semibold">Description *</Form.Label>
                                        <Form.Control
                                            as="textarea"
                                            rows={3}
                                            placeholder="What makes your business unique?"
                                            {...register("store_description", { 
                                                required: "Description is required",
                                                minLength: {
                                                    value: 20,
                                                    message: "Description must be at least 20 characters"
                                                }
                                            })}
                                            className="py-2 border-2"
                                            isInvalid={!!errors.store_description}
                                        />
                                        <Form.Control.Feedback type="invalid">
                                            {errors.store_description?.message}
                                        </Form.Control.Feedback>
                                    </Form.Group>

                                    <Row>
                                        <Col md={12}>
                                            <Form.Group className="mb-3">
                                                <Form.Label className="fw-semibold">Phone *</Form.Label>
                                                <Form.Control
                                                    type="tel"
                                                    placeholder="+201234567890"
                                                    {...register("contact_phone", { 
                                                        required: "Phone is required",
                                                        pattern: {
                                                            value: /^\+?[0-9]{10,15}$/,
                                                            message: "Please enter a valid phone number"
                                                        }
                                                    })}
                                                    className="py-2 border-2"
                                                    isInvalid={!!errors.contact_phone}
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
                                                    {...register("contact_email", { 
                                                        required: "Email is required",
                                                        pattern: {
                                                            value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                                                            message: "Invalid email address"
                                                        }
                                                    })}
                                                    className="py-2 border-2"
                                                    isInvalid={!!errors.contact_email}
                                                />
                                                <Form.Control.Feedback type="invalid">
                                                    {errors.contact_email?.message}
                                                </Form.Control.Feedback>
                                            </Form.Group>
                                        </Col>
                                    </Row>

                                    <Form.Group className="mb-4">
                                        <Form.Label className="fw-semibold">Store Logo *</Form.Label>
                                        <Form.Control
                                            type="file"
                                            accept="image/*"
                                            {...register("store_logo", { 
                                                required: "Logo is required",
                                                validate: {
                                                    lessThan5MB: files => 
                                                        files[0]?.size < 5 * 1024 * 1024 || "Max 5MB size",
                                                    acceptedFormats: files =>
                                                        ['image/jpeg', 'image/png', 'image/webp'].includes(files[0]?.type) || 
                                                        "Only JPEG, PNG, WEBP formats"
                                                }
                                            })}
                                            className="py-2 border-2"
                                            isInvalid={!!errors.store_logo}
                                        />
                                        {storeLogo?.length > 0 && (
                                            <div className="mt-2">
                                                <img 
                                                    src={URL.createObjectURL(storeLogo[0])} 
                                                    alt="Store logo preview" 
                                                    style={{
                                                        maxWidth: '100%',
                                                        maxHeight: '150px',
                                                        borderRadius: '8px'
                                                    }}
                                                />
                                            </div>
                                        )}
                                        <Form.Control.Feedback type="invalid">
                                            {errors.store_logo?.message}
                                        </Form.Control.Feedback>
                                        <Form.Text muted>PNG/JPG/WEBP, max 5MB</Form.Text>
                                    </Form.Group>

                                    <div className="d-grid mt-4">
                                        <Button
                                            type="submit"
                                            size="lg"
                                            disabled={loading}
                                            style={{
                                                background: "linear-gradient(135deg, #f39c12, #e67e22)",
                                                border: "none",
                                                fontWeight: "600",
                                                padding: "12px",
                                                borderRadius: "10px"
                                            }}
                                        >
                                            {loading ? (
                                                <span>
                                                    <Spinner
                                                        as="span"
                                                        animation="border"
                                                        size="sm"
                                                        role="status"
                                                        aria-hidden="true"
                                                        className="me-2"
                                                    />
                                                    Processing...
                                                </span>
                                            ) : (
                                                "Complete Registration"
                                            )}
                                        </Button>
                                    </div>
                                </Form>
                            )}

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