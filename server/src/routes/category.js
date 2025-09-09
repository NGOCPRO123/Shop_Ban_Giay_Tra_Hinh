const express = require('express');
const router = express.Router();
const ControllerCategory = require('../controllers/ControllerCategory');
const { verifyToken, verifyTokenAndAdmin } = require('../middleware/verifyToken');

// Lấy tất cả danh mục
router.get('/getall', ControllerCategory.getAllCategories);

// Lấy danh mục theo ID
router.get('/:id', ControllerCategory.getCategoryById);

// Tạo danh mục mới (chỉ admin)
router.post('/create', verifyTokenAndAdmin, ControllerCategory.createCategory);

// Cập nhật danh mục (chỉ admin)
router.put('/update/:id', verifyTokenAndAdmin, ControllerCategory.updateCategory);

// Xóa danh mục (chỉ admin)
router.delete('/delete/:id', verifyTokenAndAdmin, ControllerCategory.deleteCategory);

module.exports = router; 