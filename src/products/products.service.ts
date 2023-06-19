import { Injectable, InternalServerErrorException, Logger, BadRequestException, NotFoundException } from '@nestjs/common';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Product } from './entities/product.entity';
import { PaginationDTO } from 'src/common/dtos/pagination.dto';
import { validate as isUUID } from "uuid";



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
    const { limit = 10, offset = 0 } = paginationDTO
    const products = await this.productRepository.find({
      take: limit,
      skip: offset
    });
    return products

  }

  async findOne(term: string) {

    let product: Product;

    if (isUUID(term)) {
      product = await this.productRepository.findOneBy({ id: term })
    } else {
      const queryBuilder = this.productRepository.createQueryBuilder();
      product = await queryBuilder
        .where('UPPER(title) =:title or slug =:slug', {
          title: term.toUpperCase(),
          slug: term.toLowerCase(),
        }).getOne();
    }

    if (!product) throw new NotFoundException(`Product with ${term} not found`);

    return product

  }



  async update(id: string, updateProductDto: UpdateProductDto) {

    const product = await this.productRepository.preload({
      id: id,
      ...updateProductDto
    });

    if (!product) throw new NotFoundException(`Product with id : ${id} not found`);

    try {
      await this.productRepository.save(product);
      return product

    } catch (error) {
      this.handleDBExpeptions(error)
    }
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
