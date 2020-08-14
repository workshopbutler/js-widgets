export interface ITemplate {
  render(data: any): string;
}

export interface ITemplates {
  readonly attendeesPage: ITemplate;
  readonly attendeesList: ITemplate;
  readonly schedule: ITemplate;
  readonly testimonialList: ITemplate;
  readonly nextEvent: ITemplate;
  readonly promo: ITemplate;
  readonly eventPage: ITemplate;
  readonly trainerList: ITemplate;
  readonly trainerProfile: ITemplate;
  readonly registrationPage: ITemplate;
  readonly sidebarEventList: ITemplate;
}
