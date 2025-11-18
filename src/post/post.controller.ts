import { Body, Controller, Delete, Get, Param, Patch, Post as HttpPost, UseGuards } from '@nestjs/common';
import { PostsService } from './post.service';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { GetUser } from '../common/decorators/get-user.decorator';

@Controller('posts')
export class PostsController {
  constructor(private postsService: PostsService) {}

  @Get()
  findAll() {
    return this.postsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.postsService.findOne(id);
  }

  // Protected: any authenticated user can create
  @UseGuards(JwtAuthGuard)
  @HttpPost()
  create(@Body() dto: CreatePostDto, @GetUser() user: any) {
    return this.postsService.create(dto, user.userId);
  }

  // Protected: only author can update
  @UseGuards(JwtAuthGuard)
  @Patch(':id')
  update(@Param('id') id: string, @Body() dto: UpdatePostDto, @GetUser() user: any) {
    return this.postsService.update(id, dto, user.userId);
  }

  // Protected: only author can delete
  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  remove(@Param('id') id: string, @GetUser() user: any) {
    return this.postsService.remove(id, user.userId);
  }
}
