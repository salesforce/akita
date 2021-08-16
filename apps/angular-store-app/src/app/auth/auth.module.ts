import { NgModule } from '@angular/core';
import { LoginModule } from './login/login.module';
import { AuthEffects } from './state/auth.effects';
import { AkitaNgEffectsModule } from '@datorama/akita-ng-effects';

@NgModule({
  imports: [LoginModule, AkitaNgEffectsModule.forFeature([AuthEffects])],
})
export class AuthModule {}
