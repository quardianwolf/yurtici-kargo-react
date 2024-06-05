interface YurticiKargoAttributes {
    testMode?: boolean;
    wsUserName?: string;
    wsPassword?: string;
    wsLanguage?: string;
    cleanResult?: boolean;
}
export interface ShipmentData {
    cargoKey: string;
    invoiceKey: string;
    receiverCustName: string;
    receiverAddress: string;
    cityName: string;
    townName: string;
    receiverPhone1: string;
    emailAddress: string;
    orgReceiverCustId: string;
}
export declare class YurticiKargo {
    private url;
    private oAuth;
    private cleanResult;
    constructor(attributes?: YurticiKargoAttributes);
    createShipment(data: ShipmentData): Promise<any>;
    private sendRequest;
}
export {};
