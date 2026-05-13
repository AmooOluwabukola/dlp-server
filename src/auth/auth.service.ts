import {
  Injectable,
  UnauthorizedException,
  ConflictException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { User } from 'src/models/user';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { RegisterDto, LoginDto } from './dto/auth.dto';
import { SuccessResponse } from 'src/utils/http';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(
    private jwtService: JwtService,
    @InjectModel(User.name) private userModel: Model<User>,
  ) {}

  private generateToken(user: any) {
    const payload = {
      email: user.email,
      sub: user._id,
      role: user.role,
    };

    return this.jwtService.sign(payload);
  }

  async register(registerDto: RegisterDto): Promise<SuccessResponse> {
    const { email } = registerDto;

    const existingUser = await this.userModel.findOne({ email });
    if (existingUser) {
      throw new ConflictException('User with this email already exists');
    }
    const hashedPassword = await bcrypt.hash(registerDto.password, 10);

    const newUser = new this.userModel({
      name: registerDto.name,
      email: registerDto.email,
      role: registerDto.role,
      password: hashedPassword,
    });
    await newUser.save();

    const token = this.generateToken(newUser);

    return new SuccessResponse('User registered successfully', {
      token,
      user: { name: newUser.name, email: newUser.email, role: newUser.role },
    });
  }

  async login(loginDto: LoginDto): Promise<SuccessResponse> {
    const user = await this.userModel.findOne({ email: loginDto.email });
    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const isPasswordValid = await bcrypt.compare(
      loginDto.password,
      user.password,
    );

    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const token = this.generateToken(user);
    return new SuccessResponse('User logged in successfully', {
      token,
      user: { name: user.name, email: user.email, role: user.role },
    });
  }
}
