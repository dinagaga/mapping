import { Payment } from "../models/payment.js"
import { User } from "../models/user.js"
import { adminCreateUser } from "../models/adminCreateUser.js"

// Function to post a new payment
const postPayment = async (req, res) => {
  try {
    const {
      userId,
      paymentType,
      amount,
      processingFee,
      totalAmount,
      cardDetails,
      transactionId,
      paymentDate,
    } = req.body

    // Validate required fields
    if (!userId || !amount || !paymentType || !paymentDate) {
      return res.status(400).json({ message: "Required fields are missing" })
    }

    const user = await adminCreateUser.findOne({ _id: userId });
    const houseId = user ? user.houseId : null;

    if (!houseId) {
      return res.status(400).json({ message: "No houseId found for this requester" });
    }

    // Create a new payment
    const newPayment = new Payment({
      userId,
      houseId,
      paymentType,
      amount,
      processingFee,
      totalAmount,
      cardDetails,
      transactionId,
      paymentDate,
      status: "recieved",
    })

    // Save the payment to the database
    await newPayment.save()

    return res.status(201).json({ message: "Payment created successfully", payment: newPayment })
  } catch (error) {
    console.error("Error creating payment:", error)
    return res.status(500).json({ message: "Server error while creating payment", error: error.message })
  }
}

// Function to get payments by user ID
import mongoose from "mongoose"

const getPaymentsByUserId = async (req, res) => {
  try {
    const userId = req.params.userId

    // Validate user ID
    if (!userId) {
      return res.status(400).json({ message: "User ID is required" })
    }

    // Find payments by user ID (string match)
    const userPayments = await Payment.find({ userId: userId }).sort({ paymentDate: -1 })

    // If no payments found, return empty array
    if (!userPayments || userPayments.length === 0) {
      return res.status(200).json([])
    }

    // Remove user existence check, since Payment.userId is not guaranteed to match User _id
    return res.status(200).json(userPayments)
  } catch (error) {
    console.error("Error fetching payments:", error)
    return res.status(500).json({ message: "Server error while fetching payments" })
  }
}

// Function to get all payments for admin view
const getAllPayments = async (req, res) => {
  try {
    const payments = await Payment.find().sort({ paymentDate: -1 })
    return res.status(200).json(payments)
  } catch (error) {
    console.error("Error fetching all payments:", error)
    return res.status(500).json({ message: "Server error while fetching payments" })
  }
}

export { postPayment, getPaymentsByUserId, getAllPayments }
