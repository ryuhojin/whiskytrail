import { Module } from '@nestjs/common';
import { WhiskeyController } from './whiskey.controller';
import { WhiskeyService } from './whiskey.service';

@Module({
  controllers: [WhiskeyController],
  providers: [WhiskeyService]
})
export class WhiskeyModule {}
