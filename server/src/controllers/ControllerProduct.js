const ModelProducts = require('../models/ModelProducts');
const modelProducts = require('../models/ModelProducts');
const ModelPayment = require('../models/ModelPayment');
const ModelCategory = require('../models/ModelCategory');
var slugify = require('slugify');
var fs = require('fs/promises');
const path = require('path');

const mongoose = require('mongoose');

class controllerProducts {
    async AddProducts(req, res, next) {
        try {
            const { nameProduct, priceProduct, description, checkType, categoryId } = req.body;
            const imgUrls = req.files.map((file) => file.filename);
            const slug = slugify(nameProduct, '-', {
                replacement: '-',
                remove: undefined,
                lower: false,
                strict: false,
                locale: 'vi',
                trim: true,
            });

            // Tìm hoặc tạo category mặc định
            let category;
            if (categoryId) {
                category = await ModelCategory.findById(categoryId);
            }

            if (!category) {
                // Tạo category mặc định nếu không có
                category = await ModelCategory.findOne({ name: 'Mặc định' });
                if (!category) {
                    category = new ModelCategory({
                        name: 'Mặc định',
                        slug: 'mac-dinh',
                        description: 'Danh mục mặc định',
                    });
                    await category.save();
                }
            }

            const newProducts = new modelProducts({
                name: nameProduct,
                price: priceProduct,
                description: description,
                slug,
                img: imgUrls,
                type: checkType,
                category: category._id,
            });

            await newProducts.save();
            res.status(200).json({ message: 'Thêm sản phẩm thành công' });
        } catch (error) {
            console.error('Lỗi khi thêm sản phẩm:', error);
            res.status(500).json({ message: 'Lỗi khi thêm sản phẩm', error: error.message });
        }
    }
    GetProducts(req, res, next) {
        modelProducts.find({}).then((dataProduct) => {
            return res.status(200).json(dataProduct);
        });
    }
    async GetOneProducts(req, res) {
        try {
            const id = req.query.id;
            const dataProduct = await modelProducts.findOne({ _id: id });
            if (!dataProduct) {
                return res.status(200).json([]);
            }
            return res.status(200).json([dataProduct]);
        } catch (error) {}
    }
    async SearchProduct(req, res) {
        try {
            const { nameProduct } = req.query;
            if (!nameProduct || nameProduct.trim() === '' || nameProduct === 'undefined') {
                return res.status(200).json([]);
            }

            const dataProducts = await modelProducts.find({ name: { $regex: nameProduct, $options: 'i' } });
            if (!dataProducts) {
                return res.status(200).json([]);
            }
            const validProducts = dataProducts.filter((product) => mongoose.Types.ObjectId.isValid(product._id));

            if (validProducts.length === 0) {
                return res.status(200).json([]);
            }

            return res.status(200).json(validProducts);
        } catch (error) {
            console.error('Lỗi tìm kiếm sản phẩm:', error);
            return res.status(500).json({ message: 'Lỗi server, vui lòng thử lại sau' });
        }
    }
    async EditPro(req, res) {
        try {
            const { id, nameProduct, priceProduct, description } = req.body;
            ModelProducts.findOne({ _id: id }).then((data) => {
                if (data) {
                    data.updateOne({
                        name: nameProduct,
                        price: priceProduct,
                        description: description,
                    }).then(() => res.status(200).json({ message: 'Cập Nhật Thành Công !!!' }));
                }
            });
        } catch (error) {
            console.log(error);
        }
    }
    async deletePro(req, res) {
        try {
            const { id } = req.query;
            const dataPro = await modelProducts.findOne({ _id: id });

            console.log(id);

            if (!dataPro) {
                return res.status(404).json({ message: 'Sản phẩm không tồn tại!' });
            }

            // Lấy danh sách ảnh từ sản phẩm
            const arrayImg = dataPro.img || [];
            const filePaths = arrayImg.map((item) => path.join(__dirname, '../uploads', item));

            // Xóa sản phẩm trong database
            await modelProducts.deleteOne({ _id: id });

            // Xóa từng file ảnh trong thư mục uploads
            await Promise.all(filePaths.map((file) => fs.unlink(file).catch(() => {})));

            return res.status(200).json({ message: 'Xóa thành công!' });
        } catch (error) {
            return res.status(500).json({ message: 'Lỗi server!', error });
        }
    }

    async EditOrder(req, res) {
        const id = req.body.id;

        const dataOrder = await ModelPayment.findOne({ _id: id });

        if (dataOrder) {
            dataOrder
                .updateOne({ tinhtrang: req.body.valueOption === 0 ? false : true })
                .then(() => res.status(200).json({ message: 'Cập Nhật Thành Công !!!' }));
        } else {
            return;
        }
    }
    async SimilarProduct(req, res) {
        const keyword = req.query.nameProduct;
        modelProducts.find({ slug: { $regex: keyword, $options: 'i' } }).then((dataProducts) => {
            if (dataProducts.length <= 0) {
                return res.status(200).json([]);
            } else {
                return res.status(200).json(dataProducts);
            }
        });
    }
}

module.exports = new controllerProducts();
