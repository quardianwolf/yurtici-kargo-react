## Yurtici Kargo React (framework entegration package)

Yurtici Cargo React/TS Integration Package This package provides integration with Yurtici Cargo's web services for React and TypeScript projects.
It facilitates the creation of shipments and handling responses from the Yurtici Cargo API.

1-Step install the package

    npm i yurtici-kargo-react

2-Usage of package

    import { YurticiKargo, ShipmentData } from "yurtici-kargo-react";

      const shipmentData: ShipmentData = {
      cargoKey: body.cargoKey, //You can update the values ​​here according to your own code.
      invoiceKey: body.invoiceKey, //You can update the values ​​here according to your own code.
      receiverCustName: body.receiverCustName, //You can update the values ​​here according to your own code.
      receiverAddress: body.receiverAddress, //You can update the values ​​here according to your own code.
      cityName: body.cityName, //You can update the values ​​here according to your own code.
      townName: body.townName, //You can update the values ​​here according to your own code.
      receiverPhone1: body.receiverPhone1, //You can update the values ​​here according to your own code.
      emailAddress: body.emailAddress, //You can update the values ​​here according to your own code.
      orgReceiverCustId: body.orgReceiverCustId, //You can update the values ​​here according to your own code.
    };

    const yurticiKargo = new YurticiKargo({ testMode: true }); // test mode active or not
    const result = await yurticiKargo.createShipment(shipmentData);

    console.log("result", result);  // you can check response here


# WARNING

This package is not affiliated with "Yurtiçi Kargo " It has been developed voluntarily by a software developer.

Contact:https://github.com/quardianwolf or info@atilla.dev
