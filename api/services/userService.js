const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const userDao = require("../models/userDao");
const { validateEmailAndPassword } = require("../utils/validate");

const hashPassword = async (plaintextPassword) => {
  saltRounds = 10
  return await bcrypt.hash(plaintextPassword, saltRounds);
};

const getUserById = async (id) => {

  const result = await userDao.getUserById(id);

  return result;
};

const presignIn = async (phoneNumber) => {
  const phoneNumberCheck = await userDao.phoneNumberCheck(phoneNumber);

  return phoneNumberCheck;
};

const signUp = async (userName, phoneNumber,password, CI) => {
  validateEmailAndPassword(phoneNumber, password);
  const hashedPassword = await hashPassword(password);
  const createUser = await userDao.createUser(
    userName, 
    phoneNumber, 
    hashedPassword, 
    CI
  );

  return createUser;
};

const signIn = async (phoneNumber, password) => {
  const user = await userDao.getUserByPhoneNumber(phoneNumber);

  if (!user) {
    const error = new Error("INVALID_USER");
    error.statusCode = 404;
    throw error;
  }

  const isMatched = await bcrypt.compare(password, user.password);

  if (!isMatched) {
    const error = new Error("INVALID_PASSWORD");
    error.statusCode = 204;
    throw error;
  }

  const accessToken = jwt.sign(
    { id: user.id, phoneNumber: user.phoneNumber, grouping_id: user.grouping_id, userName: user.userName},
    process.env.JWT_SECRET,
    {
      algorithm: process.env.ALGORITHM,
      expiresIn: process.env.JWT_EXPIRES_IN,
    });
    return {
    id: user.id,
    grouping_id: user.grouping_id,
    userName: user.user_name,
    profileImage: user.profile_image,
    accessToken
  };
};

const changePassword = async(userId, existingPassword, newPassword) => {
  if (!userId || !existingPassword) {
    throw new Error('User not found');
  }
  const user = await userDao.findUserByUsername(userId);

  const isMatch = await bcrypt.compare(existingPassword, user.password);
  if (!isMatch) {
    return {message: "INVALID_PASSWORD" };
  }

  const hashedPassword = await hashPassword(newPassword);
  const passwordchange = await userDao.updatePassword(userId, hashedPassword);
  
  return passwordchange;
};

const updateProfileImageURL = async(userId, uploadedFileURL) =>{

  const getUserById = await userDao.getUserById(userId);

  const profileImage = await userDao.updateProfileImageURL(userId, uploadedFileURL);
  return profileImage;
}

const getDefaultProfileImage  = async(userId) => {

  const result =  await userDao.getDefaultProfileImage(userId);

  return result;
}
module.exports = { 
  presignIn, 
  getUserById, 
  signUp, 
  signIn,
  changePassword,
  updateProfileImageURL,
  getDefaultProfileImage
};
