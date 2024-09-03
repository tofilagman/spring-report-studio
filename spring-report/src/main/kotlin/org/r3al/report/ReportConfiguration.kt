package org.r3al.report

import com.microsoft.playwright.Browser
import com.microsoft.playwright.BrowserType
import com.microsoft.playwright.Playwright
import org.springframework.context.annotation.Bean
import org.springframework.context.annotation.ComponentScan
import org.springframework.context.annotation.Configuration

@Configuration
@ComponentScan(basePackages = ["org.r3al.report"])
open class ReportConfiguration {

    @Bean
    fun getBrowser(): Browser {
        val playwright = Playwright.create()
        val launchOption = BrowserType.LaunchOptions()
            .setHeadless(true)
            .setChromiumSandbox(false)
        return playwright.chromium().launch(launchOption)
    }
}