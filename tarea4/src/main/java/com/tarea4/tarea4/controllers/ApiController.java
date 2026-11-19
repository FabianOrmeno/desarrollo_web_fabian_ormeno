package com.tarea4.tarea4.controllers;

import org.springframework.web.bind.annotation.RestController;

import com.tarea4.tarea4.services.ApiService;

import java.util.List;
import java.util.Map;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestParam;

@RestController
public class ApiController {
    private final ApiService apiService;
    public ApiController(ApiService apiService) {
        this.apiService = apiService;

    }
    
    @GetMapping("/filter-by")
    public Map<String, List<Map<String, Map.Entry<String, Boolean>>>> getAvistamientoEndpoint(
        @RequestParam(defaultValue = "") String filterText) {
        List<Map<String, Map.Entry<String, Boolean>>> modelData = apiService.getAvistamientos(filterText);
        return Map.of("sightings", modelData);
    }

    @PostMapping("/evaluate-sight")
    public void postNoteEndpoint(@RequestParam int id, @RequestParam int nota)  throws Exception  {
        apiService.handleCreateNota(id, nota);
    }

}