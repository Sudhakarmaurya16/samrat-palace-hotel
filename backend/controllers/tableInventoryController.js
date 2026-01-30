import Table from "../models/Table.js";

// 1. Add New Table (Admin)
export const addTable = async (req, res) => {
  try {
    const newTable = new Table(req.body);
    const savedTable = await newTable.save();
    res.status(201).json(savedTable);
  } catch (error) {
    res.status(500).json({ message: "Failed to add table", error });
  }
};

// 2. Get All Tables (Display on Website)
export const getAllTables = async (req, res) => {
  try {
    const tables = await Table.find().sort({ createdAt: -1 });
    res.status(200).json(tables);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch tables", error });
  }
};

// 3. Delete Table
export const deleteTable = async (req, res) => {
  try {
    await Table.findByIdAndDelete(req.params.id);
    res.status(200).json("Table deleted successfully");
  } catch (error) {
    res.status(500).json(error);
  }
};
