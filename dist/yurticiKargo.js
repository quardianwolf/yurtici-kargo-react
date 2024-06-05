"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.YurticiKargo = void 0;
const axios_1 = __importDefault(require("axios"));
const xml_js_1 = __importDefault(require("xml-js"));
class YurticiKargo {
    constructor(attributes = {}) {
        var _a;
        if (attributes.testMode) {
            this.url =
                "http://testwebservices.yurticikargo.com:9090/KOPSWebServices/ShippingOrderDispatcherServices?wsdl";
            this.oAuth = `<wsUserName>YKTEST</wsUserName>
                            <wsPassword>YK</wsPassword>
                            <userLanguage>TR</userLanguage>`;
        }
        else {
            this.url =
                "http://webservices.yurticikargo.com:8080/KOPSWebServices/ShippingOrderDispatcherServices?wsdl";
            this.oAuth = `<wsUserName>${attributes.wsUserName}</wsUserName>
                            <wsPassword>${attributes.wsPassword}</wsPassword>
                            <userLanguage>${attributes.wsLanguage}</userLanguage>`;
        }
        this.cleanResult = (_a = attributes.cleanResult) !== null && _a !== void 0 ? _a : true;
    }
    async createShipment(data) {
        const acceptedParameters = [
            "cargoKey",
            "invoiceKey",
            "receiverCustName",
            "receiverAddress",
            "cityName",
            "townName",
            "receiverPhone1",
            "emailAddress",
            "orgReceiverCustId",
            // Diğer kabul edilen parametreler buraya eklenebilir...
        ];
        let xml = `<soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/" xmlns:ship="http://yurticikargo.com.tr/ShippingOrderDispatcherServices">
                    <soapenv:Header/>
                    <soapenv:Body>
                    <ship:createShipment>
                        ${this.oAuth}
                        <ShippingOrderVO>`;
        for (const [param, value] of Object.entries(data)) {
            if (acceptedParameters.includes(param)) {
                xml += `<${param}>${value}</${param}>`;
            }
        }
        xml += `</ShippingOrderVO>
                    </ship:createShipment>
                    </soapenv:Body>
                    </soapenv:Envelope>`;
        const result = await this.sendRequest(xml);
        const createShipmentResponse = result["env:Envelope"]["env:Body"]["ns1:createShipmentResponse"];
        const Err = result["env:Envelope"]["env:Body"]["ns1:createShipmentResponse"]["ShippingOrderResultVO"];
        const Response = createShipmentResponse.ShippingOrderResultVO.outResult;
        const Jobid = createShipmentResponse.ShippingOrderResultVO.jobId;
        const ErrorMsg = createShipmentResponse.ShippingOrderResultVO.shippingOrderDetailVO
            .errMessage;
        const kargoRes = {
            Status: Response._text,
            JobId: Jobid._text,
        };
        if (Response._text === "Başarılı") {
            return { status: "success", data: kargoRes };
        }
        else {
            return { status: "error", data: ErrorMsg };
        }
    }
    // Diğer fonksiyonlar da buraya eklenebilir...
    async sendRequest(xml) {
        try {
            const response = await axios_1.default.post(this.url, xml, {
                headers: { "Content-Type": "text/xml" },
            });
            const result = xml_js_1.default.xml2js(response.data, {
                compact: true,
                ignoreDeclaration: true,
            });
            return result;
        }
        catch (error) {
            throw new Error(`SOAP isteği gönderilirken bir hata oluştu: ${error}`);
        }
    }
}
exports.YurticiKargo = YurticiKargo;
//# sourceMappingURL=yurticiKargo.js.map