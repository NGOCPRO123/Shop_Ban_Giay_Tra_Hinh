# TVVN - E-commerce Platform (2024)

## Mô tả
Phát triển nền tảng thương mại điện tử với giao diện hiện đại, tích hợp quản lý sản phẩm và phân tích dữ liệu. Xây dựng trên kiến trúc microservices.

## Công nghệ
- **Frontend**: React.js, Material-UI, Redux
- **Backend**: Node.js, Express, MongoDB
- **DevOps**: Docker
- **AI**: Google AI

## Tính năng
- Quản lý người dùng và phân quyền
- Quản lý sản phẩm và thanh toán
- Dashboard phân tích dữ liệu
- Thông báo real-time

## Ứng dụng
- Thương mại điện tử B2C
- Quản lý cửa hàng trực tuyến
- Phân tích kinh doanh

## Quick Start Guide

### Step 1: Clone the repository
```bash
git clone https://github.com/your-username/tvvn.git
cd tvvn
```

### Step 2: Install Dependencies
```bash
# Backend
cd server
npm install

# Frontend
cd client
npm install
```

### Step 3: Environment Setup
```bash
# Backend (.env)
PORT=5000
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret

# Frontend (.env)
REACT_APP_API_URL=http://localhost:5000
```

### Step 4: Run Application
```bash
# Start Backend
cd server
npm start

# Start Frontend
cd client
npm start
```

## Tech Stack Details

### Frontend
- React.js 18.3.1
- Material-UI & Bootstrap
- Redux & React Router
- Socket.IO & Chart.js
- SASS & Axios

### Backend
- Node.js & Express
- MongoDB & Mongoose
- JWT & Socket.IO
- Google AI & Nodemailer
- Multer & Bcrypt

## Features in Detail

### User Management
- Authentication & Authorization
- User Profiles
- Order History

### Product Management
- CRUD Operations
- Categories & Search
- Reviews & Ratings

### Shopping Experience
- Real-time Cart
- Multiple Payment Methods
- Order Tracking

### Admin Features
- Sales Analytics
- User Management
- Product Management
- Real-time Reports

## Docker Support
```bash
# Frontend
cd client
docker build -t tvvn-client .
docker run -p 3000:3000 tvvn-client

# Backend
cd server
docker build -t tvvn-server .
docker run -p 5000:5000 tvvn-server
```

## Contributing
1. Fork the repository
2. Create your feature branch
3. Commit your changes
4. Push to the branch
5. Open a Pull Request

## License
This project is licensed under the ISC License.

## Contact
For any queries or support, please open an issue in the repository. 