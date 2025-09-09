const ModelCategory = require('../models/ModelCategory');
const slugify = require('slugify');

class ControllerCategory {
    // Tạo danh mục mới
    async createCategory(req, res) {
        try {
            const { name, description, parent } = req.body;
            
            const slug = slugify(name, {
                lower: true,
                strict: true,
                locale: 'vi'
            });

            const category = new ModelCategory({
                name,
                slug,
                description,
                parent: parent || null
            });

            await category.save();
            res.status(200).json({ 
                message: 'Tạo danh mục thành công',
                category 
            });
        } catch (error) {
            res.status(500).json({ 
                message: 'Có lỗi xảy ra khi tạo danh mục',
                error: error.message 
            });
        }
    }

    // Lấy tất cả danh mục
    async getAllCategories(req, res) {
        try {
            const categories = await ModelCategory.find({ isActive: true })
                                               .populate('parent')
                                               .sort({ createdAt: -1 });
            res.status(200).json(categories);
        } catch (error) {
            res.status(500).json({ 
                message: 'Có lỗi xảy ra khi lấy danh sách danh mục',
                error: error.message 
            });
        }
    }

    // Cập nhật danh mục
    async updateCategory(req, res) {
        try {
            const { id } = req.params;
            const { name, description, parent, isActive } = req.body;
            
            const updateData = {
                name,
                description,
                parent: parent || null,
                isActive
            };

            if (name) {
                updateData.slug = slugify(name, {
                    lower: true,
                    strict: true,
                    locale: 'vi'
                });
            }

            const category = await ModelCategory.findByIdAndUpdate(
                id,
                updateData,
                { new: true }
            );

            if (!category) {
                return res.status(404).json({ message: 'Không tìm thấy danh mục' });
            }

            res.status(200).json({ 
                message: 'Cập nhật danh mục thành công',
                category 
            });
        } catch (error) {
            res.status(500).json({ 
                message: 'Có lỗi xảy ra khi cập nhật danh mục',
                error: error.message 
            });
        }
    }

    // Xóa danh mục (soft delete)
    async deleteCategory(req, res) {
        try {
            const { id } = req.params;
            const category = await ModelCategory.findByIdAndUpdate(
                id,
                { isActive: false },
                { new: true }
            );

            if (!category) {
                return res.status(404).json({ message: 'Không tìm thấy danh mục' });
            }

            res.status(200).json({ 
                message: 'Xóa danh mục thành công',
                category 
            });
        } catch (error) {
            res.status(500).json({ 
                message: 'Có lỗi xảy ra khi xóa danh mục',
                error: error.message 
            });
        }
    }

    // Lấy danh mục theo ID
    async getCategoryById(req, res) {
        try {
            const { id } = req.params;
            const category = await ModelCategory.findById(id)
                                             .populate('parent');

            if (!category) {
                return res.status(404).json({ message: 'Không tìm thấy danh mục' });
            }

            res.status(200).json(category);
        } catch (error) {
            res.status(500).json({ 
                message: 'Có lỗi xảy ra khi lấy thông tin danh mục',
                error: error.message 
            });
        }
    }
}

module.exports = new ControllerCategory(); 