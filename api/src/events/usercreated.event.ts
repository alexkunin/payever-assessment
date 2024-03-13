export class UserCreatedEvent {
  static EVENT = 'user.created';

  constructor(readonly id: number) {}
}
