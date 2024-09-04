# spring-report-studio
![Github Issues](https://img.shields.io/github/issues/tofilagman/spring-report-studio.svg) ![Github Stars](https://img.shields.io/github/stars/tofilagman/spring-report-studio.svg) ![Java](https://img.shields.io/badge/java-100%25-brightgreen.svg) ![LICENSE](https://img.shields.io/badge/license-apache2.0-blue.svg)

# about spring-report-studio

Creating report using plain html and javascript under java platform

minimum jdk requirements: 17.0.2
 
# Example

In your project add the dependency of the library, let's take an example using maven.
  
```
<dependency>
    <groupId>org.r3al.report</groupId>
    <artifactId>spring-report</artifactId>
    <version>1.0-SNAPSHOT</version>
</dependency>
```   
In your main application class, add this annotation as follows:
@Import(ReportConfiguration::class) 
  
call the pdf service

``` kotlin
import org.r3al.report.PdfService

class SampleService {

    @Autowired
    lateinit var pdfService: PdfService

   fun run() {

        val data1 = pdfService.render(template, data, script, style)

        //to base64
        //val rdata = data.toBase64("application/pdf")

        val outFile1 = File("test.pdf")
        FileOutputStream(outFile1).use { outputStream ->
            outputStream.write(data1)
        }
    }

}
```

# Studio
Documentation to follow (project inprogress)