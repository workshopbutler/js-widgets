export interface ITemplate {
    render(data: any): string
}

export interface ITemplates {
    readonly schedule: ITemplate;
    readonly endorsementList: ITemplate;
    readonly eventPage: ITemplate;
    readonly trainerList: ITemplate;
    readonly trainerProfile: ITemplate;
    readonly registrationPage: ITemplate;
    readonly sidebarEventList: ITemplate;
}
