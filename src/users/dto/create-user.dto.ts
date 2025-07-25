export class CreateUserDto {
  readonly email: string;
  readonly password: string;
}

export class LoginDto {
  readonly email: string;
  readonly password: string;
}
