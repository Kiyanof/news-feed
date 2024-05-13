import mongoose from "mongoose";

interface UserType {
  email: string;
  password: string;
  frequency: string;
  prompt: string;
}

const UserSchema = new mongoose.Schema<UserType>({
  email: { 
    type: String, 
    required: true, 
    minlength: 10,
    maxlength: 50,
    validate: {
        validator: (v: string) => /\S+@\S+\.\S+/.test(v),
        message: 'Email must be a valid email address'
    }
  },
    password: { 
        type: String, 
        required: true, 
        minlength: 60, // bcrypt hashed password length
        maxlength: 60,
        validate: {
            validator: (v: string) => v.trim().length > 0,
            message: 'Password must not be empty'
        }
    },
  frequency: { 
    type: String, 
    required: true, 
    validate: {
        validator: (v: string) => ['daily', 'weekly', 'monthly'].includes(v),
        message: 'Frequency must be daily, weekly, or monthly'
    }
  },
  prompt: { 
    type: String, 
    required: true,
    minlength: 10,
    maxlength: 255, 
    trim: true,
    validate: {
        validator: (v: string) => v.trim().length > 0,
        message: 'Prompt must not be empty'
    }
  },
});

const UserModel = mongoose.model<UserType>('User', UserSchema);
export default UserModel;
