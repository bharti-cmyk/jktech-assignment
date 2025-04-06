import { Module } from '@nestjs/common';
import { AbilityFactory } from './ability.factory';

@Module({
  providers: [AbilityFactory],
  exports: [AbilityFactory], // Export AbilityFactory so it can be used in other modules
})
export class CaslModule {}
