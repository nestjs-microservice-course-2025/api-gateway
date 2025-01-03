import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Inject,
  Query,
  ParseIntPipe,
} from '@nestjs/common';
import { ClientProxy, RpcException } from '@nestjs/microservices';
import { firstValueFrom } from 'rxjs';
import { PaginationDto } from 'src/common/dto';
import { NATS_SERVICE } from 'src/config';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';

@Controller('products')
export class ProductsController {
  constructor(@Inject(NATS_SERVICE) private readonly natsClient: ClientProxy) {}
  @Post()
  async createProduct(@Body() createProductDto: CreateProductDto) {
    try {
      const product = await firstValueFrom(
        this.natsClient.send({ cmd: 'create_product' }, createProductDto),
      );
      return product;
    } catch (error) {
      throw new RpcException(error);
    }
  }

  @Get()
  findAll(@Query() paginationDto: PaginationDto) {
    return this.natsClient.send(
      { cmd: 'find_all_products' },
      { /*limit: 50 , page: 2*/ ...paginationDto },
    );
  }

  @Get(':id')
  async findOne(@Param('id', ParseIntPipe) id: string) {
    // Se puede trabajar con Observables
    // return this.productsService
    //   .send({ cmd: 'find_product_by_id' }, { id })
    //   .pipe(
    //     catchError((error) => {
    //       throw new RpcException(error);
    //     }),
    //   );

    try {
      const product = await firstValueFrom(
        this.natsClient.send({ cmd: 'find_product_by_id' }, { id }),
      );
      return product;
    } catch (error) {
      throw new RpcException(error);
    }
  }

  @Patch(':id')
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateProductDto: UpdateProductDto,
  ) {
    try {
      const product = await firstValueFrom(
        this.natsClient.send(
          { cmd: 'update_product' },
          { id, ...updateProductDto },
        ),
      );
      return product;
    } catch (error) {
      throw new RpcException(error);
    }
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    try {
      const product = await firstValueFrom(
        this.natsClient.send({ cmd: 'delete_product' }, { id }),
      );
      return product;
    } catch (error) {
      throw new RpcException(error);
    }
  }

  @Delete('soft/:id')
  async softRemove(@Param('id') id: string) {
    try {
      const product = await firstValueFrom(
        this.natsClient.send({ cmd: 'soft_delete_product' }, { id }),
      );
      return product;
    } catch (error) {
      throw new RpcException(error);
    }
  }
}
