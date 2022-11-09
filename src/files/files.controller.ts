import { Controller, Get, Post, Body, Patch, Param, Delete, UploadedFile, UseInterceptors, BadRequestException, Res } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { FileInterceptor } from '@nestjs/platform-express';
import { Response } from 'express';
import { diskStorage } from 'multer';
import { fileFilter, fileNamer } from 'src/helpers';
import { FilesService } from './files.service';

@Controller('files')
export class FilesController {
  constructor(
    private readonly filesService: FilesService,
    private readonly configServices: ConfigService
    ) {}

  @Get('product/:imageName')
  findProductImage(
    @Res() res: Response,
    @Param('imageName') imageName: string
  ){
    const path = this.filesService.getStaticProducImage(imageName)
    res.sendFile(path);
  }

  @Post('product')
  @UseInterceptors( FileInterceptor('file', {
    fileFilter: fileFilter,
    // limits: { fileSize: 1024 * 1024 * 5 }
    storage: diskStorage({
      destination: './static/products',
      filename: fileNamer
    })
  }) )
  uploadFileImage( 
    @UploadedFile() file: Express.Multer.File
  ){

    if( !file ) {
      throw new BadRequestException('No file provided');
    }

    const secureUrl = `${this.configServices.get('HOST_API')}/api/files/${file.filename}`

    return {
      secureUrl 
    }
  }
}