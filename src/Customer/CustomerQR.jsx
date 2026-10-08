import React from "react";
import { QRCodeSVG } from "qrcode.react";
import "./CustomerQR.css";

function CustomerQR() {
  const customerUrl =
    `${window.location.origin}/?customer=true`;

  return (
    <div className="customer-qr-page">

      <div className="customer-qr-card">

        <div className="customer-qr-logo">
          BIGBREW
        </div>

        <h1>
          Scan to Order
        </h1>

        <p>
          Scan this QR code using your
          phone camera to view the BigBrew
          menu and place your order.
        </p>

        <div className="customer-qr-box">
          <QRCodeSVG
            value={customerUrl}
            size={230}
            bgColor="#ffffff"
            fgColor="#3d2920"
            level="H"
          />
        </div>

        <div className="customer-qr-info">

          <strong>
            BIGBREW
          </strong>

          <span>
            Putatan, Muntinlupa City
          </span>

        </div>

        <div className="customer-qr-url">
          {customerUrl}
        </div>

      </div>

    </div>
  );
}

export default CustomerQR;
