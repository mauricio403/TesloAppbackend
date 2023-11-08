import { Controller, Get, Post, Body, Patch, Param, Delete, ParseUUIDPipe, Query } from '@nestjs/common';
import { ProductsService } from './products.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { PaginationDTO } from 'src/common/dtos/pagination.dto';
import { Auth } from '../auth/decorators/auth.decorator';
import { getUser } from 'src/auth/decorators/get-user.decorator';
import { User } from 'src/auth/entities/user.entity';

@Controller('products')
@Auth()
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  @Post()
  create(
    @Body() createProductDto: CreateProductDto,
    @getUser() user:User
    ) {
    return this.productsService.create(createProductDto, user);
  }

  @Get()
  findAll(@Query() paginationDTO:  PaginationDTO) {
    return this.productsService.findAll(paginationDTO);
  }

  @Get(':term')
  findOne(@Param('term') term: string) {
    return this.productsService.findOne(term);
  }

  @Patch(':id')
  
  update(@Param('id', ParseUUIDPipe) id: string, @Body() updateProductDto: UpdateProductDto,  @getUser() user:User) {
    return this.productsService.update(id, updateProductDto, user);
  }

  @Delete(':id')
  remove(@Param('id', ParseUUIDPipe) id: string) {
    return this.productsService.remove(id);
  }
}
