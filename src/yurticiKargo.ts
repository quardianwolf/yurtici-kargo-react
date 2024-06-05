import axios from "axios";
import xmljs from "xml-js";

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
  // Diğer parametreler buraya eklenebilir...
}

export class YurticiKargo {
  private url: string;
  private oAuth: string;
  private cleanResult: boolean;

  constructor(attributes: YurticiKargoAttributes = {}) {
    if (attributes.testMode) {
      this.url =
        "http://testwebservices.yurticikargo.com:9090/KOPSWebServices/ShippingOrderDispatcherServices?wsdl";

      this.oAuth = `<wsUserName>YKTEST</wsUserName>
                            <wsPassword>YK</wsPassword>
                            <userLanguage>TR</userLanguage>`;
    } else {
      this.url =
        "http://webservices.yurticikargo.com:8080/KOPSWebServices/ShippingOrderDispatcherServices?wsdl";

      this.oAuth = `<wsUserName>${attributes.wsUserName}</wsUserName>
                            <wsPassword>${attributes.wsPassword}</wsPassword>
                            <userLanguage>${attributes.wsLanguage}</userLanguage>`;
    }

    this.cleanResult = attributes.cleanResult ?? true;
  }

  public async createShipment(data: ShipmentData): Promise<any> {
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

    const createShipmentResponse =
      result["env:Envelope"]["env:Body"]["ns1:createShipmentResponse"];
    const Err =
      result["env:Envelope"]["env:Body"]["ns1:createShipmentResponse"][
        "ShippingOrderResultVO"
      ];

    const Response = createShipmentResponse.ShippingOrderResultVO.outResult;
    const Jobid = createShipmentResponse.ShippingOrderResultVO.jobId;
    const ErrorMsg =
      createShipmentResponse.ShippingOrderResultVO.shippingOrderDetailVO
        .errMessage;

    const kargoRes = {
      Status: Response._text,
      JobId: Jobid._text,
    };

    if (Response._text === "Başarılı") {
      return { status: "success", data: kargoRes };
    } else {
      return { status: "error", data: ErrorMsg };
    }
  }

  // Diğer fonksiyonlar da buraya eklenebilir...
  private async sendRequest(xml: string): Promise<any> {
    try {
      const response = await axios.post(this.url, xml, {
        headers: { "Content-Type": "text/xml" },
      });

      const result = xmljs.xml2js(response.data, {
        compact: true,
        ignoreDeclaration: true,
      });

      return result;
    } catch (error) {
      throw new Error(`SOAP isteği gönderilirken bir hata oluştu: ${error}`);
    }
  }
}