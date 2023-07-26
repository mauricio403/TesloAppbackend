import { Controller, Post, UploadedFile, UseInterceptors, BadRequestException } from '@nestjs/common';
import { FilesService } from './files.service';
import { FileInterceptor } from '@nestjs/platform-express';
import { fileFilter } from './helpers/fileFilter';
import { diskStorage } from 'multer';


@Controller('files')
export class FilesController {
  constructor(private readonly filesService: FilesService) { }


  @Post('product')
  @UseInterceptors( FileInterceptor('file', {
    fileFilter: fileFilter,
    // limits: {fileSize:1000}
    storage:diskStorage({
      destination:'./static/uploads'
    })
  }))
  uploadProductImage(
    @UploadedFile()  file: Express.Multer.File,
  ) {
    if(!file){
      throw new BadRequestException('Make sure that file is an image')
    }

    return {
      fileName: file.originalname
    }
  }


}
