package org.r3al.report

import com.fasterxml.jackson.databind.ObjectMapper
import jakarta.servlet.http.HttpServletResponse
import org.springframework.core.io.ClassPathResource
import org.springframework.util.FileCopyUtils
import org.springframework.web.servlet.support.ServletUriComponentsBuilder
import java.awt.image.BufferedImage
import java.io.BufferedInputStream
import java.io.ByteArrayInputStream
import java.io.ByteArrayOutputStream
import java.io.InputStreamReader
import java.math.BigDecimal
import java.math.RoundingMode
import java.sql.Timestamp
import java.text.DecimalFormat
import java.text.DecimalFormatSymbols
import java.text.SimpleDateFormat
import java.time.Instant
import java.time.LocalDate
import java.time.LocalDateTime
import java.time.ZoneId
import java.time.format.DateTimeFormatter
import java.time.format.DateTimeFormatterBuilder
import java.util.*
import java.util.regex.Pattern
import javax.imageio.ImageIO


class Utils {
    companion object {

        const val dateTimeFormatter: String = "MMM dd, yyyy HH:mm a"
        const val timeFormatter: String = "HH:mm a"
        const val shortDateFormatter: String = "MM/dd/yyyy"
        const val longDateFormatter: String = "MMM dd, yyyy"
        const val longDateTimeFormatter: String = "MMM dd, yyyy HH:mm a"
        const val jsonDateFormat: String = "yyyy-MM-dd'T'hh:mm:ss"

        fun generateTokenCode(): String {
            return generateRefID().substring(0, 6)
        }

        fun generateRefCode(): String {
            return generateRefID().substring(0, 10)
        }

        fun generateRefID(): String {
            return UUID.randomUUID().toString().replace("-", "")
        }

        fun <T : Any> Array<T>.implode(separator: String = ","): String {
            return this.joinToString { separator }
        }

        fun ByteArray.toBase64(contentType: String): String {
            val str = Base64.getEncoder().encodeToString(this)
            return "data:$contentType;base64,$str"
        }

        fun generateFileName(filename: String): String {
            val mpx = filename.split(".")
            val ndate = SimpleDateFormat("yyyyMMddHHmmss").format(Date())
            return "${mpx[0]}-$ndate.${mpx[1]}"
        }

        fun downloadFile(response: HttpServletResponse, data: ByteArray, filename: String) {

            response.contentType = "application/octet-stream"
            response.setHeader("Content-Disposition", "inline; filename=\"${generateFileName(filename)}\"")
            response.setContentLength(data.size)

            val bf = ByteArrayInputStream(data)
            BufferedInputStream(bf).use {
                FileCopyUtils.copy(it, response.outputStream)
            }
        }

        fun Long?.orElse(other: Long): Long {
            return this ?: other
        }

        fun Int?.orElse(other: Int): Int {
            return this ?: other
        }

        fun BigDecimal?.orElseZero(other: BigDecimal): BigDecimal {
            return this?.let {
                if (it.compareTo(BigDecimal.ZERO) == 0)
                    other
                else
                    it
            } ?: other
        }

        fun <T : Enum<T>> T?.orElse(other: T): T {
            return this ?: other
        }

        fun LocalDateTime?.orElse(other: LocalDateTime): LocalDateTime {
            return this ?: other
        }

        fun Timestamp?.orDefault(): Timestamp {
            return this ?: dateTimeNow()
        }

        fun LocalDateTime?.orDefault(): LocalDateTime {
            return this.orElse(LocalDateTime.now())
        }

        fun LocalDateTime.toDate(): Date {
            val zdt = this.atZone(ZoneId.systemDefault())
            return Date.from(zdt.toInstant())
        }

        fun Timestamp.toDate(): Date {
            return Date(this.time)
        }

        fun LocalDateTime.toDateTime(): Timestamp {
            val zdt = this.atZone(ZoneId.systemDefault())
            return Timestamp.from(zdt.toInstant())
        }

        fun String.toDateTime(): LocalDateTime {
            return LocalDateTime.parse(this, DateTimeFormatter.ISO_DATE_TIME)
        }

        fun String.toTimeStamp(): Timestamp {
            val ins = Instant.parse(this)
            val dt = Date.from(ins)
            return Timestamp(dt.time)
        }

        fun dateTimeNow(): Timestamp {
            return LocalDateTime.now().toDateTime()
        }

        fun dateNow(): Date {
            return Date.from(LocalDate.now().atStartOfDay(ZoneId.systemDefault()).toInstant())
        }

        fun Timestamp.year(): Int {
            val cal = Calendar.getInstance()
            cal.timeInMillis = this.time
            return cal[Calendar.YEAR]
        }

        fun Boolean?.orElse(other: Boolean): Boolean {
            return this ?: other
        }

        fun BigDecimal?.orDefault(defVal: Int? = null): BigDecimal {
            return this ?: BigDecimal(defVal ?: 0)
        }

        fun BigDecimal.formatMoney(): String {
            val df = DecimalFormat("#,##0.00")
            df.decimalFormatSymbols = DecimalFormatSymbols(Locale.getDefault())
            return df.format(this)
        }

        fun Int.formatMoney(): String {
            val df = DecimalFormat("#,##0.00")
            df.decimalFormatSymbols = DecimalFormatSymbols(Locale.getDefault())
            return df.format(this)
        }

        fun Date.formatDate(pattern: String): String {
            val format = SimpleDateFormat(pattern)
            return format.format(this)
        }

        fun LocalDateTime.formatDate(pattern: String): String {
            return this.format(DateTimeFormatter.ofPattern(pattern))
        }

        /**
         * Accepts number as boolean value
         */
        fun String?.toNumBoolean(): Boolean {
            return this?.let {
                it.toInt() == 1
            } ?: false
        }

        fun String?.toSafeBoolean(): Boolean {
            return this?.let {
                if (it.lowercase() == "true" || it.lowercase() == "false")
                    return it.toBoolean()
                if (it.isNumeric())
                    return it.toNumBoolean()
                return false
            } ?: false
        }

        fun Any?.toSafeBoolean(): Boolean {
            return this?.let {
                return this.toString().toSafeBoolean()
            } ?: false
        }

        fun String.isNumeric(): Boolean {
            return this.all { char -> char.isDigit() }
        }

        fun loadResourceFile(name: String): String {
            val file = ClassPathResource(name).inputStream
            return InputStreamReader(file).use {
                it.readText()
            }
        }

        fun <T : Any, P : Any> P.mutate(bar: (p: P) -> T): T {
            return bar(this)
        }

        fun <T : Any> Iterable<T>.findNotNull(predicate: (T) -> Boolean): T {
            return this.find(predicate) ?: throw Exception("Item not found")
        }

        fun <T, K> Map<T, K>.getNotNull(keySelector: T): K {
            return this[keySelector] ?: throw Exception("Item not found")
        }

        fun <S, T, R> Iterable<S>.join(target: Iterable<T>, filter: (S, T) -> Boolean, result: (S, T) -> R): List<R> {
            val ntd = mutableListOf<R>()
            for (s in this) {
                for (t in target) {
                    if (filter(s, t))
                        ntd.add(result(s, t))
                }
            }
            return ntd
        }

        @Suppress("UNCHECKED_CAST")
        fun <K, V> Map<out K, V>.slice(indices: IntRange): Map<K, V> {
            if (indices.isEmpty()) return mapOf()
            val nk = (if (indices.last > this.size) this.size else indices.last) - 1
            return this.keys.toList().slice(indices.first..nk).associateWith {
                this[it] as V
            }
        }

        fun requestPath(): String {
            return ServletUriComponentsBuilder.fromCurrentContextPath()
                .replacePath(null)
                .build().toUriString()
        }

        fun BigDecimal.percentageOf(decimal: BigDecimal): BigDecimal {
            val one = BigDecimal(100.0)
            return (this * decimal / one).trim()
        }

        fun BigDecimal.trim(): BigDecimal {
            return this.setScale(2, RoundingMode.HALF_UP)
        }

        fun String?.parseRegex(pattern: String): String? {
            if (this.isNullOrEmpty()) return null

            val ptrn = Pattern.compile(pattern, Pattern.MULTILINE or Pattern.CASE_INSENSITIVE)
            val mtchr = ptrn.matcher(this)

            return if (mtchr.find())
                mtchr.group(0)
            else
                null
        }

        fun String.parseDateTime(): Timestamp {
            val parser = DateTimeFormatterBuilder()
                .parseCaseInsensitive() // parse in case-insensitive manner
                .appendPattern("[MMM dd uuuu, h:m a][MMM dd, uuuu h:m a][MMM dd,uuuu h:m a]")
                .toFormatter(Locale.ENGLISH)

            return LocalDateTime.parse(this, parser).toDateTime()
        }
    }
}