export interface ITemplate {
    render(data: any): string
}

export interface ITemplates {
    readonly eventList: ITemplate;
    readonly eventPage: ITemplate;
    readonly trainerList: ITemplate;
    readonly trainerPage: ITemplate;
    readonly registrationPage: ITemplate;
    readonly sidebar: ITemplate;
}
