package org.r3al.report.studio

import org.r3al.report.ReportConfiguration
import org.r3al.report.studio.services.BootStarterService
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.boot.autoconfigure.SpringBootApplication
import org.springframework.boot.builder.SpringApplicationBuilder
import org.springframework.boot.context.event.ApplicationReadyEvent
import org.springframework.context.annotation.Import
import org.springframework.context.event.EventListener

@SpringBootApplication
@Import(ReportConfiguration::class)
open class SpringReportStudio {

    @Autowired
    lateinit var bootStarterService: BootStarterService

    @EventListener(ApplicationReadyEvent::class)
    fun startup() {
        bootStarterService.initialize()
    }

}

fun main(args: Array<String>) {
    SpringApplicationBuilder(SpringReportStudio::class.java).run(*args)
}
