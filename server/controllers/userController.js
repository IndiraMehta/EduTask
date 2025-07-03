import User from '../models/User.js';

export const saveUserProfile = async (req, res) => {
  try {
    const { uid, name, email, role, branch, year } = req.body;
    
    const existingUser = await User.findOne({ uid });
    if (existingUser) {
      return res.status(200).json(existingUser);
    }

    const user = new User({
      uid,
      name,
      email,
      role,
      branch,
      year
    });

    await user.save();
    res.status(201).json(user);
  } catch (error) {
    console.error('Error saving user profile:', error);
    res.status(500).json({ error: 'Failed to save user profile' });
  }
};

export const getUserProfile = async (req, res) => {
  try {
    const user = await User.findOne({ uid: req.user.uid });
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    res.json(user);
  } catch (error) {
    console.error('Error fetching user profile:', error);
    res.status(500).json({ error: 'Failed to fetch user profile' });
  }
};