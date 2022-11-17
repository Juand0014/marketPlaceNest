import { Controller, Get } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { Auth } from '../auth/decorator';
import { ValidRoles } from '../auth/interfaces';
import { SeedService } from './seed.service';

@ApiTags('Seed')
@Controller('seed')
export class SeedController {
  constructor(private readonly seedService: SeedService) {
  }

  @Get()
  @Auth( ValidRoles.admin )
  @ApiBearerAuth()
  executedSeed(){
    return this.seedService.runSeed();;
  }
}