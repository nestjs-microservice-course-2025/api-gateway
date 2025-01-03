import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Inject,
  Patch,
  ParseIntPipe,
  ParseUUIDPipe,
  Query,
} from '@nestjs/common';
import { ClientProxy, Payload, RpcException } from '@nestjs/microservices';
import { NATS_SERVICE } from 'src/config';
import { CreateOrderDto, OrderPaginationDto, StatusDto } from './dto';
import { firstValueFrom } from 'rxjs';
import { PaginationDto } from 'src/common/dto';

@Controller('orders')
export class OrdersController {
  constructor(@Inject(NATS_SERVICE) private readonly natsClient: ClientProxy) {}

  @Post()
  async create(@Payload() createOrderDto: CreateOrderDto) {
    // return this.natsClient.send('createOrder', createOrderDto);
    try {
      const createdOrder = await firstValueFrom(
        this.natsClient.send('createOrder', createOrderDto),
      );
      return createdOrder;
    } catch (error) {
      throw new RpcException(error);
    }
  }

  @Get()
  async findAll(@Query() orderPaginationDto: OrderPaginationDto) {
    try {
      const orders = await firstValueFrom(
        this.natsClient.send('findAllOrders', {
          /*limit: 50 , page: 2*/ ...orderPaginationDto,
        }),
      );
      return orders;
    } catch (error) {
      throw new RpcException(error);
    }
  }

  @Get(':id')
  async findOne(@Param('id', ParseUUIDPipe) id: string) {
    try {
      const order = await firstValueFrom(
        this.natsClient.send('findOneOrder', { id }),
      );
      return order;
    } catch (error) {
      throw new RpcException(error);
    }
  }

  @Get('status/:status')
  async findAllByStatus(
    @Param() statusDto: StatusDto,
    @Query() paginationDto: PaginationDto,
  ) {
    try {
      const order = await firstValueFrom(
        this.natsClient.send('findAllOrders', {
          ...paginationDto,
          status: statusDto.status,
        }),
      );
      return order;
    } catch (error) {
      throw new RpcException(error);
    }
  }

  @Patch(':id')
  async chageOrderStatus(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() statusDto: StatusDto,
  ) {
    try {
      const updatedOrder = await firstValueFrom(
        this.natsClient.send('changeOrderStatus', {
          id,
          status: statusDto.status,
        }),
      );
      return updatedOrder;
    } catch (error) {
      throw new RpcException(error);
    }
  }
}
