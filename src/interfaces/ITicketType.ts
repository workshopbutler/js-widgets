export default interface ITicketType {
    readonly numberOfTicketsLeft: number;

    /**
     * Returns true if no more seats left
     * @return {boolean}
     */
    isSoldOut(): boolean
}
