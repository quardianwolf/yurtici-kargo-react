// route.ts

import { NextResponse, NextRequest } from "next/server";
import { YurticiKargo, ShipmentData } from "yurtici-kargo-react"; // YurticiKargo sınıfını içeri aktar

export async function OPTIONS() {
  return NextResponse.json({});
}

//contact info@atilla.dev

export async function POST(req: NextRequest, { params }: { params: {} }) {
  try {
    const body = await req.json();

    const shipmentData: ShipmentData = {
      cargoKey: body.cargoKey,
      invoiceKey: body.invoiceKey,
      receiverCustName: body.receiverCustName,
      receiverAddress: body.receiverAddress,
      cityName: body.cityName,
      townName: body.townName,
      receiverPhone1: body.receiverPhone1,
      emailAddress: body.emailAddress,
      orgReceiverCustId: body.orgReceiverCustId,
    };

    const yurticiKargo = new YurticiKargo({ testMode: true }); // Test mode active or not
    const result = await yurticiKargo.createShipment(shipmentData);

    console.log("result", result);

    return NextResponse.json({ status: "success", data: result });
  } catch (error) {
    console.error("kargo create", error);
    return NextResponse.json(
      { status: "error", message: "Internal Server Error" },
      { status: 500 }
    );
  }
}


