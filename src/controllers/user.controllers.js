import { asyncHandler } from '../utils/asyncHandler.js';

export const registerUser = asyncHandler(async (req, res) => {
  const { username, password } = req.body;

  // Here you would typically handle user registration logic, such as saving the user to a database.
  // For demonstration purposes, we'll just send a success response.

  if (!username || !password) {
    return res.status(400).json({ message: 'Username and password are required.' });
  }

  // Simulate user registration success
  res.status(201).json({ message: 'User registered successfully', user: { username } });
});  