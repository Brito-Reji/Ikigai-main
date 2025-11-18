import { Category } from "../../models/Category.js";

export const createCategory = async (req, res) => {
  let { name, description } = req.body;

  if (!name || !description) {
    return res
      .status(400)
      .json({ success: false, message: "Name and description are required" });
  }
    let category = await Category.findOne({ name: name.trim() })

    if(category){
      return  res
      .status(409)
      .json({ success: false, message: "Category already exists" });
    }

    await Category.create({ name: name.trim(), description: description.trim() });
    return res
      .status(201)
        .json({ success: true, message: "Category created successfully" });
}