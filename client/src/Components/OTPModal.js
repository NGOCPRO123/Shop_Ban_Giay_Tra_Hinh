import React, { useState, useRef, useEffect } from 'react';
import { Modal, Button, Form, Alert } from 'react-bootstrap';

function OTPModal({ show, onHide, onVerify, resendOTP }) {
    const [otp, setOtp] = useState(['', '', '', '', '', '']);
    const [error, setError] = useState('');
    const [timer, setTimer] = useState(300); // 5 phút = 300 giây
    const inputRefs = useRef([]);

    // Tạo tham chiếu cho mỗi input
    useEffect(() => {
        inputRefs.current = inputRefs.current.slice(0, 6);
    }, []);

    // Đếm ngược thời gian
    useEffect(() => {
        let interval;
        if (show && timer > 0) {
            interval = setInterval(() => {
                setTimer((prev) => prev - 1);
            }, 1000);
        }

        return () => clearInterval(interval);
    }, [show, timer]);

    // Reset timer khi modal hiển thị lại
    useEffect(() => {
        if (show) {
            setTimer(300);
            setOtp(['', '', '', '', '', '']);
            setError('');
        }
    }, [show]);

    // Xử lý khi người dùng nhập OTP
    const handleOtpChange = (e, index) => {
        const value = e.target.value;
        
        // Chỉ cho phép nhập số
        if (/^\d*$/.test(value) && value.length <= 1) {
            const newOtp = [...otp];
            newOtp[index] = value;
            setOtp(newOtp);
            
            // Tự động focus vào ô tiếp theo sau khi nhập
            if (value !== '' && index < 5) {
                inputRefs.current[index + 1].focus();
            }
        }
    };

    // Xử lý khi nhấn Backspace
    const handleKeyDown = (e, index) => {
        if (e.key === 'Backspace') {
            if (otp[index] === '' && index > 0) {
                // Nếu ô hiện tại trống và không phải ô đầu tiên,
                // focus vào ô trước đó
                inputRefs.current[index - 1].focus();
            }
        }
    };

    // Xử lý khi gửi OTP
    const handleSubmit = () => {
        const fullOtp = otp.join('');
        if (fullOtp.length !== 6) {
            setError('Vui lòng nhập đủ 6 chữ số OTP');
            return;
        }

        setError('');
        onVerify(fullOtp);
    };

    // Format thời gian còn lại
    const formatTime = (seconds) => {
        const minutes = Math.floor(seconds / 60);
        const remainingSeconds = seconds % 60;
        return `${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
    };

    return (
        <Modal show={show} onHide={onHide} centered>
            <Modal.Header closeButton>
                <Modal.Title>Xác thực thanh toán</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <p className="text-center">
                    Vui lòng nhập mã OTP đã được gửi đến email của bạn để xác nhận thanh toán.
                </p>
                <p className="text-center text-muted small">
                    Mã xác thực sẽ hết hạn sau: <span className="text-danger">{formatTime(timer)}</span>
                </p>

                <div className="d-flex justify-content-center mb-4">
                    {otp.map((digit, index) => (
                        <Form.Control
                            key={index}
                            ref={(el) => (inputRefs.current[index] = el)}
                            type="text"
                            value={digit}
                            onChange={(e) => handleOtpChange(e, index)}
                            onKeyDown={(e) => handleKeyDown(e, index)}
                            className="mx-1 text-center"
                            style={{ width: '45px', height: '50px', fontSize: '1.2rem' }}
                            maxLength={1}
                            autoFocus={index === 0}
                        />
                    ))}
                </div>

                {error && <Alert variant="danger">{error}</Alert>}

                <div className="text-center mt-3">
                    <Button 
                        variant="link" 
                        onClick={resendOTP}
                        disabled={timer > 270} // Không cho gửi lại trong 30s đầu
                    >
                        Gửi lại mã OTP
                    </Button>
                </div>
            </Modal.Body>
            <Modal.Footer>
                <Button variant="secondary" onClick={onHide}>
                    Hủy
                </Button>
                <Button variant="primary" onClick={handleSubmit}>
                    Xác nhận
                </Button>
            </Modal.Footer>
        </Modal>
    );
}

export default OTPModal; 