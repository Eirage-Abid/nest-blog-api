import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Post } from './schemas/post.schema';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';

@Injectable()
export class PostsService {
  constructor(@InjectModel(Post.name) private postModel: Model<Post>) {}

  async create(createDto: CreatePostDto, authorId: string) {
    const created = new this.postModel({
      ...createDto,
      author: new Types.ObjectId(authorId),
    });
    return created.save();
  }

  async findAll() {
    // optionally populate author
    return this.postModel.find().populate('author', 'username email').exec();
  }

  async findOne(id: string) {
    const post = await this.postModel.findById(id).populate('author', 'username email').exec();
    if (!post) throw new NotFoundException('Post not found');
    return post;
  }

  async update(id: string, updateDto: UpdatePostDto, userId: string) {
    const post = await this.postModel.findById(id).exec();
    if (!post) throw new NotFoundException('Post not found');

    if (post.author.toString() !== userId) {
      throw new ForbiddenException('You are not the author of this post');
    }

    Object.assign(post, updateDto);
    return post.save();
  }

  async remove(id: string, userId: string) {
    const post = await this.postModel.findById(id).exec();
    if (!post) throw new NotFoundException('Post not found');

    if (post.author.toString() !== userId) {
      throw new ForbiddenException('You are not the author of this post');
    }

    return this.postModel.findByIdAndDelete(id).exec();
  }
}
