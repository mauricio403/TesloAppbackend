import { Injectable, InternalServerErrorException, Logger, BadRequestException } from '@nestjs/common';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Product } from './entities/product.entity';

@Injectable()
export class ProductsService {


  private readonly logger = new Logger('ProductsService');


  constructor(
    @InjectRepository(Product)
    private readonly productRepository: Repository<Product>,

  ) { }


  async create(createProductDto: CreateProductDto) {

    try {
      //creacion de registro o instancia
      const product = this.productRepository.create(createProductDto);

      //impacto en BD
      await this.productRepository.save(product);
      return product;


    } catch (error) {
      this.handleDBExpeptions(error)
    }


  }

  findAll() {
    return `This action returns all products`;
  }

  findOne(id: number) {
    return `This action returns a #${id} product`;
  }

  update(id: number, updateProductDto: UpdateProductDto) {
    return `This action updates a #${id} product`;
  }

  remove(id: number) {
    return `This action removes a #${id} product`;
  }

  private handleDBExpeptions(error: any) {
    if (error.code == '23505')
      throw new BadRequestException(error.detail)

    this.logger.error(error)
    throw new InternalServerErrorException('Unexecpted error, check server logs')
  }
}
