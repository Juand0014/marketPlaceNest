import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  ParseUUIDPipe,
  Query,
} from '@nestjs/common';
import { ApiBearerAuth, ApiResponse, ApiTags } from '@nestjs/swagger';
import { ProductsService } from './products.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { PaginationDto } from '../common/dtos/pagination.dto';
import { Auth, GetUser } from '../auth/decorator';
import { User } from '../auth/entities/user.entity';
import { Product } from './entities';
import { ValidRoles } from 'src/auth/interfaces';

@ApiTags('Products')
@Controller('products')
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  @Post()
  @Auth()
  @ApiBearerAuth()
  @ApiResponse({ status: 201, description: 'product was created', type: Product})
  @ApiResponse({ status: 400, description: 'Bad request'})
  @ApiResponse({ status: 403, description: 'Forbidden. Token related'})
  create(
    @Body() createProductDto: CreateProductDto,
    @GetUser() user: User
    ) {
    return this.productsService.create(createProductDto, user);
  }

  @Get()
  @ApiResponse({ status: 404, description: 'Products not found'})
  @ApiResponse({ status: 200, description: 'Products was found', type: Product})
  findAll(@Query() paginationDto: PaginationDto) {
    return this.productsService.findAll(paginationDto);
  }

  @Get(':term')
  @ApiResponse({ status: 404, description: 'Product not found'})
  @ApiResponse({ status: 200, description: 'Product was found', type: Product})
  findOne(@Param('term') term: string) {
    return this.productsService.findOnePlain(term);
  }

  @Patch(':id')
  @ApiResponse({ status: 404, description: 'Product not found'})
  @ApiResponse({ status: 200, description: 'Product was updated', type: Product})
  update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateProductDto: UpdateProductDto,
    @GetUser() user: User
  ) {
    return this.productsService.update(id, updateProductDto, user);
  }

  @Delete(':id')
  @ApiBearerAuth()
  @Auth( ValidRoles.admin, ValidRoles.superUser )
  @ApiResponse({ status: 404, description: 'Product not found'})
  @ApiResponse({ status: 200, description: 'Product was deleted', type: Product})
  remove(@Param('id', ParseUUIDPipe) id: string) {
    return this.productsService.remove(id);
  }
}
