import { Notification } from "../models/notification.js"
import { adminCreateUser } from "../models/adminCreateUser.js"

const postNotification = async (req, res) => {
  try {
    const { type, recipient, subject, message, priority } = req.body;

    if (!type || !recipient || !subject || !message || !priority) {
      return res.status(400).json({ message: "Please fill all fields" });
    }

    // If sending to all households
    if (recipient === "All Households") {
      // Fetch all users of type "customer"
      const householdUsers = await adminCreateUser.find({ type: "customer" });

      if (!householdUsers.length) {
        return res.status(404).json({ message: "No customer users found" });
      }

      // Extract unique blocks from the users
      const uniqueBlocks = [...new Set(householdUsers.map(user => user.block))];

      // Create one notification per block
      const notifications = await Promise.all(
        uniqueBlocks.map(block => {
          let formattedBlock;

          switch (block.toLowerCase()) {
            case "a":
              formattedBlock = "Block A";
              break;
            case "b":
              formattedBlock = "Block B";
              break;
            case "c":
              formattedBlock = "Block C";
              break;
            case "d":
              formattedBlock = "Block D";
              break;
            default:
              formattedBlock = "Pending";
          }

          return Notification.create({
            type,
            recipient: formattedBlock,
            subject,
            message,
            priority,
          });
        })
      );

      return res.status(201).json({
        message: `Notification sent to ${notifications.length} blocks`,
        notifications,
      });
    }

    // Otherwise send to a specific recipient
    const newNotification = await Notification.create({
      type,
      recipient,
      subject,
      message,
      priority,
    });

    return res.status(201).json(newNotification);
  } catch (error) {
    console.error("Notification creation error:", error);
    return res.status(500).json({ message: "Server error while processing Notification" });
  }
};


// Add this function to get all Notifications
const getAllNotifications = async (req, res) => {
  try {
    const Notifications = await Notification.find({})
    return res.status(200).json(Notifications)
  } catch (error) {
    console.error("Error fetching Notifications:", error)
    return res.status(500).json({ message: "Server error while fetching Notifications" })
  }
}

const getNotificationById = async (req, res) => {
  try {
    const { userId } = req.params;

    if (!userId) {
      return res.status(400).json({ message: "User ID is required" });
    }

    const user = await adminCreateUser.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const block = user.block;
    let formattedBlock;

    switch (block?.toLowerCase()) {
      case "a":
        formattedBlock = "Block A";
        break;
      case "b":
        formattedBlock = "Block B";
        break;
      case "c":
        formattedBlock = "Block C";
        break;
      case "d":
        formattedBlock = "Block D";
        break;
      default:
        formattedBlock = "Pending";
    }

    const notifications = await Notification.find({ recipient: formattedBlock }).sort({ createdAt: -1 });

    return res.status(200).json({
      block: formattedBlock,
      notifications,
    });
  } catch (error) {
    console.error("Error fetching notifications:", error);
    return res.status(500).json({ message: "Server error while fetching notifications" });
  }
};


export { postNotification, getAllNotifications, getNotificationById }