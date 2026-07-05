import User from "../models/UserSchema.js";
import generateToken from "../utils/generateToken.js";

// 🔐 REGISTER
export const registerUser = async (req, res) => {
  try {
    const { name, email, password, role } = req.body;
    
    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ message: "An account with this email already exists" });
    }

    const user = await User.create({
      name,
      email,
      password,
      role: role || "client", // Use provided role or default to client
    });

    res.status(201).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      token: generateToken(user._id),
    });

  } catch (error) {
    if (error.code === 11000) {
      return res.status(400).json({ message: "Username or Email already exists" });
    }
    res.status(500).json({ message: error.message });
  }
};

// 🔑 LOGIN
export const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });

    if (user && (await user.matchPassword(password))) {
      // Update last_login
      user.last_login = Date.now();
      await user.save();

      res.json({
        _id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        role: user.role,
        last_login: user.last_login,
        isActive: user.isActive,
        suspended: user.suspended,
        token: generateToken(user._id),
      });
    } else {
      res.status(401).json({ message: "Invalid email or password" });
    }

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// 👤 GET ALL USERS (Admin Only - includes Active Status logic)
export const getUsers = async (req, res) => {
  try {
    const users = await User.find().select("-password");
    
    // Compute activity status for each user
    // A user is active if:
    // - Logged in within the last 7 days
    // OR
    // - Has an ongoing order (added later in orderController logic or helper)
    
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
    
    const usersWithStatus = users.map(user => {
      const isRecentlyLoggedIn = user.last_login && user.last_login >= sevenDaysAgo;
      return {
        ...user.toObject(),
        activityStatus: isRecentlyLoggedIn ? "Active" : "Inactive"
      };
    });
    
    res.json(usersWithStatus);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// 👤 ADMIN: Update User (Edit Client)
export const updateUserInfo = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ message: "User not found" });

    user.name = req.body.name || user.name;
    user.email = req.body.email || user.email;
    user.phone = req.body.phone || user.phone;
    user.role = req.body.role || user.role;
    user.isActive = req.body.isActive !== undefined ? req.body.isActive : user.isActive;

    const updatedUser = await user.save();
    res.json(updatedUser);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// 👤 ADMIN: Suspend/Unsuspend User
export const suspendUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ message: "User not found" });

    user.suspended = !user.suspended;
    await user.save();

    res.json({ message: `User ${user.suspended ? 'suspended' : 'activated'} successfully`, user });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// 👤 GET CURRENT USER
export const getMe = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-password");

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json(user);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// 👤 UPDATE USER PROFILE (including email)
export const updateUserProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Update fields if provided
    if (req.body.name !== undefined) user.name = req.body.name;
    if (req.body.phone !== undefined) user.phone = req.body.phone;
    if (req.body.username !== undefined) user.username = req.body.username;
    if (req.body.displayName !== undefined) user.displayName = req.body.displayName;
    if (req.body.bio !== undefined) user.bio = req.body.bio;
    if (req.body.avatar !== undefined) user.avatar = req.body.avatar;
    if (req.body.preferences !== undefined) {
      user.preferences = { ...user.preferences, ...req.body.preferences };
    }
    
    // Update email if provided and different from current
    if (req.body.email && req.body.email !== user.email) {
      const existingUser = await User.findOne({ 
        email: req.body.email,
        _id: { $ne: user._id }
      });
      if (existingUser) {
        return res.status(400).json({ message: "Email already in use" });
      }
      user.email = req.body.email;
    }
    
    // Update password if provided
    if (req.body.password) {
      user.password = req.body.password;
    }

    const updatedUser = await user.save();

    res.json({
      _id: updatedUser._id,
      name: updatedUser.name,
      email: updatedUser.email,
      phone: updatedUser.phone,
      username: updatedUser.username,
      displayName: updatedUser.displayName,
      bio: updatedUser.bio,
      avatar: updatedUser.avatar,
      preferences: updatedUser.preferences,
      role: updatedUser.role,
      token: generateToken(updatedUser._id),
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};