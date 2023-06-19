import { Injectable, InternalServerErrorException, Logger, BadRequestException, NotFoundException } from '@nestjs/common';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Product } from './entities/product.entity';
import { PaginationDTO } from 'src/common/dtos/pagination.dto';

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

  async findAll(paginationDTO: PaginationDTO) {
    const {limit = 10, offset = 0} = paginationDTO
    const products = await this.productRepository.find({
      take: limit,
      skip: offset
    });
    return products

  }

  async findOne(id: string) {

    const product = await this.productRepository.findOneBy({ id })

    if (!product) throw new NotFoundException(`Product with ${id} not found`);

    return product

  }



  update(id: number, updateProductDto: UpdateProductDto) {
    return `This action updates a #${id} product`;
  }

 async remove(id: string) {
   const product = await this.findOne(id);
   await this.productRepository.remove(product)
  }

  private handleDBExpeptions(error: any) {
    if (error.code == '23505')
      throw new BadRequestException(error.detail)

    this.logger.error(error)
    throw new InternalServerErrorException('Unexecpted error, check server logs')
  }
}
