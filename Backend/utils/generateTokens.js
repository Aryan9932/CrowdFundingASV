import jwt from 'jsonwebtoken';

export const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: '30d' });
};


export const validateToken = (token) => {
  console.log("validate token.....  ", token);
  const payload = jwt.verify(token, process.env.JWT_SECRET);
  return payload;
}


