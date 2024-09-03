package org.r3al.report.studio.services.impl

import org.r3al.report.PdfService
import org.r3al.report.studio.services.BootStarterService
import org.slf4j.LoggerFactory
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.stereotype.Service
import java.io.File
import java.io.FileOutputStream

@Service
class BootStarterServiceImpl : BootStarterService {

    private val logger= LoggerFactory.getLogger(BootStarterServiceImpl::class.java)

    @Autowired
    lateinit var pdfService: PdfService

    override fun initialize() {
       logger.info("test")
        //reportService.test()

        val data1 = pdfService.render(template, data, script, style)

        //val rdata = data.toBase64("application/pdf")

        val outFile1 = File("test.pdf")
        FileOutputStream(outFile1).use { outputStream ->
            outputStream.write(data1)
        }

        logger.info("test2")
        //reportService.test()

        val data2 = pdfService.render(template, data, script, style)

        //val rdata = data.toBase64("application/pdf")

        val outFile2 = File("test.pdf")
        FileOutputStream(outFile2).use { outputStream ->
            outputStream.write(data2)
        }

        logger.info("completed")
    }

    val template = """
        <body class="c22 doc-content">
            <div>
                <p class="c5 c23 clogo">
                    <span style="overflow: hidden; display: inline-block; margin: 0.00px 0.00px; border: 0.00px solid #000000; transform: rotate(0.00rad) translateZ(0px); -webkit-transform: rotate(0.00rad) translateZ(0px); width: 192.67px; height: 72.67px;"><img alt="" style="width: 224.06px; height: 110.74px; margin-left: -31.39px; margin-top: -16.59px; transform: rotate(0.00rad) translateZ(0px); -webkit-transform: rotate(0.00rad) translateZ(0px);" title=""></span>
                </p>
            </div>
            <p class="c5 c14"><span class="c0"></span></p><a id="t.21fd4b9e140b0d493b2a7fe3e20a26727c530065"></a><a
                id="t.0"></a>
            <table class="c15">
                <tr class="c9">
                    <td class="c10" colspan="1" rowspan="1">
                        <p class="c5"><span class="c3">Date</span><span class="c0">: {{currentDate}} </span></p>
                        <p class="c4 c6">
                            <span class="c3">Site</span><span class="c0">: {{site}}</span>
                        </p>
                        <p class="c5"><span class="c3">Owner</span><span class="c0">: {{owner}}</span></p>
                        <p class="c2 c6"><span class="c0"></span></p>
                    </td>
                    <td class="c17" colspan="1" rowspan="1">
                        <p class="c5"><span class="c3">Revision</span><span class="c0">: {{revision}}</span></p>
                        <p class="c5"><span class="c3">Revision Note</span><span class="c0">: {{revisionNote}}</span></p>
                        <p class="c4 c6">
                            <span class="c3">Priority:</span><span class="{{elvis priority 'HIGH' 'high-prio'}}"> {{priority}}</span>
                        </p>
                        <p class="c2 c6"><span class="c0"></span>
                        </p>
                    </td>
                </tr>
                <tr class="c9">
                    <td class="c12" colspan="2" rowspan="1">
                        <p class="c5"><span class="c3">Ticket Name:</span><span class="c0">{{ticketName}}</span></p>
                        <p class="c5"><span class="c3">Description:</span><span class="c0">{{ticketDescription}}</span></p>
                        <p class="c2 c6"><span class="c0"></span></p>
                    </td>
                </tr>
                <tr class="c9">
                    <td class="c10" colspan="1" rowspan="1">
                        <p class="c4 c6"><span class="c3 c21">Company Details: </span></p>
                        <p class="c4 c6"><span class="c0">Contact: {{contactName}}</span></p>
                        <p class="c4 c6"><span class="c0">Company: {{companyName}}</span></p>
                        <p class="c5"><span class="c0">Shipping Address: {{shippingAddress}}</span></p>
                        <p class="c5"><span class="c0">Ship Via: {{shipVia}}</span></p>
                        <p class="c5"><span class="c0">Ship by Date: {{shipByDate}}</span></p>
                        <p class="c5"><span class="c0">Customer Shipping Acct: {{customerShippingAct}}</span></p>
                        <p class="c2 c6"><span class="c0"></span></p>
                    </td>
                    <td class="c17" colspan="1" rowspan="1">
                        <p class="c5"><span class="c21 c3">Ticket Details:</span></p>
                        <p class="c5"><span class="c0">No. Flavors Requested: </span></p>
                        <p class="c5"><span class="c0">Ticket Status: </span></p>
                        <p class="c5"><span class="c0">Customer Base Provided: </span></p>
                        <p class="c5"><span class="c0">High Temperature Applied: </span></p>
                        <p class="c5"><span class="c0">Processing Conditions: </span></p>
                        <p class="c5"><span class="c0">Cost of Use Target: </span></p>
                        <p class="c2 c6"><span class="c0"></span></p>
                        <p class="c2 c6"><span class="c0"></span></p>
                    </td>
                </tr>
            </table>
            <p class="c25 c14"><span class="c0"></span></p><a id="t.fc310ec2b310a421883d91272d58d80c1c42f034"></a><a
                id="t.1"></a>
            <table class="c15">
                <thead>
                    <tr class="c9">
                        <td class="c1 c16" colspan="1" rowspan="1">
                            <p class="c13"><span class="c11 c18">Internal Flavor Name</span></p>
                        </td>
                        <td class="c1 c16" colspan="1" rowspan="1">
                            <p class="c13"><span class="c11">Physical Form</span></p>
                        </td>
                        <td class="c1 c16" colspan="1" rowspan="1">
                            <p class="c13"><span class="c11">Labeling Requirements</span></p>
                        </td>
                        <td class="c1 c16" colspan="1" rowspan="1">
                            <p class="c13"><span class="c11">Dietary Suitability</span></p>
                        </td>
                        <td class="c1 c16" colspan="1" rowspan="1">
                            <p class="c13"><span class="c11">Functional Properties</span></p>
                        </td>
                        <td class="c1 c16" colspan="1" rowspan="1">
                            <p class="c13"><span class="c11">Ingredient Requirements</span></p>
                        </td>
                        <td class="c1 c16" colspan="1" rowspan="1">
                            <p class="c13"><span class="c11">Retailer Requirement</span></p>
                        </td>
                        <td class="c1 c16" colspan="1" rowspan="1">
                            <p class="c13"><span class="c11">Certification Required</span></p>
                        </td>
                    </tr>
                    {{#each items}}
                    <tr class="c9">
                        <td class="c1" colspan="1" rowspan="1">
                            <p class="c2">
                            <div class="c7">{{internalFlavorName}}</div>
                            </p>
                        </td>
                        <td class="c1" colspan="1" rowspan="1">
                            <p class="c2">
                            <div class="c7">{{physicalForm}}</div>
                            </p>
                        </td>
                        <td class="c1" colspan="1" rowspan="1">
                            <p class="c2">
                            <div class="c7">{{labelingRequirements}}</div>
                            </p>
                        </td>
                        <td class="c1" colspan="1" rowspan="1">
                            <p class="c2">
                            <div class="c7">{{dietarySuitability}}</div>
                            </p>
                        </td>
                        <td class="c1" colspan="1" rowspan="1">
                            <p class="c2">
                            <div class="c7">{{functionalProperties}}</div>
                            </p>
                        </td>
                        <td class="c1" colspan="1" rowspan="1">
                            <p class="c2">
                            <div class="c7">{{ingredientRequirements}}</div>
                            </p>
                        </td>
                        <td class="c1" colspan="1" rowspan="1">
                            <p class="c2">
                            <div class="c7">{{retailerRequirement}}</div>
                            </p>
                        </td>
                        <td class="c1" colspan="1" rowspan="1">
                            <p class="c2">
                            <div class="c7">{{certificationRequired}}</div>
                            </p>
                        </td>
                    </tr>
                    {{/each}}
                </thead>
            </table>
            <table class="c15 cpadtop">
                <tr class="c9">
                    <td class="c12" colspan="2" rowspan="1">
                        <p class="c5"><span class="c3">Documents Needed:</span><span class="c0">{{documentsNeeded}}</span></p>
                    </td>
                </tr>
            </table>
        </body>
    """.trimIndent()
    val data = """
        {
            "site": "sample production site",
            "owner": "joerizal",
            "revision": "12",
            "revisionNote": "lslslslslslslslslsskdkdk",
            "priority": "HIGH",
            "ticketName": "sample ticket 1",
            "ticketDescription": "sample ticket description 1",
            "contactName": "Kimberly",
            "companyName": "Mosaic Corp",
            "shippingAddress": "New York",
            "shipVia": "Container",
            "shipByDate": "2024/04/09",
            "customerShippingAct": "California",
            "documentsNeeded": "doc needed",
            "items": [
                {
                    "internalFlavorName": "NATURAL STRAWBERRY TYPE FLAVOR",
                    "physicalForm": "item sample 1",
                    "labelingRequirements": "N/A",
                    "physicalForm2": "item sample 12",
                    "dietarySuitability": "N/A",
                    "functionalProperties": "N/A",
                    "ingredientRequirements": "N/A",
                    "retailerRequirement": "N/A",
                    "certificationRequired": "N/A"
                },
                {
                    "internalFlavorName": "abc-124",
                    "physicalForm": "item sample 2",
                    "labelingRequirements": "N/A",
                    "physicalForm2": "item sample 13",
                    "dietarySuitability": "N/A",
                    "functionalProperties": "N/A",
                    "ingredientRequirements": "N/A",
                    "retailerRequirement": "N/A",
                    "certificationRequired": "N/A"
                }
            ]
        }
    """.trimIndent()
    val script = """
        Handlebars.registerHelper('currentDate', function () {
            return moment().format("MMM, DD yyyy");
        });

        Handlebars.registerHelper('elvis', function (value, trueValue, returnValue) {
            return value === trueValue ? returnValue : null;
        })

        function appScript() {

        }
    """.trimIndent()
    val style = """
         ol {
             margin: 0;
             padding: 0
         }

         table td,
         table th {
             padding: 0
         }

         .c17 {
             border-right-style: solid;
             padding: 5pt 5pt 5pt 5pt;
             border-bottom-color: #000000;
             border-top-width: 0pt;
             border-right-width: 0pt;
             border-left-color: #000000;
             vertical-align: top;
             border-right-color: #000000;
             border-left-width: 0pt;
             border-top-style: solid;
             border-left-style: solid;
             border-bottom-width: 0pt;
             width: 323.9pt;
             border-top-color: #000000;
             border-bottom-style: solid
         }

         .c1 {
             border-right-style: solid;
             padding: 5pt 5pt 5pt 5pt;
             border-bottom-color: #b7b7b7;
             border-top-width: 1pt;
             border-right-width: 1pt;
             border-left-color: #b7b7b7;
             vertical-align: top;
             border-right-color: #b7b7b7;
             border-left-width: 1pt;
             border-top-style: solid;
             border-left-style: solid;
             border-bottom-width: 1pt;
             width: 85pt;
             border-top-color: #b7b7b7;
             border-bottom-style: solid
         }

         .c10 {
             border-right-style: solid;
             padding: 5pt 5pt 5pt 5pt;
             border-bottom-color: #000000;
             border-top-width: 0pt;
             border-right-width: 0pt;
             border-left-color: #000000;
             vertical-align: top;
             border-right-color: #000000;
             border-left-width: 0pt;
             border-top-style: solid;
             border-left-style: solid;
             border-bottom-width: 0pt;
             width: 324.1pt;
             border-top-color: #000000;
             border-bottom-style: solid
         }

         .c12 {
             border-right-style: solid;
             padding: 5pt 5pt 5pt 5pt;
             border-bottom-color: #000000;
             border-top-width: 0pt;
             border-right-width: 0pt;
             border-left-color: #000000;
             vertical-align: top;
             border-right-color: #000000;
             border-left-width: 0pt;
             border-top-style: solid;
             border-left-style: solid;
             border-bottom-width: 0pt;
             width: 648pt;
             border-top-color: #000000;
             border-bottom-style: solid
         }

         .c7 {
             color: #000000;
             font-weight: 400;
             text-decoration: none;
             vertical-align: baseline;
             font-size: 10pt;
             font-family: "Arial";
             font-style: normal;
             overflow: auto;
         }

         .c8 {
             color: #f1f3f4;
             font-weight: 400;
             text-decoration: none;
             vertical-align: baseline;
             font-size: 12.5pt;
             font-family: "Arial";
             font-style: normal
         }

         .c0 {
             color: #000000;
             font-weight: 400;
             text-decoration: none;
             vertical-align: baseline;
             font-size: 11pt;
             font-family: "Arial";
             font-style: normal
         }

         .c5 {
             padding-top: 0pt;
             padding-bottom: 0pt;
             line-height: 1.1500000000000001;
             orphans: 2;
             widows: 2;
             text-align: left;
         }

         .c21 {
             color: #000000;
             text-decoration: none;
             vertical-align: baseline;
             font-size: 11pt;
             font-family: "Arial";
             font-style: normal
         }

         .c2 {
             padding-top: 0pt;
             padding-bottom: 0pt;
             line-height: 1.0;
             text-align: left;
             height: 11pt
         }

         .c18 {
             font-weight: 400;
             text-decoration: none;
             vertical-align: baseline;
             font-family: "Arial";
             font-style: normal
         }

         .c13 {
             padding-top: 0pt;
             padding-bottom: 0pt;
             line-height: 1.0;
             text-align: center
         }

         .c15 {
             border-spacing: 0;
             border-collapse: collapse;
             margin-right: auto
         }

         .c4 {
             padding-top: 0pt;
             padding-bottom: 0pt;
             line-height: 1.0;
             text-align: left
         }

         .c25 {
             padding-top: 0pt;
             padding-bottom: 0pt;
             line-height: 1.15;
             text-align: left
         }

         .c26 {
             padding-top: 0pt;
             padding-bottom: 0pt;
             line-height: 1.1500000000000001;
             text-align: center
         }

         .c22 {
             background-color: #ffffff;
             max-width: 648pt;
             padding: 72pt 72pt 72pt 72pt
         }

         .c20 {
             border: 1px solid black;
             margin: 5px
         }

         .c24 {
             color: #000000;
             font-size: 12.5pt
         }

         .c11 {
             color: #f1f3f4;
             font-size: 8.5pt
         }

         .c6 {
             orphans: 2;
             widows: 2
         }

         .c9 {
             height: 0pt
         }

         .c19 {
             height: 24.1pt
         }

         .c16 {
             background-color: #5052a3
         }

         .c14 {
             height: 11pt
         }

         .c23 {
             margin-right: -36pt
         }

         .c3 {
             font-weight: 700
         }

         .title {
             padding-top: 0pt;
             color: #000000;
             font-size: 26pt;
             padding-bottom: 3pt;
             font-family: "Arial";
             line-height: 1.1500000000000001;
             page-break-after: avoid;
             orphans: 2;
             widows: 2;
             text-align: left
         }

         .subtitle {
             padding-top: 0pt;
             color: #666666;
             font-size: 15pt;
             padding-bottom: 16pt;
             font-family: "Arial";
             line-height: 1.1500000000000001;
             page-break-after: avoid;
             orphans: 2;
             widows: 2;
             text-align: left
         }

         li {
             color: #000000;
             font-size: 11pt;
             font-family: "Arial"
         }

         p {
             margin: 0;
             color: #000000;
             font-size: 11pt;
             font-family: "Arial"
         }

         h1 {
             padding-top: 20pt;
             color: #000000;
             font-size: 20pt;
             padding-bottom: 6pt;
             font-family: "Arial";
             line-height: 1.1500000000000001;
             page-break-after: avoid;
             orphans: 2;
             widows: 2;
             text-align: left
         }

         h2 {
             padding-top: 18pt;
             color: #000000;
             font-size: 16pt;
             padding-bottom: 6pt;
             font-family: "Arial";
             line-height: 1.1500000000000001;
             page-break-after: avoid;
             orphans: 2;
             widows: 2;
             text-align: left
         }

         h3 {
             padding-top: 16pt;
             color: #434343;
             font-size: 14pt;
             padding-bottom: 4pt;
             font-family: "Arial";
             line-height: 1.1500000000000001;
             page-break-after: avoid;
             orphans: 2;
             widows: 2;
             text-align: left
         }

         h4 {
             padding-top: 14pt;
             color: #666666;
             font-size: 12pt;
             padding-bottom: 4pt;
             font-family: "Arial";
             line-height: 1.1500000000000001;
             page-break-after: avoid;
             orphans: 2;
             widows: 2;
             text-align: left
         }

         h5 {
             padding-top: 12pt;
             color: #666666;
             font-size: 11pt;
             padding-bottom: 4pt;
             font-family: "Arial";
             line-height: 1.1500000000000001;
             page-break-after: avoid;
             orphans: 2;
             widows: 2;
             text-align: left
         }

         h6 {
             padding-top: 12pt;
             color: #666666;
             font-size: 11pt;
             padding-bottom: 4pt;
             font-family: "Arial";
             line-height: 1.1500000000000001;
             page-break-after: avoid;
             font-style: italic;
             orphans: 2;
             widows: 2;
             text-align: left
         }

         .cpadtop {
             margin-top: 20pt;
         }

         .clogo {
             text-align: right;
             margin-right: 30pt;
         }

         .high-prio {
             font-weight: bold;
             color: red;
         }
    """.trimIndent()
}