export class CreateEventDto {
  readonly sport: string;
  readonly title: string;
  readonly startTime: Date;
  readonly status?: string;
}
