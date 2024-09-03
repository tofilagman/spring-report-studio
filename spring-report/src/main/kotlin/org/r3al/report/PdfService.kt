package org.r3al.report

interface PdfService {
    fun render(template: String?, data: String?, script: String?, style: String?): ByteArray
}