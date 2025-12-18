const emailTemplate = (
  clientname,
  fileCount,
  folderName,
  fullUrl,
) => `<!DOCTYPE HTML PUBLIC "-//W3C//DTD XHTML 1.0 Transitional //EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml" xmlns:v="urn:schemas-microsoft-com:vml" xmlns:o="urn:schemas-microsoft-com:office:office">
<head>
<!--[if gte mso 9]>
<xml>
  <o:OfficeDocumentSettings>
    <o:AllowPNG/>
    <o:PixelsPerInch>96</o:PixelsPerInch>
  </o:OfficeDocumentSettings>
</xml>
<![endif]-->
  <meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta name="x-apple-disable-message-reformatting">
  <!--[if !mso]><!--><meta http-equiv="X-UA-Compatible" content="IE=edge"><!--<![endif]-->
  <title></title>
  
    <style type="text/css">
      @media only screen and (min-width: 520px) {
  .u-row {
    width: 500px !important;
  }
  .u-row .u-col {
    vertical-align: top;
  }

  .u-row .u-col-21p53 {
    width: 107.65px !important;
  }

  .u-row .u-col-78p47 {
    width: 392.35px !important;
  }

  .u-row .u-col-100 {
    width: 500px !important;
  }

}

@media (max-width: 520px) {
  .u-row-container {
    max-width: 100% !important;
    padding-left: 0px !important;
    padding-right: 0px !important;
  }
  .u-row .u-col {
    min-width: 320px !important;
    max-width: 100% !important;
    display: block !important;
  }
  .u-row {
    width: calc(100% - 40px) !important;
  }
  .u-col {
    width: 100% !important;
  }
  .u-col > div {
    margin: 0 auto;
  }
}
body {
  margin: 0;
  padding: 0;
}

table,
tr,
td {
  vertical-align: top;
  border-collapse: collapse;
}

p {
  margin: 0;
}

.ie-container table,
.mso-container table {
  table-layout: fixed;
}

* {
  line-height: inherit;
}

a[x-apple-data-detectors='true'] {
  color: inherit !important;
  text-decoration: none !important;
}

table, td { color: #000000; } a { color: #0000ee; text-decoration: underline; } @media (max-width: 480px) { #u_content_image_2 .v-container-padding-padding { padding: 0px !important; } #u_content_image_2 .v-text-align { text-align: left !important; } #u_column_3 .v-col-padding { padding: 0px !important; } #u_content_text_3 .v-line-height { line-height: 100% !important; } }
    </style>
  
  

</head>

<body class="clean-body u_body" style="margin: 0;padding: 0;-webkit-text-size-adjust: 100%;background-color: #e7e7e7;color: #000000">
  <!--[if IE]><div class="ie-container"><![endif]-->
  <!--[if mso]><div class="mso-container"><![endif]-->
  <table style="border-collapse: collapse;table-layout: fixed;border-spacing: 0;mso-table-lspace: 0pt;mso-table-rspace: 0pt;vertical-align: top;min-width: 320px;Margin: 0 auto;background-color: #e7e7e7;width:100%" cellpadding="0" cellspacing="0">
  <tbody>
  <tr style="vertical-align: top">
    <td style="word-break: break-word;border-collapse: collapse !important;vertical-align: top">
    <!--[if (mso)|(IE)]><table width="100%" cellpadding="0" cellspacing="0" border="0"><tr><td align="center" style="background-color: #e7e7e7;"><![endif]-->
    

<div class="u-row-container" style="padding: 0px;background-color: transparent">
  <div class="u-row" style="Margin: 0 auto;min-width: 320px;max-width: 500px;overflow-wrap: break-word;word-wrap: break-word;word-break: break-word;background-color: transparent;">
    <div style="border-collapse: collapse;display: table;width: 100%;background-color: transparent;">
      <!--[if (mso)|(IE)]><table width="100%" cellpadding="0" cellspacing="0" border="0"><tr><td style="padding: 0px;background-color: transparent;" align="center"><table cellpadding="0" cellspacing="0" border="0" style="width:500px;"><tr style="background-color: transparent;"><![endif]-->
      
<!--[if (mso)|(IE)]><td align="center" width="500" class="v-col-padding" style="width: 500px;padding: 0px;border-top: 0px solid transparent;border-left: 0px solid transparent;border-right: 0px solid transparent;border-bottom: 0px solid transparent;" valign="top"><![endif]-->
<div class="u-col u-col-100" style="max-width: 320px;min-width: 500px;display: table-cell;vertical-align: top;">
  <div style="width: 100% !important;">
  <!--[if (!mso)&(!IE)]><!--><div class="v-col-padding" style="padding: 0px;border-top: 0px solid transparent;border-left: 0px solid transparent;border-right: 0px solid transparent;border-bottom: 0px solid transparent;"><!--<![endif]-->
  
<table style="font-family:arial,helvetica,sans-serif;" role="presentation" cellpadding="0" cellspacing="0" width="100%" border="0">
  <tbody>
    <tr>
      <td class="v-container-padding-padding" style="overflow-wrap:break-word;word-break:break-word;padding:10px;font-family:arial,helvetica,sans-serif;" align="left">
        
  <div class="v-text-align v-line-height" style="line-height: 140%; text-align: left; word-wrap: break-word;">
    <p style="font-size: 14px; line-height: 140%;">Hello ${clientname} ,</p>
<p style="font-size: 14px; line-height: 140%; margin: 5px;"> </p><br  />
<p style="font-size: 14px; line-height: 140%;">Good News!!!</p>
<p style="font-size: 14px; line-height: 140%; margin: 5px;"> </p>
<p style="font-size: 14px; line-height: 140%;">Your ${fileCount} reports dated ${folderName} are COMPLETED.</p>
<p style="font-size: 14px; line-height: 140%; margin: 5px;"> </p>
<p style="font-size: 14px; line-height: 140%;">To access the medical reports, please click:  <a rel="noopener" href="${fullUrl}" target="_blank">${folderName}</a></p>
<p style="font-size: 14px; line-height: 140%; margin: 5px;"> </p>
<p style="font-size: 14px; line-height: 140%;">Thanks and regards,</p>
  </div>

      </td>
    </tr>
  </tbody>
</table>

  <!--[if (!mso)&(!IE)]><!--></div><!--<![endif]-->
  </div>
</div>
<!--[if (mso)|(IE)]></td><![endif]-->
      <!--[if (mso)|(IE)]></tr></table></td></tr></table><![endif]-->
    </div>
  </div>
</div>



<div class="u-row-container" style="padding: 0px;background-color: transparent">
  <div class="u-row" style="Margin: 0 auto;min-width: 320px;max-width: 500px;overflow-wrap: break-word;word-wrap: break-word;word-break: break-word;background-color: transparent;">
    <div style="border-collapse: collapse;display: table;width: 100%;background-color: transparent;">
      <!--[if (mso)|(IE)]><table width="100%" cellpadding="0" cellspacing="0" border="0"><tr><td style="padding: 0px;background-color: transparent;" align="center"><table cellpadding="0" cellspacing="0" border="0" style="width:500px;"><tr style="background-color: transparent;"><![endif]-->
      
<!--[if (mso)|(IE)]><td align="center" width="108" class="v-col-padding" style="width: 108px;padding: 0px;border-top: 0px solid transparent;border-left: 0px solid transparent;border-right: 0px solid transparent;border-bottom: 0px solid transparent;" valign="top"><![endif]-->
<div class="u-col u-col-21p53" style="max-width: 320px;min-width: 108px;display: table-cell;vertical-align: top;">
  <div style="width: 100% !important;">
  <!--[if (!mso)&(!IE)]><!--><div class="v-col-padding" style="padding: 0px;border-top: 0px solid transparent;border-left: 0px solid transparent;border-right: 0px solid transparent;border-bottom: 0px solid transparent;"><!--<![endif]-->
  
<table id="u_content_image_2" style="font-family:arial,helvetica,sans-serif;" role="presentation" cellpadding="0" cellspacing="0" width="100%" border="0">
  <tbody>
    <tr>
      <td class="v-container-padding-padding" style="overflow-wrap:break-word;word-break:break-word;padding:10px;font-family:arial,helvetica,sans-serif;" align="left">
        
<table width="100%" cellpadding="0" cellspacing="0" border="0">
  <tr>
    <td class="v-text-align" style="padding-right: 0px;padding-left: 0px;" align="center">
      <a href="http://www.vitalitybss.com/" target="_blank">
      <img align="center" border="0" src="data:image/png;base64,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" alt="" title="" style="outline: none;text-decoration: none;-ms-interpolation-mode: bicubic;clear: both;display: inline-block !important;border: none;height: auto;float: none;width: 100%;max-width: 88px;" width="88"/>
      </a>
    </td>
  </tr>
</table>

      </td>
    </tr>
  </tbody>
</table>

  <!--[if (!mso)&(!IE)]><!--></div><!--<![endif]-->
  </div>
</div>
<!--[if (mso)|(IE)]></td><![endif]-->
<!--[if (mso)|(IE)]><td align="center" width="392" class="v-col-padding" style="width: 392px;padding: 0px 100px 0px 0px;border-top: 0px solid transparent;border-left: 0px solid transparent;border-right: 0px solid transparent;border-bottom: 0px solid transparent;border-radius: 0px;-webkit-border-radius: 0px; -moz-border-radius: 0px;" valign="top"><![endif]-->
<div id="u_column_3" class="u-col u-col-78p47" style="max-width: 320px;min-width: 392px;display: table-cell;vertical-align: top;">
  <div style="width: 100% !important;border-radius: 0px;-webkit-border-radius: 0px; -moz-border-radius: 0px;">
  <!--[if (!mso)&(!IE)]><!--><div class="v-col-padding" style="padding: 0px 100px 0px 0px;border-top: 0px solid transparent;border-left: 0px solid transparent;border-right: 0px solid transparent;border-bottom: 0px solid transparent;border-radius: 0px;-webkit-border-radius: 0px; -moz-border-radius: 0px;"><!--<![endif]-->
  
<table id="u_content_text_3" style="font-family:arial,helvetica,sans-serif;" role="presentation" cellpadding="0" cellspacing="0" width="100%" border="0">
  <tbody>
    <tr>
      <td class="v-container-padding-padding" style="overflow-wrap:break-word;word-break:break-word;padding:20px 0px 20px 9px;font-family:arial,helvetica,sans-serif;" align="left">
        
  <div class="v-text-align v-line-height" style="line-height: 130%; text-align: left; word-wrap: break-word;">
    <p style="font-size: 14px; line-height: 130%;">Vitality Business Support Services,LLP</p>
<p style="font-size: 14px; line-height: 130%;"><a rel="noopener" href="mailto:mr@vitalitybss.com?subject=&body=" target="_blank">mr@vitalitybss.com</a> | <a rel="noopener" href="https://www.vitalitybss.com" target="_blank">www.vitalitybss.com</a></p>
  </div>

      </td>
    </tr>
  </tbody>
</table>

  <!--[if (!mso)&(!IE)]><!--></div><!--<![endif]-->
  </div>
</div>
<!--[if (mso)|(IE)]></td><![endif]-->
      <!--[if (mso)|(IE)]></tr></table></td></tr></table><![endif]-->
    </div>
  </div>
</div>


    <!--[if (mso)|(IE)]></td></tr></table><![endif]-->
    </td>
  </tr>
  </tbody>
  </table>
  <!--[if mso]></div><![endif]-->
  <!--[if IE]></div><![endif]-->
</body>

</html>`;

const vitalityTemplate = (username, fileCount, folderName) => `
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <title>Report</title>
    <link
      rel="stylesheet"
      href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/4.7.0/css/font-awesome.min.css"
    />
    <style type="text/css">
      body {
        margin: 10px;
        padding: 10px;
        font-family: Calibri, sans-serif;
      }

    </style>

    <meta name="viewport" content="width=device-width, initial-scale=1" />
  </head>
  <body>
    <div>
      <h4>Hi Vitality</h4>
      <div>You have received:</div>
      <div>1.) ${fileCount} medical records from client ${username} in ${folderName}.</div>
      <br />
      <b>(Time to be set for e-mail to vitality, e.g. 6 a.m. morning and 12 p.m. in afternoon)</b>
    </div>
  </body>
</html>
`;
export default { emailTemplate, vitalityTemplate };
