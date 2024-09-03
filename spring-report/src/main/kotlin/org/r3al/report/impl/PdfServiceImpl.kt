package org.r3al.report.impl

import com.microsoft.playwright.Browser
import com.microsoft.playwright.BrowserType
import com.microsoft.playwright.Page
import com.microsoft.playwright.Playwright
import com.microsoft.playwright.Playwright.CreateOptions
import com.microsoft.playwright.options.Margin
import com.microsoft.playwright.options.ViewportSize
import org.r3al.report.PdfService
import org.r3al.report.ReportService
import org.slf4j.LoggerFactory
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.stereotype.Service
import java.io.File
import java.nio.charset.Charset

@Service
class PdfServiceImpl : PdfService {

    val logger = LoggerFactory.getLogger(PdfService::class.java)

    @Autowired
    lateinit var browser: Browser

    override fun render(template: String?, data: String?, script: String?, style: String?): ByteArray {
        try {
            logger.info("Loading Resources")

//            val playwright = Playwright.create()
//            val launchOption = BrowserType.LaunchOptions()
//                .setHeadless(true)
//                .setChromiumSandbox(false)
//            val browser = playwright.chromium().launch(launchOption)
            //val context = browser.newContext()
            val page = browser.newPage()

            val sb = StringBuilder()
            sb.appendLine(
                """
                  <style id='def-style'>
                      $default_style
                  </style> 
            """.trimIndent()
            )

            if (!template.isNullOrEmpty())
                sb.appendLine(
                    """
                    <script type="text/x-handlebars-template" id="entry-template">$template</script>
                """.trimIndent()
                )
            if (!style.isNullOrEmpty())
                sb.appendLine(
                    """
                   <script type="text/x-handlebars-template" id="style-template">$style</script>
               """.trimIndent()
                )

            val scriptLibs = listOf("handlebars.min-v4.7.8.js", "moment.min.js", "chart.min-v2.7.2.js")
            scriptLibs.forEach {
                val scriptData = readScript(it)
                sb.appendLine(
                    """
                 <script type="text/javascript">$scriptData</script>
                """.trimIndent()
                )
            }

            if (!data.isNullOrEmpty())
                sb.appendLine(
                    """
                 <script type="text/javascript">
                    window.processContext = $data
                 </script>
                """.trimIndent()
                )

            //add resources here

            if (!script.isNullOrEmpty())
                sb.appendLine(
                    """
                 <script type="text/javascript">$script</script>
                """.trimIndent()
                )

            val processorData = readScript("processor.js")
            sb.appendLine(
                """
                 <script type="text/javascript">$processorData</script>
                """.trimIndent()
            )

            sb.appendLine("<body></body>")
            page.setContent(sb.toString())
            page.waitForLoadState()
            page.evaluateHandle("() => window.processHandlebar()")

            logger.info("Rendering PDF");

            val dataByte = page.pdf(
                Page.PdfOptions()
                    .setFormat("A4")
                    .setLandscape(true)
                    .setPrintBackground(true)
                    .setMargin(
                        Margin()
                            .setTop("20px")
                            .setLeft("20px")
                            .setRight("20px")
                            .setBottom("20px")
                    )
                    .setHeaderTemplate("")
                    .setFooterTemplate("")
            )

            return dataByte
        } catch (ex: Exception) {
            logger.error(ex.message, ex)
            throw ex
        }
    }

    private fun readScript(script: String): String {
        val mainJs = ReportService::class.java.classLoader.getResource("puppeteer_content/$script")
        val mFile = File(mainJs?.file ?: throw Exception("$script not found"))
        return mFile.readText()
    }

    private val default_style = """
         body {
             font-family: -apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Oxygen,Ubuntu,Cantarell,'Open Sans','Helvetica Neue',sans-serif;
         } 
    """.trimIndent()

}