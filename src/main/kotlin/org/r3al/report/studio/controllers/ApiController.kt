package org.r3al.report.studio.controllers

import io.swagger.v3.oas.annotations.Operation
import io.swagger.v3.oas.annotations.media.Content
import io.swagger.v3.oas.annotations.media.Schema
import io.swagger.v3.oas.annotations.responses.ApiResponse
import io.swagger.v3.oas.annotations.tags.Tag
import org.springframework.web.bind.annotation.GetMapping
import org.springframework.web.bind.annotation.PathVariable
import org.springframework.web.bind.annotation.RequestMapping
import org.springframework.web.bind.annotation.RestController

@RestController
@RequestMapping("/api")
@Tag(name = "api", description = "Main API")
class ApiController {

    @Operation(summary = "find one")
    @GetMapping("/{id}")
    @ApiResponse(
        content = [
            Content(
                mediaType = "application/json",
//                schema = Schema(
//                    implementation = Barangay::class
//                )
            )
        ]
    )
    fun findOne(@PathVariable("id") id: Long): Any {
        return ""
    }
}