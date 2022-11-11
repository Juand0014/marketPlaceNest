import { Controller, Get } from '@nestjs/common';
import { Auth } from '../auth/decorator';
import { ValidRoles } from '../auth/interfaces';
import { SeedService } from './seed.service';

@Controller('seed')
export class SeedController {
  constructor(private readonly seedService: SeedService) {
  }

  @Get()
  @Auth( ValidRoles.admin )
  executedSeed(){
    this.seedService.runSeed();
    return "SEED EXECUTED";
  }
}