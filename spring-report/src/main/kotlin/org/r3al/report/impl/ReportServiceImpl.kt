package org.r3al.report.impl

import org.r3al.report.ReportService
import org.slf4j.LoggerFactory
import org.springframework.stereotype.Service

@Service
class ReportServiceImpl : ReportService {

    private val logger = LoggerFactory.getLogger(ReportServiceImpl::class.java)

    override fun test() {
        logger.info("called from root class")



    }
}