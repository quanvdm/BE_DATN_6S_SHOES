import { AttributeAddSchema } from "../schema/attribute";
import Attribute from "../model/attribute";
import slugify from "slugify";

export const createAtribute = async (req, res) => {
  const { attribute_name, attribute_value } = req.body;
  const formData = req.body;
  try {
    const checkValue = await Attribute.findOne({ attribute_value });
    if (checkValue) {
      return res.status(400).json({
        message: "Giá trị thuộc tính đã tồn tại",
      });
    }

    // validate
    const { error } = AttributeAddSchema.validate(formData);
    if (error) {
      return res.status(400).json({
        message: error.details[0].message,
      });
    }

    // Tạo slug
    const slug = slugify(attribute_name, { lower: true });

    // cập nhật slug
    let uniqueSlug = await createUniqueSlug(slug);

    // dữ liệu gửi đi
    const dataCate = {
      ...formData,
      slug: uniqueSlug,
    };

    const attribute = await Attribute.create(dataCate);
    if (!attribute || attribute.length === 0) {
      return res.status(400).json({
        message: "Thêm thuộc tính thất bại",
      });
    }

    // cập nhật lại slug
    attribute.slug = uniqueSlug;
    await attribute.save();

    return res.json({
      message: "Thêm thuộc tính thành công",
      attribute,
    });
  } catch (error) {
    return res.status(500).json({
      message: error.message || "Lỗi server",
    });
  }
};

async function createUniqueSlug(slug) {
  let uniqueSlug = slug;
  let counter = 1;
  while (true) {
    const existingRole = await Attribute.findOne({ slug: uniqueSlug });
    if (!existingRole) {
      break;
    }

    uniqueSlug = `${slug}-${counter}`;
    counter++;
  }

  return uniqueSlug;
}

export const getAttributeById = async (req, res) => {
  const id = req.params.id;
  try {
    const attribute = await Attribute.findById({_id: id});
    if (!attribute || attribute.attribute === 0) {
      return res.status(400).json({
        message: "Không tìm thấy thấy thuộc tính sản phẩm  !",
      });
    }
    return res.status(200).json({
      message: ` Lấy dữ liệu thuộc tính sản phẩm theo id : ${id} và thuộc tính là '${attribute.attribute_name}' thành công !`,
      attribute,
    });
  } catch (error) {
    return res.status(500).json({
      message: error.message || "error server :((",
    });
  }
};

export const getAttributeBySlug = async (req, res) => {
  const slug = req.params.slug;
  try {
    const attribute = await Attribute.findOne({ slug: slug });
    if (!attribute || attribute.length === 0) {
      return res.status(400).json({
        message: `Không tìm được dữ liệu thuộc tính sản phẩm :${slug}`,
      });
    }
    return res.status(200).json({
      message: `Lấy dự liệu thuộc tính sản phẩm thành công bởi slug: ${slug} `,
      attribute,
    });
  } catch (error) {
    return res.status(500).json({
      message: error.message || "error server :((",
    });
  }
};